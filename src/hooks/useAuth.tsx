
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthConfig, updateAuthConfig } from "@/services/api";
import { toast } from "sonner";

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
  const [credentials, setCredentials] = useState<Credentials>({ 
    username: DEFAULT_USERNAME, 
    password: DEFAULT_PASSWORD 
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // Charger les identifiants depuis le serveur au démarrage
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const config = await fetchAuthConfig();
        setCredentials(config);
      } catch (error) {
        console.error("Error loading auth credentials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCredentials();
  }, []);

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

  const updateCredentials = async (newUsername: string, newPassword: string) => {
    if (!newUsername) {
      toast.error("Le nom d'utilisateur ne peut pas être vide");
      return;
    }

    const newCredentials = { 
      username: newUsername, 
      password: newPassword || credentials.password
    };

    try {
      const success = await updateAuthConfig(newCredentials);
      
      if (success) {
        setCredentials(newCredentials);
        toast.success("Identifiants mis à jour avec succès");
      } else {
        toast.error("Erreur lors de la mise à jour des identifiants");
      }
    } catch (error) {
      console.error("Error updating credentials:", error);
      toast.error("Erreur lors de la mise à jour des identifiants");
    }
  };

  if (isLoading) {
    return null; // ou un composant de chargement
  }

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
