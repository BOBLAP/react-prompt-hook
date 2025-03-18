
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useBasicAuth } from "./useBasicAuth";
import { fetchWebhookConfig, updateWebhookConfig } from "@/services/api";
import { toast } from "sonner";

type WebhookSettingsContextType = {
  webhookUrl: string;
  updateWebhookUrl: (url: string) => void;
  testWebhook: (data: any) => Promise<boolean>;
};

const WebhookSettingsContext = createContext<WebhookSettingsContextType | null>(null);

export const WebhookSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const { generateBasicAuth, authEnabled } = useBasicAuth();

  // Charger la configuration du webhook depuis le serveur
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchWebhookConfig();
        setWebhookUrl(config.url);
      } catch (error) {
        console.error("Error loading webhook config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateWebhookUrl = async (url: string) => {
    try {
      if (!url) {
        toast.error("L'URL du webhook ne peut pas être vide");
        return;
      }

      const success = await updateWebhookConfig({ url });
      
      if (success) {
        setWebhookUrl(url);
        toast.success("URL du webhook mise à jour avec succès");
      } else {
        toast.error("Erreur lors de la mise à jour de l'URL du webhook");
      }
    } catch (error) {
      console.error("Error updating webhook URL:", error);
      toast.error("Erreur lors de la mise à jour de l'URL du webhook");
    }
  };

  const testWebhook = async (data: any): Promise<boolean> => {
    try {
      console.log("Testing webhook with URL:", webhookUrl);
      console.log("Auth enabled:", authEnabled);
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (authEnabled) {
        const authHeader = generateBasicAuth();
        console.log("Auth header generated:", authHeader ? "Yes" : "No");
        
        if (authHeader) {
          headers["Authorization"] = authHeader;
        } else {
          console.warn("Failed to generate auth header despite auth being enabled");
        }
      }

      console.log("Request headers:", headers);
      console.log("Request payload:", data);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(data || { test: true })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Webhook test failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.ok;
    } catch (error) {
      console.error("Error testing webhook:", error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <WebhookSettingsContext.Provider value={{ 
        webhookUrl: "", 
        updateWebhookUrl: async () => {},
        testWebhook: async () => false
      }}>
        {children}
      </WebhookSettingsContext.Provider>
    );
  }

  return (
    <WebhookSettingsContext.Provider value={{ 
      webhookUrl, 
      updateWebhookUrl,
      testWebhook
    }}>
      {children}
    </WebhookSettingsContext.Provider>
  );
};

export const useWebhookSettings = (): WebhookSettingsContextType => {
  const context = useContext(WebhookSettingsContext);
  if (!context) {
    throw new Error("useWebhookSettings must be used within a WebhookSettingsProvider");
  }
  return context;
};
