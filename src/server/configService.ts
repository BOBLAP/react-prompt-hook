
import fs from 'fs';
import path from 'path';

// Définir le chemin du fichier de configuration
// Utiliser un répertoire spécifique pour la configuration
const CONFIG_DIR = path.join(process.cwd(), 'config');
const CONFIG_FILE_PATH = path.join(CONFIG_DIR, 'config.json');

console.log(`Chemin du fichier de configuration: ${CONFIG_FILE_PATH}`);

// Types pour la configuration
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

// Configuration par défaut
const DEFAULT_CONFIG: AppConfig = {
  auth: {
    username: "bob",
    password: "1234"
  },
  basicAuth: {
    username: "toto",
    password: "1234",
    enabled: true
  },
  webhook: {
    url: "https://n8n.lagratte.net/webhook-test/b76fe489-7e61-4bca-a65b-8cae9f677655"
  }
};

// Vérifie si le fichier de configuration existe, sinon le crée avec les valeurs par défaut
const ensureConfigFile = (): void => {
  try {
    // S'assurer que le répertoire config existe
    if (!fs.existsSync(CONFIG_DIR)) {
      console.log(`Création du répertoire config: ${CONFIG_DIR}`);
      fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o755 });
      console.log(`Répertoire config créé avec permissions: 0755`);
    }

    // Vérifier si le fichier existe
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      console.log('Fichier de configuration non trouvé, création avec les valeurs par défaut');
      
      // Écrire le fichier avec des permissions 0644 (lecture/écriture pour propriétaire, lecture pour les autres)
      fs.writeFileSync(
        CONFIG_FILE_PATH, 
        JSON.stringify(DEFAULT_CONFIG, null, 2),
        { mode: 0o644 }
      );
      
      console.log(`Configuration file created with default values and permissions: 0644`);
      
      // Vérifier que le fichier a été créé correctement
      if (fs.existsSync(CONFIG_FILE_PATH)) {
        const stats = fs.statSync(CONFIG_FILE_PATH);
        console.log(`Fichier créé avec succès. Mode: ${stats.mode.toString(8)}`);
      } else {
        console.error('Échec de création du fichier malgré aucune erreur levée');
      }
    } else {
      console.log('Fichier de configuration existant trouvé');
      // Vérifier les permissions actuelles
      const stats = fs.statSync(CONFIG_FILE_PATH);
      console.log(`Permissions actuelles du fichier: ${stats.mode.toString(8)}`);
      
      // Assurer que les permissions sont correctes (0644)
      fs.chmodSync(CONFIG_FILE_PATH, 0o644);
      console.log('Permissions du fichier ajustées à 0644');
    }
  } catch (error) {
    console.error('Error creating config file:', error);
    console.error('Details:', error instanceof Error ? error.message : String(error));
    
    // Afficher plus d'informations sur l'environnement
    console.error(`User: ${process.getuid?.() || 'N/A'}, Group: ${process.getgid?.() || 'N/A'}`);
    console.error(`Current working directory: ${process.cwd()}`);
    console.error(`Config directory absolute path: ${path.resolve(CONFIG_DIR)}`);
  }
};

// Récupère la configuration complète
export const getConfig = (): AppConfig => {
  ensureConfigFile();
  try {
    console.log(`Lecture du fichier de configuration: ${CONFIG_FILE_PATH}`);
    const configData = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error reading config file:', error);
    console.error('Falling back to default config');
    // Tenter de recréer le fichier en cas d'erreur de lecture
    try {
      fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), { mode: 0o644 });
      console.log('Config file recreated with default values');
    } catch (writeError) {
      console.error('Failed to recreate config file:', writeError);
    }
    return DEFAULT_CONFIG;
  }
};

// Sauvegarde la configuration complète
export const saveConfig = (config: AppConfig): void => {
  try {
    console.log(`Sauvegarde de la configuration dans: ${CONFIG_FILE_PATH}`);
    
    // S'assurer que le répertoire existe
    if (!fs.existsSync(CONFIG_DIR)) {
      console.log(`Création du répertoire config: ${CONFIG_DIR}`);
      fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o755 });
    }
    
    // Sauvegarder avec les nouvelles données avec mode 0644
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), { 
      encoding: 'utf8', 
      mode: 0o644
    });
    
    console.log('Configuration saved successfully');
    
    // Vérification post-sauvegarde
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const stats = fs.statSync(CONFIG_FILE_PATH);
      console.log(`File stats after save - Size: ${stats.size}, Mode: ${stats.mode.toString(8)}`);
    }
  } catch (error) {
    console.error('Error saving config file:', error);
    console.error('Details:', error instanceof Error ? error.message : String(error));
    
    // Afficher les permissions du répertoire parent
    try {
      const stats = fs.statSync(CONFIG_DIR);
      console.log(`Permissions du répertoire config: ${stats.mode.toString(8)}`);
    } catch (statError) {
      console.error('Erreur lors de la vérification des permissions:', statError);
    }
  }
};

// Fonctions spécifiques pour chaque section de la configuration
export const getAuthConfig = (): AppConfig['auth'] => {
  return getConfig().auth;
};

export const saveAuthConfig = (authConfig: AppConfig['auth']): void => {
  const config = getConfig();
  config.auth = authConfig;
  saveConfig(config);
};

export const getBasicAuthConfig = (): AppConfig['basicAuth'] => {
  return getConfig().basicAuth;
};

export const saveBasicAuthConfig = (basicAuthConfig: AppConfig['basicAuth']): void => {
  const config = getConfig();
  config.basicAuth = basicAuthConfig;
  saveConfig(config);
};

export const getWebhookConfig = (): AppConfig['webhook'] => {
  return getConfig().webhook;
};

export const saveWebhookConfig = (webhookConfig: AppConfig['webhook']): void => {
  const config = getConfig();
  config.webhook = webhookConfig;
  saveConfig(config);
};
