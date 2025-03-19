
import db from './dbService';

// Types for the configuration
export interface AppConfig {
  auth: {
    username: string;
    password: string;
  };
  basicAuth: {
    username: string;
    password: string;
    enabled: boolean;
  };
  webhook: {
    url: string;
  };
}

// Récupère la configuration d'authentification
export const getAuthConfig = (): AppConfig['auth'] => {
  try {
    const stmt = db.prepare('SELECT username, password FROM auth_config WHERE id = 1');
    const result = stmt.get();
    
    if (!result) {
      console.error('No auth configuration found');
      return { username: 'bob', password: '1234' };
    }
    
    return {
      username: result.username,
      password: result.password
    };
  } catch (error) {
    console.error('Error getting auth config:', error);
    return { username: 'bob', password: '1234' };
  }
};

// Sauvegarde la configuration d'authentification
export const saveAuthConfig = (authConfig: AppConfig['auth']): void => {
  try {
    const stmt = db.prepare('UPDATE auth_config SET username = ?, password = ? WHERE id = 1');
    const result = stmt.run(authConfig.username, authConfig.password);
    
    if (result.changes === 0) {
      console.warn('No auth configuration was updated, attempting insert');
      const insertStmt = db.prepare('INSERT OR IGNORE INTO auth_config (id, username, password) VALUES (1, ?, ?)');
      insertStmt.run(authConfig.username, authConfig.password);
    }
  } catch (error) {
    console.error('Error saving auth config:', error);
    throw error;
  }
};

// Récupère la configuration d'authentification basique
export const getBasicAuthConfig = (): AppConfig['basicAuth'] => {
  try {
    const stmt = db.prepare('SELECT username, password, enabled FROM basic_auth_config WHERE id = 1');
    const result = stmt.get();
    
    if (!result) {
      console.error('No basic auth configuration found');
      return { username: 'toto', password: '1234', enabled: true };
    }
    
    return {
      username: result.username,
      password: result.password,
      enabled: Boolean(result.enabled)
    };
  } catch (error) {
    console.error('Error getting basic auth config:', error);
    return { username: 'toto', password: '1234', enabled: true };
  }
};

// Sauvegarde la configuration d'authentification basique
export const saveBasicAuthConfig = (basicAuthConfig: AppConfig['basicAuth']): void => {
  try {
    const stmt = db.prepare('UPDATE basic_auth_config SET username = ?, password = ?, enabled = ? WHERE id = 1');
    const result = stmt.run(
      basicAuthConfig.username, 
      basicAuthConfig.password, 
      basicAuthConfig.enabled ? 1 : 0
    );
    
    if (result.changes === 0) {
      console.warn('No basic auth configuration was updated, attempting insert');
      const insertStmt = db.prepare('INSERT OR IGNORE INTO basic_auth_config (id, username, password, enabled) VALUES (1, ?, ?, ?)');
      insertStmt.run(
        basicAuthConfig.username, 
        basicAuthConfig.password, 
        basicAuthConfig.enabled ? 1 : 0
      );
    }
  } catch (error) {
    console.error('Error saving basic auth config:', error);
    throw error;
  }
};

// Récupère la configuration du webhook
export const getWebhookConfig = (): AppConfig['webhook'] => {
  try {
    const stmt = db.prepare('SELECT url FROM webhook_config WHERE id = 1');
    const result = stmt.get();
    
    if (!result) {
      console.error('No webhook configuration found');
      return { url: 'https://n8n.lagratte.net/webhook-test/b76fe489-7e61-4bca-a65b-8cae9f677655' };
    }
    
    return {
      url: result.url
    };
  } catch (error) {
    console.error('Error getting webhook config:', error);
    return { url: 'https://n8n.lagratte.net/webhook-test/b76fe489-7e61-4bca-a65b-8cae9f677655' };
  }
};

// Sauvegarde la configuration du webhook
export const saveWebhookConfig = (webhookConfig: AppConfig['webhook']): void => {
  try {
    const stmt = db.prepare('UPDATE webhook_config SET url = ? WHERE id = 1');
    const result = stmt.run(webhookConfig.url);
    
    if (result.changes === 0) {
      console.warn('No webhook configuration was updated, attempting insert');
      const insertStmt = db.prepare('INSERT OR IGNORE INTO webhook_config (id, url) VALUES (1, ?)');
      insertStmt.run(webhookConfig.url);
    }
  } catch (error) {
    console.error('Error saving webhook config:', error);
    throw error;
  }
};

// For backward compatibility
export const getConfig = (): AppConfig => {
  return {
    auth: getAuthConfig(),
    basicAuth: getBasicAuthConfig(),
    webhook: getWebhookConfig()
  };
};

// For backward compatibility
export const saveConfig = (config: AppConfig): void => {
  saveAuthConfig(config.auth);
  saveBasicAuthConfig(config.basicAuth);
  saveWebhookConfig(config.webhook);
};
