
#!/bin/bash

# Script de déploiement pour l'application prompt-creator-flow

# Construire l'image Docker
echo "Construction de l'image Docker..."
docker-compose build

# Arrêter le conteneur existant s'il existe
echo "Arrêt du conteneur existant s'il existe..."
docker-compose down

# Démarrer le nouveau conteneur
echo "Démarrage du nouveau conteneur..."
docker-compose up -d

echo "Déploiement terminé! L'application est accessible à l'adresse http://localhost (ou l'IP de votre VPS)"
