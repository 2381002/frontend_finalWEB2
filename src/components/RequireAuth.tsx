import { useAuth } from '../utils/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
