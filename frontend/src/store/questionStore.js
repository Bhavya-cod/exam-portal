import { create } from 'zustand';
import api from '../services/api';

export const useQuestionStore = create((set) => ({
  mcqs: [],
  codingQs: [],
  results: [],
  loading: false,

  fetchQuestions: async () => {
    set({ loading: true });
    try {
      // Securely fetch from backend — answers are stripped server-side
      const { data } = await api.get('/api/questions');
      set({ 
        mcqs: data.mcqs || [], 
        codingQs: data.codingQs || [],
        loading: false 
      });
    } catch (error) {
      console.error("Failed to load questions from backend:", error);
      set({ loading: false });
    }
  },

  addMCQ: (q) => set(state => ({ mcqs: [...state.mcqs, { ...q, id: Date.now().toString() }] })),
  editMCQ: (id, q) => set(state => ({ mcqs: state.mcqs.map(prev => prev.id === id ? { ...q, id } : prev) })),
  deleteMCQ: (id) => set(state => ({ mcqs: state.mcqs.filter(q => q.id !== id) })),
  
  addCoding: (q) => set(state => ({ codingQs: [...state.codingQs, { ...q, id: Date.now().toString() }] })),
  editCoding: (id, q) => set(state => ({ codingQs: state.codingQs.map(prev => prev.id === id ? { ...q, id } : prev) })),
  deleteCoding: (id) => set(state => ({ codingQs: state.codingQs.filter(q => q.id !== id) }))
}));
