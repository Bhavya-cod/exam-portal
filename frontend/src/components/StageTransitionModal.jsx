import { motion, AnimatePresence } from 'framer-motion';

export default function StageTransitionModal({ stage, nextStage, onStart }) {
  const stageNames = {
    1: 'Aptitude & Logic',
    2: 'Technical MCQs',
    3: 'Live Coding'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-lg p-10 rounded-[3rem] overflow-hidden shadow-2xl border text-center"
          style={{ 
            background: 'rgba(15, 10, 5, 0.8)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            boxShadow: '0 0 50px rgba(249, 115, 22, 0.2)'
          }}
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -z-10" />

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg shadow-orange-500/30"
          >
            ✓
          </motion.div>

          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
            Stage {stage} Complete!
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Great job. You're ready for the next challenge.
          </p>

          <div 
            className="p-6 rounded-2xl mb-10 text-left border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-2">Next Stage</p>
            <h3 className="text-xl font-bold text-white mb-1">Stage {nextStage}: {stageNames[nextStage]}</h3>
            <p className="text-sm text-slate-500">
              {nextStage === 2 ? 'Focus on technical concepts and core CS fundamentals.' : 'Put your logic to the test with real-time algorithm execution.'}
            </p>
          </div>

          <button
            onClick={onStart}
            className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: 'linear-gradient(90deg, #f97316, #f59e0b)',
              color: '#000',
              boxShadow: '0 0 30px rgba(249,115,22,0.4)'
            }}
          >
            <span className="relative z-10">Start Stage {nextStage}</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
