const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { genererToken } = require('../middleware/auth');

// @route   POST /api/auth/inscription
// @desc    Inscription d'un nouvel utilisateur
// @access  Public
router.post('/inscription', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, motDePasse, role, entreprise } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExiste = await User.findOne({ email });
    if (utilisateurExiste) {
      return res.status(400).json({
        succes: false,
        message: 'Un compte existe déjà avec cet email.'
      });
    }

    // Créer l'utilisateur
    const userData = {
      nom,
      prenom,
      email,
      telephone,
      motDePasse,
      role: role || 'acheteur'
    };

    // Si fournisseur, ajouter les infos entreprise
    if (role === 'fournisseur' && entreprise) {
      userData.entreprise = entreprise;
      
      // Configurer l'essai gratuit
      const dateDebut = new Date();
      const dateFin = new Date();
      dateFin.setDate(dateFin.getDate() + parseInt(process.env.FREE_TRIAL_DAYS));
      
      userData.abonnement = {
        type: 'essai_gratuit',
        dateDebut,
        dateFin,
        actif: true
      };
    }

    const utilisateur = await User.create(userData);

    // Générer le token
    const token = genererToken(utilisateur._id);

    res.status(201).json({
      succes: true,
      message: 'Inscription réussie !',
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
        abonnement: utilisateur.abonnement
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de l\'inscription.',
      erreur: error.message
    });
  }
});

// @route   POST /api/auth/connexion
// @desc    Connexion d'un utilisateur
// @access  Public
router.post('/connexion', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Validation
    if (!email || !motDePasse) {
      return res.status(400).json({
        succes: false,
        message: 'Veuillez fournir un email et un mot de passe.'
      });
    }

    // Récupérer l'utilisateur avec le mot de passe
    const utilisateur = await User.findOne({ email }).select('+motDePasse');

    if (!utilisateur) {
      return res.status(401).json({
        succes: false,
        message: 'Email ou mot de passe incorrect.'
      });
    }

    // Vérifier le mot de passe
    const mdpCorrect = await utilisateur.comparerMotDePasse(motDePasse);

    if (!mdpCorrect) {
      return res.status(401).json({
        succes: false,
        message: 'Email ou mot de passe incorrect.'
      });
    }

    // Mettre à jour le dernier accès
    utilisateur.dernierAcces = new Date();
    await utilisateur.save();

    // Générer le token
    const token = genererToken(utilisateur._id);

    // Vérifier si essai gratuit expiré (pour fournisseurs)
    let avertissement = null;
    if (utilisateur.role === 'fournisseur' && utilisateur.essaiGratuitExpire()) {
      avertissement = 'Votre période d\'essai gratuit est expirée. Certaines fonctionnalités sont limitées.';
    }

    res.status(200).json({
      succes: true,
      message: 'Connexion réussie !',
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
        abonnement: utilisateur.abonnement,
        entreprise: utilisateur.entreprise
      },
      avertissement
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la connexion.',
      erreur: error.message
    });
  }
});

// @route   GET /api/auth/profil
// @desc    Récupérer le profil de l'utilisateur connecté
// @access  Privé
const { proteger } = require('../middleware/auth');

router.get('/profil', proteger, async (req, res) => {
  try {
    res.status(200).json({
      succes: true,
      utilisateur: req.user
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération du profil.'
    });
  }
});

module.exports = router;