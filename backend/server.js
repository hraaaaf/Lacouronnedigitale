require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialiser Express
const app = express();

// Connexion à la base de données
connectDB();

// ========== CONFIGURATION CORS (CORRIGÉE POUR VERCEL) ==========
const corsOptions = {
  // Met "true" pour accepter dynamiquement l'origine (Site officiel ET liens de preview Vercel)
  origin: true, 
  credentials: true, // Autorise les cookies/headers sécurisés
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));

// Force la réponse OK pour les requêtes de pré-vérification (Preflight)
app.options('*', cors(corsOptions));

// ========== AUTRES MIDDLEWARES ==========
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== ROUTES ==========
// (On garde tes routes exactement comme avant)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/produits', require('./routes/products'));
app.use('/api/commandes', require('./routes/orders'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Route de test (Racine)
app.get('/', (req, res) => {
  res.json({
    message: '🦷 API Dental Marketplace v1.0 En Ligne',
    status: 'actif',
    timestamp: new Date().toISOString(),
    cors_mode: 'unrestricted', // Pour confirmer que le correctif est passé
    endpoints: {
      auth: '/api/auth',
      produits: '/api/produits'
    }
  });
});

// Route de santé pour Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    succes: false,
    message: 'Route introuvable.',
    path: req.path
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    succes: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS configuré en mode permissif (origin: true)`);
});