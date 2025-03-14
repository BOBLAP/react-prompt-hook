
import { useState, useEffect } from 'react';

type AuthCredentials = {
  username: string;
  password: string;
  enabled: boolean;
};

export const useBasicAuth = () => {
  const [credentials, setCredentials] = useState<AuthCredentials>(() => {
    const savedAuth = localStorage.getItem('basicAuthConfig');
    return savedAuth 
      ? JSON.parse(savedAuth) 
      : { username: "toto", password: "1234", enabled: true };
  });

  useEffect(() => {
    localStorage.setItem('basicAuthConfig', JSON.stringify(credentials));
  }, [credentials]);

  const updateCredentials = (username: string, password: string) => {
    setCredentials(prev => ({ ...prev, username, password }));
  };

  const toggleAuthEnabled = (enabled: boolean) => {
    setCredentials(prev => ({ ...prev, enabled }));
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

  return { 
    generateBasicAuth,
    updateCredentials,
    toggleAuthEnabled,
    authEnabled: credentials.enabled,
    authUsername: credentials.username,
    authPassword: credentials.password
  };
};
