// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { Student, mockStudents, mockAdmin, STORAGE_KEYS } from '@/lib/mockData';

// type UserType = 'student' | 'admin' | null;

// interface AuthContextType {
//   user: Student | typeof mockAdmin | null;
//   userType: UserType;
//   login: (email: string, password: string, type: 'student' | 'admin') => boolean;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<Student | typeof mockAdmin | null>(null);
//   const [userType, setUserType] = useState<UserType>(null);

//   useEffect(() => {
//     // Check for existing session
//     const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
//     const storedType = localStorage.getItem(STORAGE_KEYS.USER_TYPE) as UserType;
    
//     if (storedUser && storedType) {
//       setUser(JSON.parse(storedUser));
//       setUserType(storedType);
//     }
//   }, []);

//   const login = (email: string, password: string, type: 'student' | 'admin'): boolean => {
//     if (type === 'admin') {
//       if (email === mockAdmin.email && password === mockAdmin.password) {
//         setUser(mockAdmin);
//         setUserType('admin');
//         localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockAdmin));
//         localStorage.setItem(STORAGE_KEYS.USER_TYPE, 'admin');
//         return true;
//       }
//     } else {
//       const student = mockStudents.find(s => s.email === email && s.password === password);
//       if (student) {
//         setUser(student);
//         setUserType('student');
//         localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(student));
//         localStorage.setItem(STORAGE_KEYS.USER_TYPE, 'student');
//         return true;
//       }
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     setUserType(null);
//     localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
//     localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
//   };

//   return (
//     <AuthContext.Provider value={{ user, userType, login, logout, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";

// type UserType = "student" | "admin" | null;

// interface User {
//   email: string;
//   role: "student" | "admin";
// }

// interface AuthContextType {
//   user: User | null;
//   userType: UserType;
//   login: (
//     email: string,
//     password: string,
//     type: "student" | "admin"
//   ) => Promise<boolean>;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const API_URL = "https://hostel-tprs.onrender.com/api/auth";

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userType, setUserType] = useState<UserType>(null);

//   // 🔁 Restore login on refresh
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedType = localStorage.getItem("userType");

//     if (storedUser && storedType) {
//       setUser(JSON.parse(storedUser));
//       setUserType(storedType as UserType);
//     }
//   }, []);

//   // 🔐 LOGIN (BACKEND)
//   const login = async (
//     email: string,
//     password: string,
//     type: "student" | "admin"
//   ): Promise<boolean> => {
//     try {
//       const res = await fetch(`${API_URL}/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           type,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         console.error("Login failed:", data.message);
//         return false;
//       }

//       // ✅ Save auth data
//       setUser(data.user);
//       setUserType(type);

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       localStorage.setItem("userType", type);

//       return true;
//     } catch (error) {
//       console.error("Login error:", error);
//       return false;
//     }
//   };

//   // 🚪 LOGOUT
//   const logout = () => {
//     setUser(null);
//     setUserType(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userType");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         userType,
//         login,
//         logout,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // 🪝 Custom hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

type UserType = "student" | "admin" | null;

interface AuthContextType {
  user: { email: string; role: UserType } | null;
  userType: UserType;
  login: (email: string, password: string, type: "student" | "admin") => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<UserType>(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (token && storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserType(parsedUser.role);
    } catch (err) {
      console.error("Invalid user data in localStorage");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
}, []);

  // const login = async (
  //   email: string,
  //   password: string,
  //   type: "student" | "admin"
  // ): Promise<boolean> => {
  //   try {
  //     const res = await axios.post("https://hostel-tprs.onrender.com/api/auth/login", {
  //       email,
  //       password,
  //     });

  //     // ❗ role check
  //     if (res.data.role !== type) {
  //       return false;
  //     }

  //     localStorage.setItem("token", res.data.token);
  //     localStorage.setItem(
  //       "user",
  //       JSON.stringify({ email: res.data.email, role: res.data.role })
  //     );

  //     setUser({ email: res.data.email, role: res.data.role });
  //     setUserType(res.data.role);

  //     return true;
  //   } catch (err) {
  //     console.error("LOGIN ERROR", err);
  //     return false;
  //   }
  // };
  const login = async (
  email: string,
  password: string,
  type: "student" | "admin"
): Promise<boolean> => {
  try {
    const res = await axios.post(
      "https://hostel-tprs.onrender.com/api/auth/login",
      {
        email,
        password,
      }
    );

    const user = res.data.user; // ✅ IMPORTANT

    // ❗ role check
    if (user.role !== type) {
      return false;
    }

    localStorage.setItem("token", res.data.token);

    // ✅ store FULL user object (name, rollNo, email, role)
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ set full user in state
    setUser(user);
    setUserType(user.role);

    return true;
  } catch (err) {
    console.error("LOGIN ERROR", err);
    return false;
  }
};
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
