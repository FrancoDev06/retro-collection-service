# Étape 1: Image de base avec Node.js
# On utilise une version LTS (Long Term Support) de Node.js
FROM node:20-alpine

# Étape 2: Définir le répertoire de travail dans le container
WORKDIR /app

# Étape 3: Copier les fichiers de dépendances
# On copie d'abord package.json et package-lock.json pour optimiser le cache Docker
COPY package*.json ./

# Étape 4: Installer les dépendances
RUN npm ci --only=production

# Étape 5: Copier le reste des fichiers de l'application
COPY . .

# Étape 6: Compiler TypeScript
RUN npm run build

# Étape 7: Exposer le port sur lequel l'application écoute
# (Vous devrez vérifier dans votre code quel port est utilisé)
EXPOSE 3000

# Étape 8: Commande pour démarrer l'application
CMD ["npm", "start"]

