import { create } from 'zustand';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useAuthStore = create((set) => ({
  user: null,
  userData: null,
  loading: true,
  isMock: false,

  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setMockSession: (userData) => {
    sessionStorage.setItem('mock_user', JSON.stringify(userData));
    set({ user: { uid: 'mock-123', email: userData.email }, userData, isMock: true, loading: false });
  },
  logout: async () => {
    try {
      await signOut(auth);
    } catch(e) {}
    sessionStorage.removeItem('mock_user');
    set({ user: null, userData: null, isMock: false });
  },
  initAuth: () => {
    // Fast mock bypassing to eliminate loading delays when no real Firebase is connected
    if (auth.app.options.apiKey === "dummy_api_key") {
      const savedMock = sessionStorage.getItem('mock_user');
      if (savedMock) {
        const data = JSON.parse(savedMock);
        set({ 
          user: { uid: 'mock-123', email: data.email }, 
          userData: data, 
          isMock: true, 
          loading: false 
        });
      } else {
        set({ user: null, userData: null, loading: false, isMock: false });
      }
      return;
    }

    const authTimeout = setTimeout(() => {
      set({ loading: false });
      console.warn("Firebase initialization timed out. Proceeding in offline/fallback mode.");
    }, 3000);

    onAuthStateChanged(auth, async (user) => {
      clearTimeout(authTimeout);
      if (user) {
        set({ user });
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            // Save to sessionStorage as a fallback cache
            sessionStorage.setItem('mock_user', JSON.stringify(userDoc.data()));
            set({ userData: userDoc.data() });
          } else {
            // Firestore doc doesn't exist, try sessionStorage cache
            const cached = sessionStorage.getItem('mock_user');
            if (cached) set({ userData: JSON.parse(cached) });
          }
        } catch (error) {
          // Firestore offline — use sessionStorage cache so the exam can proceed
          console.warn("Firestore offline, using cached user data:", error.message);
          const cached = sessionStorage.getItem('mock_user');
          if (cached) set({ userData: JSON.parse(cached) });
        }
      } else {
        set((state) => {
          if (!state.isMock) return { user: null, userData: null };
          return state;
        });
      }
      set({ loading: false });
    }, (error) => {
      clearTimeout(authTimeout);
      console.warn("Firebase Auth Error:", error.message);
      set({ loading: false });
    });

  }
}));
