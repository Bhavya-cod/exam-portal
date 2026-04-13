import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useExamStore } from '../store/examStore';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { userData, logout } = useAuthStore();
  const { currentStage, isSubmitted } = useExamStore();
  const navigate = useNavigate();

  const handleStartProcess = () => {
    if (isSubmitted) {
      navigate('/result');
    } else {
      navigate('/exam');
    }
  };

  const stages = [
    { 
        id: 1, 
        title: "Aptitude & Logic", 
        desc: "Quantitative analysis and logical reasoning to evaluate foundational thinking skills.",
        icon: "🧠"
    },
    { 
        id: 2, 
        title: "Technical MCQs", 
        desc: "Core computer science concepts, object oriented programming, and web semantics.",
        icon: "💻"
    },
    { 
        id: 3, 
        title: "Live Coding", 
        desc: "Write practical, compilable algorithms to solve assigned coding challenges.",
        icon: "⌨️"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-3 bg-[#121212] border-b border-white/5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="border border-orange-500 p-0.5 px-1.5 rounded-sm">
                <span className="text-orange-500 font-black text-lg tracking-tighter leading-none">TECHWING</span>
            </div>
          </div>
          <div className="hidden md:block h-6 w-px bg-white/10"></div>
          <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Enterprise Assessment</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right flex flex-col items-end">
            <p className="text-xs font-black uppercase tracking-widest text-white">{userData?.name || 'Student'}</p>
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-0.5">{userData?.pin || '---'} | {userData?.branch || '---'}</p>
          </div>
          <button 
            onClick={logout}
            className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Technical Assessment</h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Welcome back. Please select a stage to proceed with your assessment. 
            All results are logged in real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stages.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col items-start transition-all duration-300 ${currentStage === s.id ? 'border-orange-500/30' : ''}`}
            >
              {/* Status Badge */}
              <div className="absolute top-8 right-8 flex items-center gap-2">
                {currentStage > s.id ? (
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">✔ Done</span>
                ) : currentStage === s.id ? (
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-100 animate-pulse">● In Progress</span>
                ) : (
                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100">🔒 Locked</span>
                )}
              </div>

              <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-3xl mb-8">
                {s.icon}
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tighter">Stage {s.id}: {s.title}</h3>
              <p className="text-sm text-gray-400 mb-10 leading-relaxed font-medium">
                {s.desc}
              </p>

              {currentStage === s.id && (
                <button 
                  onClick={handleStartProcess}
                  className="mt-auto w-full py-4 bg-[#E65100] hover:bg-[#BF360C] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-900/10 hover:scale-[1.02] active:scale-95"
                >
                  Launch Environment
                </button>
              )}

              {currentStage > s.id && (
                <button 
                   disabled
                   className="mt-auto w-full py-4 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl font-black text-xs uppercase tracking-[0.2em]"
                >
                  Assessment Filed
                </button>
              )}

              {currentStage < s.id && (
                <div className="mt-auto w-full h-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-20 p-8 rounded-[2rem] bg-gray-900 text-white/50 text-[10px] font-bold uppercase tracking-[0.3em] flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> System Status: Online</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Security Level: Maximum</span>
             </div>
             <p>© 2026 TECHWING Assessment Cloud.</p>
        </div>
      </main>
    </div>
  );
}
