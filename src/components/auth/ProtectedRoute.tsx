import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC, RoleName } from '@/hooks/useRBAC';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: RoleName[];
  requiredPermission?: {
    action: string;
    resource: string;
  };
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermission,
  fallbackPath = '/auth',
}: ProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { role, isLoading: rbacLoading, hasRole, hasPermission } = useRBAC();

  const isLoading = authLoading || rbacLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-orange" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check required roles
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasRole(...requiredRoles)) {
      return <Navigate to={fallbackPath !== '/auth' ? fallbackPath : '/'} replace />;
    }
  }

  // Check required permission
  if (requiredPermission) {
    if (!hasPermission(requiredPermission.action, requiredPermission.resource)) {
      return <Navigate to={fallbackPath !== '/auth' ? fallbackPath : '/'} replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
