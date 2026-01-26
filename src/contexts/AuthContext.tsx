import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, mockStudents, mockAdmin, STORAGE_KEYS } from '@/lib/mockData';

type UserType = 'student' | 'admin' | null;

interface AuthContextType {
  user: Student | typeof mockAdmin | null;
  userType: UserType;
  login: (email: string, password: string, type: 'student' | 'admin') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Student | typeof mockAdmin | null>(null);
  const [userType, setUserType] = useState<UserType>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const storedType = localStorage.getItem(STORAGE_KEYS.USER_TYPE) as UserType;
    
    if (storedUser && storedType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedType);
    }
  }, []);

  const login = (email: string, password: string, type: 'student' | 'admin'): boolean => {
    if (type === 'admin') {
      if (email === mockAdmin.email && password === mockAdmin.password) {
        setUser(mockAdmin);
        setUserType('admin');
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockAdmin));
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, 'admin');
        return true;
      }
    } else {
      const student = mockStudents.find(s => s.email === email && s.password === password);
      if (student) {
        setUser(student);
        setUserType('student');
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(student));
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, 'student');
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, logout, isAuthenticated: !!user }}>
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
