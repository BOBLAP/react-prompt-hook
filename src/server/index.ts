
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

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Servir les fichiers statiques du build
const STATIC_DIR = path.join(process.cwd(), 'dist');
if (fs.existsSync(STATIC_DIR)) {
  app.use(express.static(STATIC_DIR));
}

// Routes API pour la configuration
app.get('/api/config/auth', (req, res) => {
  res.json(getAuthConfig());
});

app.post('/api/config/auth', (req, res) => {
  try {
    const authConfig = req.body as AppConfig['auth'];
    saveAuthConfig(authConfig);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/config/basicAuth', (req, res) => {
  res.json(getBasicAuthConfig());
});

app.post('/api/config/basicAuth', (req, res) => {
  try {
    const basicAuthConfig = req.body as AppConfig['basicAuth'];
    saveBasicAuthConfig(basicAuthConfig);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/config/webhook', (req, res) => {
  res.json(getWebhookConfig());
});

app.post('/api/config/webhook', (req, res) => {
  try {
    const webhookConfig = req.body as AppConfig['webhook'];
    saveWebhookConfig(webhookConfig);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Route pour toutes les autres requêtes - important pour le routing côté client
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(STATIC_DIR, 'index.html'))) {
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  } else {
    res.status(404).send('Not found');
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
