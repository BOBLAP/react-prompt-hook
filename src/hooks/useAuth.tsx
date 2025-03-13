
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Define default credentials
const DEFAULT_USERNAME = "bob";
const DEFAULT_PASSWORD = "1234";

type Credentials = {
  username: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  credentials: Credentials;
  updateCredentials: (newUsername: string, newPassword: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<Credentials>(() => {
    // Try to load saved credentials or use defaults
    const savedCredentials = localStorage.getItem("credentials");
    return savedCredentials 
      ? JSON.parse(savedCredentials) 
      : { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
  });
  
  const navigate = useNavigate();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === credentials.username && password === credentials.password) {
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const updateCredentials = (newUsername: string, newPassword: string) => {
    const newCredentials = { 
      username: newUsername, 
      password: newPassword 
    };
    setCredentials(newCredentials);
    localStorage.setItem("credentials", JSON.stringify(newCredentials));
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      credentials,
      updateCredentials 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
