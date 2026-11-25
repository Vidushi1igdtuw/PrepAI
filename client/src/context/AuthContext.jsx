import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('prepai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.success) {
          setUser(res.user);
          setProfile(res.profile);
          setProgress(res.progress);
        }
      } catch (err) {
        console.error('Failed to authenticate session:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    if (res.success) {
      localStorage.setItem('prepai_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
      setProgress(res.progress);
      return res;
    }
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      localStorage.setItem('prepai_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
      setProgress(res.progress);
      return res;
    }
  };

  const logout = () => {
    localStorage.removeItem('prepai_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setProgress(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.success) {
        setProfile(res.profile);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        progress,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
        setUser,
        setProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
