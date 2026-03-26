import React, { createContext, useState, useEffect } from 'react';
import { verifyAuth, getAuthToken, clearAuthToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          await verifyAuth();
          setIsAuthenticated(true);
        } catch {
          clearAuthToken();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      loading,
      user,
      setUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
