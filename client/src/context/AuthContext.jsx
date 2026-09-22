import React, { createContext, useContext, useState } from 'react';
import { loginUser, signupUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('careerverify_user');
      if (!saved || saved === 'undefined' || saved === 'null') return null;
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (err) {
      console.warn('Failed to parse saved user state:', err);
      localStorage.removeItem('careerverify_user');
      localStorage.removeItem('careerverify_token');
      return null;
    }
  });

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    const userData = res.user || { name: 'User', email, role: 'candidate' };
    setUser(userData);
    localStorage.setItem('careerverify_user', JSON.stringify(userData));
    localStorage.setItem('careerverify_token', res.token || 'demo_token');
    return res;
  };

  const signup = async (name, email, password, role) => {
    const res = await signupUser(name, email, password, role);
    const userData = res.user || { name: name || 'User', email, role: role || 'candidate' };
    setUser(userData);
    localStorage.setItem('careerverify_user', JSON.stringify(userData));
    localStorage.setItem('careerverify_token', res.token || 'demo_token');
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('careerverify_user');
    localStorage.removeItem('careerverify_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
