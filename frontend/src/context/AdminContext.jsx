import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../api/admin';

// Create context
const AdminContext = createContext(null);

// Create provider component
export const AdminProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalTags: 0,
    totalUsers: 0,
    totalViews: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Load initial dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        
        if (response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        
        // If error is 401 or 403, handle authentication/authorization issues
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);
  
  // Refresh dashboard stats
  const refreshStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      
      if (response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError(err.message || 'Failed to refresh dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  // Value to be provided to consumers
  const contextValue = {
    loading,
    error,
    stats,
    recentActivity,
    refreshStats,
  };
  
  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook for using the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  
  return context;
};

export default AdminContext;