
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAdminAuthenticated: boolean;
  login: (username: string, password?: string) => Promise<boolean>; // password optional for potential future OAuth
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials for demo purposes
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password";
const AUTH_STORAGE_KEY = "orderdash_admin_auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading to true
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for persisted auth state only on client-side
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth === "true") {
        setIsAdminAuthenticated(true);
      }
    } catch (error) {
      console.warn("Could not access localStorage for authentication:", error);
    }
    setLoading(false); // Set loading to false after attempting to read localStorage
  }, []);

  const login = async (username: string, password?: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
      } catch (error) {
         console.warn("Could not set localStorage for authentication:", error);
      }
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.warn("Could not remove localStorage item for authentication:", error);
    }
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAdminAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
