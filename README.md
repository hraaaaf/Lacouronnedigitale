# 🦷 DentalMarket - Marketplace B2B/B2C Matériel Dentaire

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

> Première marketplace spécialisée en matériel dentaire au Maroc, connectant fournisseurs et professionnels de santé dentaire.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Structure du Projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Captures d'écran](#-captures-décran)
- [Roadmap](#-roadmap)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## ✨ Fonctionnalités

### 👥 Pour les Acheteurs (Dentistes/Cliniques)
- ✅ Inscription et authentification sécurisée
- ✅ Catalogue produits avec recherche avancée et filtres
- ✅ Fiches produits détaillées (photos, specs, prix)
- ✅ Panier d'achat intelligent
- ✅ Gestion des commandes avec suivi en temps réel
- ✅ Messagerie intégrée avec les fournisseurs
- ✅ Historique d'achats et factures téléchargeables
- ✅ Système d'évaluation et notation

### 🏢 Pour les Fournisseurs
- ✅ **Essai gratuit 30 jours** pour tester la plateforme
- ✅ Dashboard analytique complet
- ✅ Gestion des produits (ajout/modification/suppression)
- ✅ Gestion des commandes et statuts
- ✅ Statistiques de ventes en temps réel
- ✅ Messagerie client intégrée
- ✅ Upload d'images produits
- ✅ Vérification KYC (registre de commerce, ICE)

### 🔐 Sécurité & Performance
- 🔒 Authentification JWT sécurisée
- 🛡️ Hashage des mots de passe (bcrypt)
- ⚡ API REST optimisée
- 📱 Design responsive (mobile-first)
- 🎨 UI/UX moderne iOS/Android 2026

---

## 🛠️ Stack Technique

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Base de données**: MongoDB (Mongoose ODM)
- **Authentification**: JWT (jsonwebtoken)
- **Sécurité**: bcryptjs, CORS
- **Upload**: Multer
- **Variables d'environnement**: dotenv

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Axios
- **Icônes**: Lucide React
- **State Management**: Context API

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** >= 18.0.0 ([Télécharger](https://nodejs.org/))
- **MongoDB** >= 6.0 ([Télécharger](https://www.mongodb.com/try/download/community))
  - OU compte MongoDB Atlas gratuit ([Créer](https://www.mongodb.com/cloud/atlas))
- **Git** ([Télécharger](https://git-scm.com/))
- Un éditeur de code (VS Code recommandé)

---

## 🚀 Installation

### 1️⃣ Cloner le repository

```bash
git clone https://github.com/votre-username/dental-marketplace.git
cd dental-marketplace
```

### 2️⃣ Installation Backend

```bash
cd backend
npm install
```

### 3️⃣ Installation Frontend

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend - Fichier `.env`

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Serveur
PORT=5000
NODE_ENV=development

# MongoDB (Local)
MONGODB_URI=mongodb://localhost:27017/dental-marketplace

# OU MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dental-marketplace

# JWT Secret (CHANGEZ CETTE CLÉ EN PRODUCTION !)
JWT_SECRET=votre_cle_secrete_ultra_forte_ici_2024

# Essai gratuit (en jours)
FREE_TRIAL_DAYS=30

# Commission marketplace (en %)
COMMISSION_RATE=5

# Tarif abonnement mensuel (en MAD)
SUBSCRIPTION_PRICE=249
```

### Frontend - Configuration API

Le fichier `frontend/src/utils/api.js` est déjà configuré pour pointer vers `http://localhost:5000/api`.

Si vous changez le port backend, modifiez la constante `API_URL`.

---

## 🏃 Lancement

### Option 1 : Lancement Manuel (2 terminaux)

**Terminal 1 - Backend** :
```bash
cd backend
npm run dev
```
✅ Backend disponible sur `http://localhost:5000`

**Terminal 2 - Frontend** :
```bash
cd frontend
npm run dev
```
✅ Frontend disponible sur `http://localhost:5173`

### Option 2 : Lancement Simultané (PowerShell)

```powershell
# Lancer backend en arrière-plan
Start-Process powershell -ArgumentList "cd backend; npm run dev"

# Lancer frontend
cd frontend
npm run dev
```

---

## 📁 Structure du Projet

```
dental-marketplace/
│
├── backend/                      # API Node.js
│   ├── config/
│   │   └── db.js                # Configuration MongoDB
│   ├── models/
│   │   ├── User.js              # Modèle utilisateur
│   │   ├── Product.js           # Modèle produit
│   │   ├── Order.js             # Modèle commande
│   │   └── Message.js           # Modèle messagerie
│   ├── routes/
│   │   ├── auth.js              # Routes authentification
│   │   ├── products.js          # Routes produits
│   │   ├── orders.js            # Routes commandes
│   │   ├── messages.js          # Routes messagerie
│   │   ├── users.js             # Routes utilisateurs
│   │   └── upload.js            # Routes upload images
│   ├── middleware/
│   │   ├── auth.js              # Middleware JWT
│   │   └── upload.js            # Middleware Multer
│   ├── uploads/                 # Dossier images uploadées
│   ├── server.js                # Point d'entrée
│   ├── package.json
│   └── .env                     # Variables d'environnement
│
├── frontend/                     # Application React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── pages/               # Pages principales
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Messages.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Gestion authentification
│   │   ├── utils/
│   │   │   └── api.js           # Configuration Axios
│   │   ├── App.jsx              # Composant principal
│   │   ├── main.jsx             # Point d'entrée
│   │   └── index.css            # Styles globaux
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md                     # Ce fichier
```

---

## 🔌 API Endpoints

### Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/inscription` | Créer un compte | ❌ |
| POST | `/connexion` | Se connecter | ❌ |
| GET | `/profil` | Récupérer son profil | ✅ |

### Produits (`/api/produits`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des produits | ❌ |
| GET | `/:id` | Détail d'un produit | ❌ |
| POST | `/` | Créer un produit | ✅ Fournisseur |
| PUT | `/:id` | Modifier un produit | ✅ Fournisseur |
| DELETE | `/:id` | Supprimer un produit | ✅ Fournisseur |
| GET | `/fournisseur/mes-produits` | Mes produits | ✅ Fournisseur |

### Commandes (`/api/commandes`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/` | Créer une commande | ✅ |
| GET | `/` | Mes commandes | ✅ |
| GET | `/:id` | Détail commande | ✅ |
| PUT | `/:id/statut` | Modifier statut | ✅ |
| POST | `/:id/evaluation` | Évaluer | ✅ Acheteur |
| DELETE | `/:id` | Annuler | ✅ |

### Messages (`/api/messages`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/` | Envoyer message | ✅ |
| GET | `/conversations` | Liste conversations | ✅ |
| GET | `/conversation/:userId` | Messages d'une conv. | ✅ |
| GET | `/non-lus` | Nombre non lus | ✅ |

### Utilisateurs (`/api/users`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/profil` | Mon profil | ✅ |
| PUT | `/profil` | Modifier profil | ✅ |
| PUT | `/mot-de-passe` | Changer mot de passe | ✅ |
| GET | `/dashboard` | Stats dashboard | ✅ Fournisseur |
| POST | `/abonnement/activer` | Activer abonnement | ✅ Fournisseur |

### Upload (`/api/upload`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/image` | Upload 1 image | ✅ |
| POST | `/images` | Upload plusieurs | ✅ |

---

## 📸 Captures d'écran

### Page d'accueil
![Home](screenshots/home.png)

### Catalogue produits
![Products](screenshots/products.png)

### Dashboard fournisseur
![Dashboard](screenshots/dashboard.png)

---

## 🗺️ Roadmap

### Phase 1 - MVP ✅ (TERMINÉ)
- [x] Authentification complète
- [x] Gestion produits
- [x] Système de commandes
- [x] Messagerie
- [x] Dashboard fournisseur
- [x] Design moderne iOS/Android 2026

### Phase 2 - Améliorations (À venir)
- [ ] Paiement en ligne (CMI, Stripe)
- [ ] Notifications push
- [ ] Système de devis
- [ ] Achats groupés
- [ ] Application mobile (React Native)

### Phase 3 - Advanced (Futur)
- [ ] IA pour recommandations produits
- [ ] Programme de fidélité
- [ ] Marketplace multi-vendeurs avancé
- [ ] Intégration ERP

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

---

## 🐛 Bug Reports

Si vous trouvez un bug, ouvrez une **issue** avec :
- Description détaillée
- Steps to reproduce
- Screenshots si possible
- Environnement (OS, Node version, etc.)

---

## 📞 Contact & Support

- **Email** : contact@dentalmarket.ma
- **Website** : [dentalmarket.ma](https://dentalmarket.ma)
- **Issues** : [GitHub Issues](https://github.com/votre-username/dental-marketplace/issues)

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteurs

- **Votre Nom** - *Développeur Full Stack* - [@votre-github](https://github.com/votre-username)

---

## 🙏 Remerciements

- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📊 Statistiques du Projet

```
📦 Total Files: 40+
📝 Lines of Code: 8000+
⏱️ Development Time: 2 semaines
🎨 Design System: Custom (iOS/Android 2026)
🔒 Security: JWT + bcrypt
```

---

**🚀 Fait avec ❤️ au Maroc**

---

## 🔥 Quick Start (TL;DR)

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (nouveau terminal)
cd frontend && npm install && npm run dev

# 🎉 Accédez à http://localhost:5173
```

---

**Note** : N'oubliez pas de configurer le fichier `.env` avant le premier lancement !