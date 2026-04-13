import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return user ? children : <Navigate to="/" />;
}
