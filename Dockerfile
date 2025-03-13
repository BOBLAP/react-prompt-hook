# Étape 1: Construire l'application React avec Vite
FROM node:20-alpine AS build

WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps && npm install -g vite@6.2.1

# Copier tout le projet et builder l'application
COPY . ./
RUN npm run build

# Étape 2: Servir l'application avec Vite
FROM node:20-alpine
WORKDIR /app

# Réinstaller Vite dans l'image finale
RUN npm install -g vite@6.2.1 serve

# Copier les fichiers compilés
COPY --from=build /app/dist ./dist

# Démarrer Vite en gardant le container actif
CMD ["sh", "-c", "vite preview --port 3001 && tail -f /dev/null"]
