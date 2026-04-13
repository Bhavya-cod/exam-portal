import { motion } from 'framer-motion';

export default function ProctorWarningModal({ message, onClose, count }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-l-8 border-red-500"
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Proctoring Alert</h2>
            <p className="text-red-600 font-semibold text-sm">Warning {count}</p>
          </div>
        </div>
        
        <p className="text-slate-600 mb-8 border-l-4 border-slate-200 pl-4 py-2 bg-slate-50/50 rounded-r-lg">
          {message}
        </p>
        
        <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm mb-6 border border-orange-100">
          Repeated violations may result in exam termination. Ensure your activity remains strictly within the exam portal.
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-slate-900 text-white p-3.5 rounded-xl font-bold shadow hover:bg-slate-800 transition-all active:scale-95"
        >
          Acknowledge & Continue
        </button>
      </motion.div>
    </div>
  );
}
