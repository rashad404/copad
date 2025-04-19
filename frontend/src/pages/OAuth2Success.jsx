import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function OAuth2Success() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Set authentication state
    setIsAuthenticated(true);
    
    // Redirect to home/dashboard
    navigate('/', { replace: true });
  }, [navigate, setIsAuthenticated]);

  return null; // This component doesn't render anything
} 