const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protection des routes (vérification du token)
exports.proteger = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token existe dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        succes: false,
        message: 'Accès non autorisé. Token manquant.'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    req.user = await User.findById(decoded.id).select('-motDePasse');

    if (!req.user) {
      return res.status(404).json({
        succes: false,
        message: 'Utilisateur introuvable.'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      succes: false,
      message: 'Token invalide ou expiré.'
    });
  }
};

// Restriction par rôle
exports.autoriser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        succes: false,
        message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource.`
      });
    }
    next();
  };
};

// Vérifier si le fournisseur a un abonnement actif
exports.verifierAbonnement = async (req, res, next) => {
  try {
    if (req.user.role !== 'fournisseur') {
      return next();
    }

    // Vérifier si l'essai gratuit est expiré
    if (req.user.essaiGratuitExpire() && req.user.abonnement.type === 'essai_gratuit') {
      return res.status(403).json({
        succes: false,
        message: 'Votre période d\'essai gratuit est expirée. Veuillez souscrire à un abonnement.',
        codeErreur: 'ESSAI_EXPIRE'
      });
    }

    // Vérifier si l'abonnement est actif
    if (!req.user.abonnement.actif && req.user.abonnement.type !== 'essai_gratuit') {
      return res.status(403).json({
        succes: false,
        message: 'Votre abonnement est inactif. Veuillez renouveler.',
        codeErreur: 'ABONNEMENT_INACTIF'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      succes: false,
      message: 'Erreur lors de la vérification de l\'abonnement.'
    });
  }
};

// Générer un token JWT
exports.genererToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token valide 30 jours
  });
};