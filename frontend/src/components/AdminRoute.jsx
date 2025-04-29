import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('AdminRoute Debug:', {
    isAuthenticated,
    user,
    userRoles: user?.roles,
    loading,
    isAdmin: user?.roles?.includes('ADMIN')
  });

  // Show loading state while checking authentication
  if (loading) {
    console.log('AdminRoute: Still loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Check if user is authenticated and has admin role
  if (!isAuthenticated) {
    console.log('AdminRoute: User is not authenticated');
    return <Navigate to="/login" replace />;
  }

  if (!user?.roles?.includes('ADMIN')) {
    console.log('AdminRoute: User is authenticated but not admin. Roles:', user?.roles);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('AdminRoute: Successfully verified admin access');
  return <Outlet />;
};

export default AdminRoute; 