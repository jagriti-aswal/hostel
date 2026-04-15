import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

type UserType = "student" | "admin" | null;

interface User {
  email: string;
  role: UserType;
  name?: string;
  rollNo?: string;
}

interface AuthContextType {
  user: User | null;
  userType: UserType;
  login: (
    email: string,
    password: string,
    type: "student" | "admin"
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);

  // =========================
  // RESTORE SESSION
  // =========================
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

  // =========================
  // LOGIN
  // =========================
  const login = async (
    email: string,
    password: string,
    type: "student" | "admin"
  ): Promise<boolean> => {
    try {
      const res = await axios.post(
        "https://hostel-tprs.onrender.com/api/auth/login",
        { email, password }
      );

      // 🔥 SAFE FIX: handle BOTH backend formats
      const user: User = res.data.user || {
        email: res.data.email,
        role: res.data.role,
        name: res.data.name,
        rollNo: res.data.rollNo,
      };

      if (!user || user.role !== type) {
        return false;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setUserType(user.role);

      return true;
    } catch (err) {
      console.error("LOGIN ERROR", err);
      return false;
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};