import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User;
  isFarmer: boolean;
  isBuyer: boolean;
  login: (role: "farmer" | "buyer") => void;
  logout: () => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(authService.getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getCurrentUser());
    };
    window.addEventListener("agrilink_auth_change", handleAuthChange);
    return () => window.removeEventListener("agrilink_auth_change", handleAuthChange);
  }, []);

  const login = (role: "farmer" | "buyer") => {
    const loggedInUser = authService.loginAsRole(role);
    setUser(loggedInUser);
  };

  const logout = () => {
    authService.logout();
    setUser(authService.getCurrentUser());
  };

  const switchUser = (userId: string) => {
    const demoUsers = authService.getAvailableDemoUsers();
    const target = demoUsers.find((u) => u.id === userId);
    if (target) {
      authService.setCurrentUser(target);
      setUser(target);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isFarmer: user.role === "farmer",
        isBuyer: user.role === "buyer",
        login,
        logout,
        switchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
