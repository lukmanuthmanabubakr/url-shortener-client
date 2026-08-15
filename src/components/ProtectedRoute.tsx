import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthSkeleton() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-text/20 border-t-forge rounded-full animate-spin" />
        <p className="font-body text-sm text-text/50">Checking your session…</p>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isResolving } = useAuth();

  if (isResolving) {
    return <AuthSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}