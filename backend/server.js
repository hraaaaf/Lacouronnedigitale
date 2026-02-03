require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialiser Express
const app = express();

// Connexion à la base de données
connectDB();

// ===================================================
// 🔧 CONFIGURATION CORS (SPÉCIAL VERCEL & RAILWAY)
// ===================================================
const corsOptions = {
  // 'origin: true' dit au navigateur : "J'accepte tout le monde" (Site officiel ET Previews)
  // C'est la solution idéale pour débloquer tes erreurs actuelles.
  origin: true,
  credentials: true, // Autorise l'envoi de cookies/headers sécurisés
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// 1. Appliquer la config CORS
app.use(cors(corsOptions));

// 2. Forcer explicitement la réponse OK pour les requêtes "Preflight" (OPTIONS)
// C'est souvent ici que Vercel bloque si cette ligne manque.
app.options('*', cors(corsOptions));

// ===================================================
// 📦 MIDDLEWARES
// ===================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===================================================
// 🛣️ ROUTES
// ===================================================
// Assure-toi que ces fichiers existent bien dans backend/routes/
app.use('/api/auth', require('./routes/auth'));
app.use('/api/produits', require('./routes/products'));
app.use('/api/commandes', require('./routes/orders'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static('uploads'));

// ===================================================
// 🏥 ROUTES DE DIAGNOSTIC
// ===================================================

// Route racine : Pour vérifier que le serveur est vivant
app.get('/', (req, res) => {
  res.json({
    message: '🦷 API Dental Marketplace v1.0 En Ligne',
    status: 'actif',
    timestamp: new Date().toISOString(),
    cors_mode: 'unrestricted (origin: true)', // Preuve que le fix est appliqué
    endpoints: {
      auth: '/api/auth',
      produits: '/api/produits'
    }
  });
});

// Route Health : Utilisée par Railway pour savoir si tout va bien
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ===================================================
// 🚨 GESTION DES ERREURS
// ===================================================

// 404 - Route introuvable
app.use((req, res) => {
  res.status(404).json({
    succes: false,
    message: 'Route introuvable. Vérifiez l\'URL.',
    path: req.path
  });
});

// 500 - Erreur serveur globale
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    succes: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===================================================
// 🚀 DÉMARRAGE
// ===================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS configuré en mode permissif (origin: true)`);
});