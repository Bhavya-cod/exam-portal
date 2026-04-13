import { useEffect, useRef } from 'react';
import { useExamStore } from '../store/examStore';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ResultScreen() {
  const { stage1Score, stage2Score, codingScore, proctorWarnings } = useExamStore();
  const { userData } = useAuthStore();
  const navigate = useNavigate();
  const hasSaved = useRef(false);

  const totalScore = stage1Score + stage2Score + codingScore;
  const passed = totalScore >= 25 && proctorWarnings < 5;

  useEffect(() => {
    const saveResults = async () => {
      if (hasSaved.current || !userData) return;
      hasSaved.current = true;
      try {
        await api.post('/api/results', {
          name: userData?.name || "Unknown",
          email: userData?.email || "unknown@domain.com",
          pin: userData?.pin || "N/A",
          branch: userData?.branch || "N/A",
          stage1Score, stage2Score, codingScore, totalScore, proctorWarnings, passed
        });
      } catch (err) { console.error(err); }
    };
    saveResults();
  }, [userData, stage1Score, stage2Score, codingScore, totalScore, proctorWarnings, passed]);

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-xl p-12 rounded-[3.5rem] bg-[#121212] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 text-center relative overflow-hidden"
      >
        {/* Abstract background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] -mr-32 -mt-32"></div>

        <div className="mb-10 flex flex-col items-center relative z-10">
            <div className="w-24 h-24 rounded-[2rem] bg-orange-600 flex items-center justify-center text-4xl mb-8 shadow-2xl shadow-orange-600/40 rotate-12 transition-transform hover:rotate-0">
                🏆
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">Assessment Finalized</h1>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] leading-loose">
               Certified Performance Summary
            </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 mb-10 space-y-6 relative z-10">
            <div className="flex justify-between items-center text-[10px] font-black border-b border-white/5 pb-5">
                <span className="text-white/40 uppercase tracking-[0.2em]">01. Aptitude Stage</span>
                <span className="text-white tracking-widest">{stage1Score} PTS</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black border-b border-white/5 pb-5">
                <span className="text-white/40 uppercase tracking-[0.2em]">02. Technical Stage</span>
                <span className="text-white tracking-widest">{stage2Score} PTS</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black border-b border-white/5 pb-5">
                <span className="text-white/40 uppercase tracking-[0.2em]">03. Expert Coding</span>
                <span className="text-white tracking-widest">{codingScore || 0} PTS</span>
            </div>
            <div className="flex justify-between items-center pt-4">
                <div className="text-left">
                    <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-orange-500 mb-1">Total Aggregate</span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${passed ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} uppercase tracking-widest`}>
                        {passed ? 'Qualification Met' : 'Review Required'}
                    </span>
                </div>
                <span className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl shadow-orange-500">{totalScore}</span>
            </div>
        </div>

        {proctorWarnings > 0 && (
            <div className="mb-10 px-8 py-4 rounded-2xl bg-white/5 text-orange-500 text-[9px] font-black uppercase tracking-[0.3em] border border-orange-500/20">
                PROCTORING ALERTS LOGGED: {proctorWarnings}
            </div>
        )}

        <div className="flex flex-col gap-4 relative z-10">
            <button 
                onClick={() => { window.close(); setTimeout(() => alert("Assessment secure. You can close this window now."), 200); }}
                className="w-full py-6 rounded-2xl bg-white text-[#121212] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-gray-100 active:scale-95 transition-all"
            >
                Secure Close Tab
            </button>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mt-4 italic italic">Candidate: {userData?.name || 'Anonymous'}</p>
        </div>
      </motion.div>
    </div>
  );
}
