
import { useState, useEffect, createContext, useContext, ReactNode } from "react";

type WebhookSettingsContextType = {
  webhookUrl: string;
  updateWebhookUrl: (url: string) => void;
  testWebhook: (data: any) => Promise<boolean>;
};

const WebhookSettingsContext = createContext<WebhookSettingsContextType | null>(null);

export const WebhookSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem("webhookUrl") || "https://n8n.lagratte.net/webhook-test/aa5d0585-dc51-4609-a503-4837195fc08d";
  });

  useEffect(() => {
    localStorage.setItem("webhookUrl", webhookUrl);
  }, [webhookUrl]);

  const updateWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem("webhookUrl", url);
  };

  const testWebhook = async (data: any): Promise<boolean> => {
    try {
      const { generateBasicAuth } = useBasicAuth();
      const authHeader = generateBasicAuth();
      
      if (!authHeader) {
        console.error("Failed to generate auth header");
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader
        },
        body: JSON.stringify(data || { test: true })
      });

      return response.ok;
    } catch (error) {
      console.error("Error testing webhook:", error);
      return false;
    }
  };

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
