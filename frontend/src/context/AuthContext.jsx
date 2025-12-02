import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., check for token in localStorage)
    // For a more robust check, we should make a request to /api/users/me (if available) or verify the token.
    // Here we'll just check for existence of token for simplicity and potentially decode it if needed.
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    const { token, data } = response.data; // Adjust based on actual API response structure

    // API returns token and usually user data.
    // Based on standard practices, we save token.
    localStorage.setItem('token', token);

    // Assuming API returns user object in `data.user` based on typical patterns or `data` itself.
    // Looking at the README, the login response structure isn't fully detailed but usually follows:
    // { status: 'success', token, data: { user: { ... } } }
    const userData = data.user;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password, passwordConfirm) => {
    const response = await api.post('/users/signup', { name, email, password, passwordConfirm });
    const { token, data } = response.data;
    localStorage.setItem('token', token);
    const userData = data.user;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserPassword = async (passwordCurrent, password, passwordConfirm) => {
      await api.patch('/users/updateMyPassword', { passwordCurrent, password, passwordConfirm });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUserPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
