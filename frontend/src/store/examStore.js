import { create } from 'zustand';

export const useExamStore = create((set) => ({
  currentStage: 1, // 1: Aptitude, 2: Tech, 3: Coding
  stage1Score: 0,
  stage2Score: 0,
  codingScore: 0,
  proctorWarnings: 0,
  isSubmitted: false,
  setStage: (stage) => set({ currentStage: stage }),
  addWarning: () => set((state) => ({ proctorWarnings: state.proctorWarnings + 1 })),
  submitStage1: (score) => set({ stage1Score: score, currentStage: 2 }),
  submitStage2: (score) => set({ stage2Score: score, currentStage: 3 }),
  submitExam: (score) => set({ codingScore: score, currentStage: 4, isSubmitted: true }) // 4 = finished
}));
