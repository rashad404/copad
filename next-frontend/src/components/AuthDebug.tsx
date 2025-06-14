'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Component to debug authentication issues
 * Can be added to any page temporarily to check auth status
 */
export default function AuthDebug() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [jwtContent, setJwtContent] = useState<any>(null);
  
  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Decode the JWT payload (without verification - this is just for debugging)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        setJwtContent(JSON.parse(jsonPayload));
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
        setJwtContent({ error: 'Failed to decode token' });
      }
    }
  }, []);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow my-4 text-sm overflow-auto max-h-96">
      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Auth Debug Information</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="font-bold text-gray-700 dark:text-gray-300">Status</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
          <p className="font-bold text-gray-700 dark:text-gray-300">User Object</p>
          <pre className="whitespace-pre-wrap text-xs">
            {user ? JSON.stringify(user, null, 2) : 'No user'}
          </pre>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-2 rounded">
        <p className="font-bold text-gray-700 dark:text-gray-300">JWT Payload</p>
        <pre className="whitespace-pre-wrap text-xs">
          {jwtContent ? JSON.stringify(jwtContent, null, 2) : 'No token'}
        </pre>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>This component is for debugging only. Remove from production.</p>
      </div>
    </div>
  );
}