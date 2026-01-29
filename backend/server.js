require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialiser Express
const app = express();

// Vérification de sécurité pour Railway/Production
console.log('--- Diagnostic de démarrage ---');
console.log('📍 Environnement:', process.env.NODE_ENV || 'development');
if (!process.env.MONGODB_URI) {
    console.error('❌ ERREUR: La variable MONGODB_URI est introuvable dans les variables d\'environnement.');
} else {
    console.log('✅ Variable MONGODB_URI détectée.');
}
console.log('-------------------------------');

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors({
  origin: 'https://lacouronnedigitale.vercel.app', // Ton URL Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/produits', require('./routes/products'));
app.use('/api/commandes', require('./routes/orders'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reviews', require('./routes/reviews'));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static('uploads'));

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: '🦷 API Dental Marketplace v1.0',
    status: 'actif',
    database: process.env.MONGODB_URI ? 'configurée' : 'non configurée',
    endpoints: {
      auth: '/api/auth',
      produits: '/api/produits',
      commandes: '/api/commandes',
      messages: '/api/messages',
      users: '/api/users',
      upload: '/api/upload',
      reviews: '/api/reviews'
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    succes: false,
    message: 'Route introuvable.'
  });
});

// Démarrer le serveur
// Railway injecte automatiquement sa propre variable PORT, on doit la prioriser
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});