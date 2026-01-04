# Guide : Hébergement Gratuit de PostgreSQL

## 🎯 Options Recommandées (Gratuites)

### 1. **Supabase** ⭐ RECOMMANDÉ
- **URL**: https://supabase.com
- **Limites gratuites**:
  - 500 MB de base de données
  - 2 GB de bande passante/mois
  - Pas de limite de temps
  - PostgreSQL 15
- **Avantages**: 
  - Interface web moderne
  - Connexion directe PostgreSQL
  - Backup automatique
  - SSL/TLS inclus
  - Pas de limite de temps
- **Parfait pour**: Projets de petite/moyenne taille

#### 🎁 Services inclus dans Supabase (gratuits)

Supabase est bien plus qu'une simple base de données PostgreSQL. C'est une **plateforme Backend-as-a-Service (BaaS)** complète qui offre :

1. **🗄️ Base de données PostgreSQL**
   - PostgreSQL 15 entièrement géré
   - 500 MB gratuits
   - Interface SQL Editor intégrée
   - Migrations de schéma
   - Backup automatique
   - Connexion directe (port 5432) ou connection pooling (port 6543)

2. **🔐 Authentification (Auth)**
   - Authentification par email/mot de passe
   - Liens magiques (passwordless)
   - OAuth (Google, GitHub, Twitter, etc.)
   - Authentification par SMS
   - Gestion des sessions et tokens JWT
   - Politiques d'accès (Row Level Security)

3. **📡 Temps réel (Realtime)**
   - Souscriptions en temps réel aux changements de base de données
   - WebSockets intégrés
   - Synchronisation automatique
   - Parfait pour les apps collaboratives

4. **📦 Stockage de fichiers (Storage)**
   - Stockage d'objets compatible S3
   - Gestion de fichiers, images, vidéos
   - 1 GB de stockage gratuit
   - CDN intégré
   - Politiques d'accès granulaires

5. **⚡ Fonctions Edge (Edge Functions)**
   - Fonctions serverless
   - Déployées près des utilisateurs (Edge)
   - Support TypeScript/JavaScript
   - 500 000 invocations/mois gratuites
   - Parfait pour les APIs et le traitement

6. **📊 Dashboard et Analytics**
   - Interface d'administration complète
   - Logs en temps réel
   - Métriques et monitoring
   - Gestion des utilisateurs

**En résumé** : Supabase peut héberger et gérer votre backend complet, pas seulement la base de données !

### 2. **Neon** ⭐ RECOMMANDÉ
- **URL**: https://neon.tech
- **Limites gratuites**:
  - 3 GB de stockage
  - Pas de limite de temps
  - PostgreSQL 14/15
- **Avantages**:
  - Serverless PostgreSQL
  - Scaling automatique
  - Branches de base de données (comme Git)
  - Interface moderne
- **Parfait pour**: Développement et projets légers

### 3. **ElephantSQL**
- **URL**: https://www.elephantsql.com
- **Limites gratuites**:
  - 20 MB de stockage
  - Plan "Tiny Turtle"
  - PostgreSQL 13
- **Avantages**:
  - Simple à configurer
  - Interface claire
  - SSL inclus
- **Limite**: 20 MB seulement (petit pour votre projet)

### 4. **Railway**
- **URL**: https://railway.app
- **Limites gratuites**:
  - $5 de crédit/mois
  - PostgreSQL disponible
  - Auto-pause après inactivité
- **Avantages**:
  - Très simple
  - Bon pour développement
- **Limite**: Crédit limité, peut se terminer

### 5. **Render**
- **URL**: https://render.com
- **Limites gratuites**:
  - PostgreSQL disponible
  - Auto-pause après 90 jours d'inactivité
- **Avantages**:
  - Simple
  - SSL inclus
- **Limite**: Pause automatique

---

## 🚀 Configuration avec Supabase (Recommandé)

### Étape 1: Créer un compte
1. Aller sur https://supabase.com
2. Cliquer sur "Start your project"
3. S'inscrire avec GitHub, Google, ou email

### Étape 2: Créer un projet
1. Cliquer sur "New Project"
2. Choisir une organisation
3. Remplir:
   - **Name**: `retro-collection` (ou autre)
   - **Database Password**: Choisir un mot de passe fort
   - **Region**: Choisir la plus proche (ex: Europe West)
4. Cliquer sur "Create new project"
5. Attendre 2-3 minutes (provisioning)

### Étape 3: Récupérer les identifiants
1. Dans votre projet, aller dans **Settings** → **Database**
2. Trouver la section **Connection string** ou **Connection info**
3. Notez:
   - **Host**: `db.xxxxx.supabase.co`
   - **Port**: `5432` (ou 6543 pour connection pooler)
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: (celui que vous avez créé)
   - **Connection string**: Copier la string complète si disponible

### Étape 4: Configurer les variables d'environnement
Créer/modifier votre fichier `.env`:

```env
# Database Configuration (Supabase)
DATABASE_HOST=db.xxxxx.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=votre_mot_de_passe_ici

# Autres variables...
NODE_ENV=production
PORT=9876
JWT_SECRET=votre_secret_jwt
JWT_REFRESH_SECRET=votre_refresh_secret
# ... autres variables
```

### Étape 5: Importer votre schéma
1. Dans Supabase, aller dans **SQL Editor**
2. Ouvrir vos fichiers SQL depuis `databases/`
3. Copier le contenu et exécuter dans l'éditeur SQL
4. Ou utiliser `psql` en ligne de commande:

```bash
# Installer psql si nécessaire
# Windows: via PostgreSQL installer ou Chocolatey
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql-client

# Se connecter
psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Ou avec la connection string complète
psql "postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Une fois connecté, exécuter vos scripts SQL
\i databases/retro_database.sql
```

### Étape 6: Tester la connexion
Votre code Node.js devrait fonctionner automatiquement avec ces variables d'environnement.

---

## 🔧 Configuration avec Neon (Alternative)

### Étape 1: Créer un compte
1. Aller sur https://neon.tech
2. S'inscrire avec GitHub ou email

### Étape 2: Créer un projet
1. Cliquer sur "Create a project"
2. Remplir:
   - **Project name**: `retro-collection`
   - **Region**: Choisir la plus proche
   - **PostgreSQL version**: 15 (recommandé)
3. Cliquer sur "Create project"

### Étape 3: Récupérer les identifiants
1. Dans le dashboard, aller dans **Connection Details**
2. Copier la **Connection string** ou noter:
   - **Host**
   - **Port**
   - **Database**
   - **User**
   - **Password**

### Étape 4: Configurer `.env`
Même procédure que Supabase avec les nouveaux identifiants.

---

## 📝 Notes Importantes

### SSL/TLS
La plupart des services cloud (Supabase, Neon, etc.) **nécessitent SSL** pour les connexions.

**Bonne nouvelle**: Le driver `pg` de Node.js active SSL automatiquement si le serveur le requiert. **Vous n'avez probablement pas besoin de modifier votre code!**

Si vous rencontrez des erreurs SSL (comme "self signed certificate"), vous pouvez ajouter la configuration SSL dans `src/utils/database.ts`:

```typescript
static init(app:Express): void {
    this.pool = new Pool({
        host: app.get('dbHost'),
        user: app.get('dbUser'),
        password: app.get('dbPsswd'),
        port: app.get('dbPort'),
        max: 5000,
        database: app.get('dbName'),
        connectionTimeoutMillis: 30000,
        // Ajouter SSL pour les services cloud (si nécessaire)
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false // Pour accepter les certificats auto-signés
        } : false
    });

    this.pool.on('acquire', (client: PoolClient) => {
        client.query('SET search_path TO public').catch((err: Error) => console.error('Error setting search_path:', err.stack));
    });
}
```

**Note**: `rejectUnauthorized: false` est généralement nécessaire pour les services gratuits qui utilisent des certificats auto-signés. Pour la production, considérez utiliser des certificats valides.

### Connection Pooling
- Supabase recommande le port **6543** pour le connection pooler (au lieu de 5432)
- Utilisez le port 6543 pour de meilleures performances en production
- Port 5432 = connexion directe (limité à quelques connexions simultanées)

### Backup
- Supabase: Backup automatique inclus
- Neon: Backup automatique inclus
- Toujours exporter vos données régulièrement!

### Migration depuis Docker local
1. Exporter vos données locales:
```bash
pg_dump -h localhost -U retro_user -d retro_collection > backup.sql
```

2. Importer dans le service cloud:
```bash
psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres" < backup.sql
```

---

## 🎯 Recommandation Finale

**Pour votre projet Retro Collection, je recommande Supabase** car:
- ✅ 500 MB gratuits (suffisant pour commencer)
- ✅ Interface moderne et facile à utiliser
- ✅ Documentation excellente
- ✅ Pas de limite de temps
- ✅ Backup automatique
- ✅ SSL/TLS inclus
- ✅ Support de la communauté actif

---

## ⚠️ Limitations des Plans Gratuits

- **Stockage limité**: Surveillez votre utilisation
- **Pas de support premium**: Support communauté seulement
- **Pas de garantie SLA**: Pour production critique, considérez un plan payant
- **Rate limiting**: Certains services limitent les requêtes/min

---

## 🔄 Migration de votre configuration actuelle

Votre code est déjà bien configuré! Il suffit de:
1. Créer un compte sur Supabase/Neon
2. Créer un projet
3. Récupérer les identifiants
4. Mettre à jour le fichier `.env`
5. Importer vos scripts SQL
6. Tester!

Votre application devrait fonctionner sans modification du code! 🎉

