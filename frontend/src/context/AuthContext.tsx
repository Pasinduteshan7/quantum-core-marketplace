'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (name: string, email: string, pass: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('quantum_token');
        const storedUser = localStorage.getItem('quantum_user');
        if (storedToken && storedUser) {
          // If the token is a dummy demo token, purge it immediately so real auth is used
          if (storedToken.startsWith('demo-jwt-token')) {
            localStorage.removeItem('quantum_token');
            localStorage.removeItem('quantum_user');
            setLoading(false);
            return;
          }
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    const res = await authService.login(email, pass);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const register = async (name: string, email: string, pass: string): Promise<AuthResponse> => {
    const res = await authService.register(name, email, pass);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        loading,
        login,
        register,
        logout
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
