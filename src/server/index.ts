import express from 'express';
import { 
  getAuthConfig, 
  saveAuthConfig, 
  getBasicAuthConfig, 
  saveBasicAuthConfig, 
  getWebhookConfig, 
  saveWebhookConfig,
  AppConfig
} from './configService';
import path from 'path';
import fs from 'fs';
import './dbService'; // Import to ensure database is initialized

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configuration des journaux pour le débogage
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Define config directory for logging
const CONFIG_DIR = path.join(process.cwd(), 'config');

console.log(`Démarrage du serveur avec SQLite:`);
console.log(`Répertoire courant: ${process.cwd()}`);
console.log(`Répertoire config: ${CONFIG_DIR}`);

// API Routes - Important de placer ces routes AVANT les routes statiques
// pour éviter que les requêtes API soient traitées comme des fichiers statiques
app.get('/api/config/auth', (req, res) => {
  console.log('GET /api/config/auth appelé');
  try {
    const config = getAuthConfig();
    console.log('Auth config récupérée:', config);
    res.json(config);
  } catch (error) {
    console.error('Erreur lors de la récupération de la config auth:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/config/auth', (req, res) => {
  console.log('POST /api/config/auth appelé');
  try {
    const authConfig = req.body as AppConfig['auth'];
    console.log('Nouvelle config auth reçue:', authConfig);
    saveAuthConfig(authConfig);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la config auth:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/config/basicAuth', (req, res) => {
  console.log('GET /api/config/basicAuth appelé');
  try {
    const config = getBasicAuthConfig();
    console.log('Basic auth config récupérée:', config);
    res.json(config);
  } catch (error) {
    console.error('Erreur lors de la récupération de la config basic auth:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/config/basicAuth', (req, res) => {
  console.log('POST /api/config/basicAuth appelé');
  try {
    const basicAuthConfig = req.body as AppConfig['basicAuth'];
    console.log('Nouvelle config basic auth reçue:', basicAuthConfig);
    saveBasicAuthConfig(basicAuthConfig);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la config basic auth:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/config/webhook', (req, res) => {
  console.log('GET /api/config/webhook appelé');
  try {
    const config = getWebhookConfig();
    console.log('Webhook config récupérée:', config);
    res.json(config);
  } catch (error) {
    console.error('Erreur lors de la récupération de la config webhook:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/config/webhook', (req, res) => {
  console.log('POST /api/config/webhook appelé');
  try {
    const webhookConfig = req.body as AppConfig['webhook'];
    console.log('Nouvelle config webhook reçue:', webhookConfig);
    saveWebhookConfig(webhookConfig);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la config webhook:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Servir les fichiers statiques du build APRÈS les routes API
const STATIC_DIR = path.join(process.cwd(), 'dist');
if (fs.existsSync(STATIC_DIR)) {
  console.log(`Répertoire statique trouvé: ${STATIC_DIR}`);
  app.use(express.static(STATIC_DIR));
} else {
  console.error(`Répertoire statique non trouvé: ${STATIC_DIR}`);
}

// Route pour toutes les autres requêtes - important pour le routing côté client
app.get('*', (req, res) => {
  console.log(`Route générique appelée: ${req.url}`);
  if (fs.existsSync(path.join(STATIC_DIR, 'index.html'))) {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  } else {
    console.error('Fichier index.html non trouvé');
    res.status(404).send('Not found');
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Répertoire courant: ${process.cwd()}`);
  console.log(`Répertoire config: ${CONFIG_DIR}`);
  console.log(`Répertoire statique: ${STATIC_DIR}`);
});
