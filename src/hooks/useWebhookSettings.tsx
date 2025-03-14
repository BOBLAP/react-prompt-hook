
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useBasicAuth } from "./useBasicAuth";

type WebhookSettingsContextType = {
  webhookUrl: string;
  updateWebhookUrl: (url: string) => void;
  testWebhook: (data: any) => Promise<boolean>;
};

const WebhookSettingsContext = createContext<WebhookSettingsContextType | null>(null);

export const WebhookSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem("webhookUrl") || "https://n8n.lagratte.net/webhook-test/b76fe489-7e61-4bca-a65b-8cae9f677655";
  });

  const { generateBasicAuth, authEnabled } = useBasicAuth();

  useEffect(() => {
    localStorage.setItem("webhookUrl", webhookUrl);
  }, [webhookUrl]);

  const updateWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem("webhookUrl", url);
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
