import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import { useQuestionStore } from '../store/questionStore';
import { startProctoring } from '../utils/proctoring';
import ProctorWarningModal from '../components/ProctorWarningModal';
import StageTransitionModal from '../components/StageTransitionModal';
import { motion } from 'framer-motion';
import api from '../services/api';

const FrontendEditor = lazy(() => import('../components/FrontendEditor'));
const BackendEditor = lazy(() => import('../components/BackendEditor'));

export default function ExamRoom() {
  const { currentStage, submitStage1, submitStage2, submitExam, addWarning, proctorWarnings } = useExamStore();
  const navigate = useNavigate();
  const { mcqs, codingQs } = useQuestionStore();
  const activeQuestions = mcqs.filter(q => q.stage === String(currentStage));
  const activeCoding = codingQs.length > 0 ? codingQs[0] : null;

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('exam_time_left');
    const savedStage = localStorage.getItem('exam_current_stage');
    if (saved && savedStage === String(currentStage)) return parseInt(saved);
    if (currentStage === 3) return 60 * 45;
    return (activeQuestions.length * 60) || (60 * 15);
  });

  const [warningMsg, setWarningMsg] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionInfo, setTransitionInfo] = useState({ completed: 0, next: 0 });
  const [confirmAction, setConfirmAction] = useState(null); 

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({ 0: true });
  const [codingType, setCodingType] = useState('frontend'); 
  const backendEditorRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
    setVisitedQuestions({ 0: true });
  }, [currentStage]);

  const currentQuestion = activeQuestions[currentIndex];

  useEffect(() => {
    const cleanupProctoring = startProctoring((msg) => {
      setWarningMsg(msg);
      addWarning();
    });
    return () => cleanupProctoring();
  }, [addWarning]);

  useEffect(() => {
    if (isTransitioning) return;
    if (timeLeft <= 0) { handleStageSubmit(true); return; }
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        localStorage.setItem('exam_time_left', next);
        localStorage.setItem('exam_current_stage', currentStage);
        return next;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, currentStage, isTransitioning]);

  const handleOptionSelect = (qId, option) => setAnswers(prev => ({ ...prev, [qId]: option }));

  const handleQuestionSubmit = () => {
    if (!currentQuestion || !answers[currentQuestion.id]) return;
    setSubmittedAnswers(prev => ({ ...prev, [currentQuestion.id]: true }));
  };

  const doStageSubmit = async () => {
    if (currentStage === 3) {
      if (codingType === 'backend' && backendEditorRef.current) await backendEditorRef.current.evaluate();
      localStorage.removeItem('exam_time_left');
      localStorage.removeItem('exam_current_stage');
      navigate('/result');
      return;
    }

    try {
      const { data } = await api.post('/api/questions/evaluate', { stage: currentStage, answers });
      const score = data.score || 0;
      if (currentStage === 1) {
        submitStage1(score); setAnswers({}); setSubmittedAnswers({});
        localStorage.removeItem('exam_time_left');
        setTransitionInfo({ completed: 1, next: 2 }); setIsTransitioning(true);
      } else if (currentStage === 2) {
        submitStage2(score); setSubmittedAnswers({});
        localStorage.removeItem('exam_time_left');
        setTransitionInfo({ completed: 2, next: 3 }); setIsTransitioning(true);
      }
    } catch (err) { alert("Failed to evaluate submission."); }
  };

  const handleStageSubmit = (auto = false) => {
    if (auto) { doStageSubmit(); return; }
    const msg = currentStage === 3 ? 'Are you sure you want to end the exam?' : 'Are you sure you want to submit this stage?';
    setConfirmAction({ message: msg, onConfirm: doStageSubmit });
  };

  const handleStartNextStage = () => {
    setIsTransitioning(false);
    if (currentStage === 2) { setTimeLeft(mcqs.filter(q => q.stage === "2").length * 60 || 60 * 20); }
    else if (currentStage === 3) { setTimeLeft(60 * 45); }
  };

  const goToQuestion = (idx) => { setCurrentIndex(idx); setVisitedQuestions(prev => ({ ...prev, [idx]: true })); };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  // Removed the "Preparing Environment" block for faster entry
  /* if (activeQuestions.length === 0 && currentStage < 3) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mb-4"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Preparing Environment...</p>
      </div>
    );
  } */

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {warningMsg && <ProctorWarningModal message={warningMsg} onClose={() => setWarningMsg(null)} count={proctorWarnings} />}
      {isTransitioning && <StageTransitionModal stage={transitionInfo.completed} nextStage={transitionInfo.next} onStart={handleStartNextStage} />}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-black uppercase tracking-widest mb-2">Confirm Submission</h2>
            <p className="text-sm text-gray-400 mb-8">{confirmAction.message}</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmAction(null)} className="flex-1 py-4 rounded-2xl bg-gray-50 text-gray-400 font-black uppercase text-xs tracking-widest">Cancel</button>
              <button onClick={() => { setConfirmAction(null); confirmAction.onConfirm(); }} className="flex-1 py-4 rounded-2xl bg-[#E65100] text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-900/20">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="shrink-0 px-8 py-3 bg-[#121212] flex items-center justify-between shadow-xl z-20">
        <div className="flex items-center gap-6">
            <div className="border border-orange-500 p-0.5 px-1.5 rounded-sm">
                <span className="text-orange-500 font-black text-xs tracking-tighter">TECHWING</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Assessment Stage {currentStage}</span>
        </div>

        <div className="flex items-center gap-10">
            <div className={`font-mono text-2xl font-black tracking-widest ${timeLeft < 300 ? 'text-red-500' : 'text-orange-500'}`}>
                {formatTime(timeLeft)}
            </div>
            <button 
                onClick={() => handleStageSubmit()}
                className="px-8 py-2.5 bg-[#E65100] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-900/20 active:scale-95 transition-all"
            >
                {currentStage === 3 ? 'Finish Exam' : 'Next Stage'}
            </button>
        </div>
      </nav>

      {currentStage < 3 && (
        <div className="w-full h-1 bg-white/5 z-20">
          <motion.div 
            initial={{ width: 0 }} animate={{ width: `${(Object.keys(answers).length / activeQuestions.length) * 100}%` }}
            className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
          />
        </div>
      )}

      <main className="flex-1 flex min-h-0 bg-white">
        {/* Sidebar */}
        {currentStage < 3 && (
            <aside className="w-80 bg-black/[0.03] backdrop-blur-xl border-r border-black/5 p-8 overflow-y-auto hidden lg:block">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Progress Manager</p>
                <div className="grid grid-cols-4 gap-3">
                    {activeQuestions.map((q, idx) => {
                        const isSelected = currentIndex === idx;
                        const isAnswered = answers[q.id];
                        const isSubmitted = submittedAnswers[q.id];
                        const isVisited = visitedQuestions[idx];

                        return (
                            <button
                                key={idx}
                                onClick={() => goToQuestion(idx)}
                                className={`h-11 rounded-xl font-bold flex items-center justify-center transition-all ${isSelected ? 'scale-110 shadow-lg' : 'hover:scale-105'}`}
                                style={{
                                    background: isSelected ? '#121212' : isSubmitted ? '#22c55e' : isAnswered ? '#f97316' : isVisited ? '#eab308' : '#f8fafc',
                                    border: isSelected ? 'none' : `1px solid ${isSubmitted ? '#16a34a' : isAnswered ? '#ea580c' : isVisited ? '#ca8a04' : '#e2e8f0'}`,
                                    color: (isSelected || isSubmitted || isAnswered || isVisited) ? '#fff' : '#94a3b8'
                                }}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>
                
                <div className="mt-12 space-y-4 pt-12 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div> Finalized
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div> In Review
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div> Not Answered
                    </div>
                </div>
            </aside>
        )}

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto ${currentStage === 3 ? 'p-4 lg:p-8' : 'p-12 lg:p-20'} flex flex-col items-center bg-black/[0.01] backdrop-blur-sm`}>
            <div className={`w-full ${currentStage === 3 ? 'max-w-7xl' : 'max-w-3xl'}`}>
                {currentStage < 3 && currentQuestion && (
                    <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="mb-12 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 bg-orange-50 px-6 py-2 rounded-full border border-orange-100 shadow-sm">
                                Question {currentIndex + 1} <span className="mx-2 text-orange-300">/</span> {activeQuestions.length}
                            </span>
                        </div>

                        <div className="relative p-10 rounded-[2rem] bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm mb-12 group overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="text-8xl font-black italic">Q{currentIndex + 1}</span>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight uppercase tracking-tight relative z-10">
                                {currentQuestion.text}
                            </h2>
                        </div>

                        <div className="space-y-4 mb-20">
                            {currentQuestion.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionSelect(currentQuestion.id, opt)}
                                    disabled={submittedAnswers[currentQuestion.id]}
                                    className={`w-full group p-10 rounded-[1.5rem] flex items-center justify-between border-4 transition-all text-left ${answers[currentQuestion.id] === opt ? 'border-green-500 bg-white shadow-xl shadow-green-500/10' : 'border-gray-50 bg-white hover:border-gray-200 text-gray-900'}`}
                                >
                                    <span className={`text-xl font-bold ${answers[currentQuestion.id] === opt ? 'text-green-600' : 'text-gray-600 group-hover:text-gray-900'}`}>{opt}</span>
                                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${answers[currentQuestion.id] === opt ? 'border-green-500 bg-green-500' : 'border-gray-100' }`}>
                                        {answers[currentQuestion.id] === opt && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-12 border-t border-gray-100">
                            <button onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0} className="px-8 py-3 bg-gray-50 text-gray-400 rounded-full font-black text-xs uppercase tracking-widest disabled:opacity-0 active:scale-95 transition-all">← Prev</button>
                            <button 
                                onClick={() => { if(answers[currentQuestion.id]) handleQuestionSubmit(); if (currentIndex < activeQuestions.length - 1) goToQuestion(currentIndex + 1); else handleStageSubmit(); }}
                                className="px-10 py-3 bg-[#121212] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-200 active:scale-95 transition-all"
                            >
                                {currentIndex < activeQuestions.length - 1 ? (answers[currentQuestion.id] ? 'Save & Continue →' : 'Skip & Continue →') : 'Submit Assessment'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {currentStage === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[85vh]">
                        <div className="mb-8 p-10 rounded-[2.5rem] bg-[#121212] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                            <div className="z-10">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{activeCoding?.title || 'Coding Sprint'}</h2>
                                <p className="text-xs text-white/40 uppercase tracking-widest font-bold max-w-md">{activeCoding?.description}</p>
                            </div>
                            <div className="z-10 bg-white/5 p-1 rounded-2xl flex border border-white/5">
                                <button onClick={() => setCodingType('frontend')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${codingType === 'frontend' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>Frontend</button>
                                <button onClick={() => setCodingType('backend')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${codingType === 'backend' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>Backend</button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                            <Suspense fallback={ <div className="absolute inset-0 flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-200"></div></div> }>
                                {codingType === 'frontend' ? <FrontendEditor /> : <BackendEditor ref={backendEditorRef} testCases={activeCoding?.testCases ? JSON.parse(activeCoding.testCases) : []} onGraded={(score) => { localStorage.clear(); submitExam(score); }} />}
                            </Suspense>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
