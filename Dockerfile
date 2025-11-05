# Étape 1: Image de base avec Node.js
# On utilise une version LTS (Long Term Support) de Node.js
FROM node:20-alpine

# Étape 2: Définir le répertoire de travail dans le container
WORKDIR /app

# Étape 3: Copier les fichiers de dépendances
# On copie d'abord package.json et package-lock.json pour optimiser le cache Docker
COPY package*.json ./

# Étape 4: Installer toutes les dépendances (y compris devDependencies pour nodemon)
# Pour le mode développement, on a besoin de nodemon et ts-node
RUN npm ci

# Étape 5: Copier le reste des fichiers de l'application
COPY . .

# Étape 6: Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Étape 7: Commande par défaut (peut être surchargée dans docker-compose)
# En mode dev, on utilise nodemon qui est déjà configuré dans nodemon.json
# En mode prod, on peut compiler puis lancer avec node directement
CMD ["npm", "start"]

