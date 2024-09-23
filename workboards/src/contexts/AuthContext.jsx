import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, logout } from '../api';
import { useValidateTokenQuery } from '../store/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const { data: validationResponse } = useValidateTokenQuery(undefined, {
    skip: !token, // Skip the query if there's no token
    pollingInterval: 10000, // Optional: poll every 10 seconds
  });

  useEffect(() => {
    if (validationResponse?.isValid) {
      setUser({ token });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [validationResponse]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to validate the token with the backend here
      setUser({ token });
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setUser({ token });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);