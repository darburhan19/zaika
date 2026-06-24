import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

export function ProtectedRoute({ children, admin = false }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (admin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
