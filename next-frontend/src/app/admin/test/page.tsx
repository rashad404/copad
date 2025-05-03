'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthDebug from '@/components/AuthDebug';

export default function AdminTestPage() {
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setToken(storedToken);
    
    // Decode token if available
    if (storedToken) {
      try {
        const payload = storedToken.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Authentication Test</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Authentication Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Auth Context State</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-medium">Loading:</span> {isLoading ? 'Yes' : 'No'}</li>
                <li><span className="font-medium">Authenticated:</span> {isAuthenticated ? 'Yes' : 'No'}</li>
                <li><span className="font-medium">Is Admin:</span> {isAdmin ? 'Yes' : 'No'}</li>
                <li>
                  <span className="font-medium">User:</span> {user ? (
                    <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  ) : 'Not logged in'}
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Token Details</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-medium">Token Present:</span> {token ? 'Yes' : 'No'}</li>
                {decodedToken && (
                  <>
                    <li><span className="font-medium">Subject:</span> {decodedToken.sub}</li>
                    <li><span className="font-medium">Roles:</span> {JSON.stringify(decodedToken.roles)}</li>
                    <li><span className="font-medium">Expiration:</span> {new Date(decodedToken.exp * 1000).toLocaleString()}</li>
                    <li>
                      <span className="font-medium">Full Payload:</span>
                      <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                        {JSON.stringify(decodedToken, null, 2)}
                      </pre>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
        <h2 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Detailed Auth Debug</h2>
        <AuthDebug />
      </div>
    </div>
  );
}