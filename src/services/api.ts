
// Service API pour interagir avec le backend
const API_BASE_URL = '/api';

// Types pour la configuration
export interface AuthConfig {
  username: string;
  password: string;
}

export interface BasicAuthConfig {
  username: string;
  password: string;
  enabled: boolean;
}

export interface WebhookConfig {
  url: string;
}

// API pour la configuration d'authentification
export const fetchAuthConfig = async (): Promise<AuthConfig> => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/auth`);
    if (!response.ok) throw new Error('Failed to fetch auth config');
    return await response.json();
  } catch (error) {
    console.error('Error fetching auth config:', error);
    // Retourner une configuration par défaut en cas d'erreur
    return { username: 'bob', password: '1234' };
  }
};

export const updateAuthConfig = async (config: AuthConfig): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) throw new Error('Failed to update auth config');
    return true;
  } catch (error) {
    console.error('Error updating auth config:', error);
    return false;
  }
};

// API pour la configuration d'authentification Basic
export const fetchBasicAuthConfig = async (): Promise<BasicAuthConfig> => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/basicAuth`);
    if (!response.ok) throw new Error('Failed to fetch basic auth config');
    return await response.json();
  } catch (error) {
    console.error('Error fetching basic auth config:', error);
    // Retourner une configuration par défaut en cas d'erreur
    return { username: 'toto', password: '1234', enabled: true };
  }
};

export const updateBasicAuthConfig = async (config: BasicAuthConfig): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/basicAuth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) throw new Error('Failed to update basic auth config');
    return true;
  } catch (error) {
    console.error('Error updating basic auth config:', error);
    return false;
  }
};

// API pour la configuration du webhook
export const fetchWebhookConfig = async (): Promise<WebhookConfig> => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/webhook`);
    if (!response.ok) throw new Error('Failed to fetch webhook config');
    return await response.json();
  } catch (error) {
    console.error('Error fetching webhook config:', error);
    // Retourner une configuration par défaut en cas d'erreur
    return { url: 'https://n8n.lagratte.net/webhook-test/b76fe489-7e61-4bca-a65b-8cae9f677655' };
  }
};

export const updateWebhookConfig = async (config: WebhookConfig): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/config/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) throw new Error('Failed to update webhook config');
    return true;
  } catch (error) {
    console.error('Error updating webhook config:', error);
    return false;
  }
};
