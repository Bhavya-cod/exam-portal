import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useQuestionStore } from './store/questionStore';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import ExamRoom from './pages/ExamRoom';
const ResultScreen = lazy(() => import('./pages/ResultScreen'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Shared professional loading spinner component
const Loader = () => (
  <div className="flex z-50 fixed inset-0 items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">TECHWING Assessment Cloud</span>
    </div>
  </div>
);

export default function App() {
  const { initAuth, loading, user } = useAuthStore();
  const { fetchQuestions } = useQuestionStore();

  useEffect(() => {
    initAuth();
    fetchQuestions();
  }, [initAuth, fetchQuestions]);

  // Removed the global loading gate for instant starting
  // if (loading) { return <Loader />; }

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/exam" element={<PrivateRoute><ExamRoom /></PrivateRoute>} />
          <Route path="/result" element={<PrivateRoute><ResultScreen /></PrivateRoute>} />
          
          {/* Admin Routes */}
          <Route path="/results-admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}


