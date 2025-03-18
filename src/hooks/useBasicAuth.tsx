
import { useState, useEffect } from 'react';
import { fetchBasicAuthConfig, updateBasicAuthConfig } from '@/services/api';
import { toast } from "sonner";

type AuthCredentials = {
  username: string;
  password: string;
  enabled: boolean;
};

export const useBasicAuth = () => {
  const [credentials, setCredentials] = useState<AuthCredentials>({
    username: "toto", 
    password: "1234", 
    enabled: true
  });
  const [isLoading, setIsLoading] = useState(true);

  // Charger la configuration depuis le serveur
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchBasicAuthConfig();
        setCredentials(config);
      } catch (error) {
        console.error("Error loading basic auth config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateCredentials = async (username: string, password: string) => {
    try {
      const newCredentials = { ...credentials, username, password };
      const success = await updateBasicAuthConfig(newCredentials);
      
      if (success) {
        setCredentials(newCredentials);
        toast.success("Paramètres d'authentification mis à jour avec succès");
      } else {
        toast.error("Erreur lors de la mise à jour des paramètres d'authentification");
      }
    } catch (error) {
      console.error("Error updating basic auth credentials:", error);
      toast.error("Erreur lors de la mise à jour des paramètres d'authentification");
    }
  };

  const toggleAuthEnabled = async (enabled: boolean) => {
    try {
      const newCredentials = { ...credentials, enabled };
      const success = await updateBasicAuthConfig(newCredentials);
      
      if (success) {
        setCredentials(newCredentials);
        toast.success(`Authentification ${enabled ? "activée" : "désactivée"}`);
      } else {
        toast.error("Erreur lors de la mise à jour des paramètres d'authentification");
      }
    } catch (error) {
      console.error("Error toggling basic auth:", error);
      toast.error("Erreur lors de la mise à jour des paramètres d'authentification");
    }
  };

  const generateBasicAuth = () => {
    try {
      if (!credentials.enabled) {
        console.log("Basic auth is disabled");
        return null; // Return null if authentication is disabled
      }
      
      // Create the Basic Auth string: "Basic " + base64(username:password)
      const credString = `${credentials.username}:${credentials.password}`;
      console.log("Generating auth with credentials:", credString);
      const base64Credentials = btoa(credString);
      return `Basic ${base64Credentials}`;
    } catch (error) {
      console.error("Error generating Basic Auth:", error);
      return null;
    }
  };

  if (isLoading) {
    return { 
      generateBasicAuth: () => null,
      updateCredentials: async () => {},
      toggleAuthEnabled: async () => {},
      authEnabled: false,
      authUsername: "",
      authPassword: ""
    };
  }

  return { 
    generateBasicAuth,
    updateCredentials,
    toggleAuthEnabled,
    authEnabled: credentials.enabled,
    authUsername: credentials.username,
    authPassword: credentials.password
  };
};
