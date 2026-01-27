const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { proteger, autoriser } = require('../middleware/auth');

// @route   GET /api/users/profil
// @desc    Récupérer le profil complet de l'utilisateur connecté
// @access  Privé
router.get('/profil', proteger, async (req, res) => {
  try {
    const utilisateur = await User.findById(req.user._id).select('-motDePasse');

    res.status(200).json({
      succes: true,
      utilisateur
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération du profil.'
    });
  }
});

// @route   PUT /api/users/profil
// @desc    Modifier le profil de l'utilisateur
// @access  Privé
router.put('/profil', proteger, async (req, res) => {
  try {
    const champsModifiables = ['nom', 'prenom', 'telephone', 'entreprise'];
    const updates = {};

    // Filtrer uniquement les champs modifiables
    champsModifiables.forEach(champ => {
      if (req.body[champ] !== undefined) {
        updates[champ] = req.body[champ];
      }
    });

    const utilisateur = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-motDePasse');

    res.status(200).json({
      succes: true,
      message: 'Profil modifié avec succès !',
      utilisateur
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la modification du profil.',
      erreur: error.message
    });
  }
});

// @route   PUT /api/users/mot-de-passe
// @desc    Modifier le mot de passe
// @access  Privé
router.put('/mot-de-passe', proteger, async (req, res) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({
        succes: false,
        message: 'Ancien et nouveau mot de passe requis.'
      });
    }

    const utilisateur = await User.findById(req.user._id).select('+motDePasse');

    const mdpCorrect = await utilisateur.comparerMotDePasse(ancienMotDePasse);
    if (!mdpCorrect) {
      return res.status(401).json({
        succes: false,
        message: 'Ancien mot de passe incorrect.'
      });
    }

    utilisateur.motDePasse = nouveauMotDePasse;
    await utilisateur.save();

    res.status(200).json({
      succes: true,
      message: 'Mot de passe modifié avec succès !'
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la modification du mot de passe.'
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Récupérer les statistiques du dashboard (fournisseur)
// @access  Privé (fournisseur)
router.get('/dashboard', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    // 1. Statistiques des produits
    const produits = await Product.find({ fournisseur: req.user._id });
    const nombreProduits = produits.length;
    const produitsActifs = produits.filter(p => p.actif).length;
    const stockTotal = produits.reduce((acc, p) => acc + (p.stock?.quantite || 0), 0);

    // 2. Statistiques des commandes liées à ce fournisseur
    const commandes = await Order.find({ 'articles.fournisseur': req.user._id }).sort({ createdAt: -1 });
    
    // 3. Calcul précis du Chiffre d'Affaires (uniquement la part du fournisseur)
    const chiffreAffaires = commandes
      .filter(c => ['paye', 'livree', 'expediee'].includes(c.statut))
      .reduce((totalCA, commande) => {
        const partFournisseur = commande.articles
          .filter(art => art.fournisseur.toString() === req.user._id.toString())
          .reduce((somme, art) => somme + (art.prix * art.quantite), 0);
        return totalCA + partFournisseur;
      }, 0);

    // 4. Produits les plus populaires
    const produitsPopulaires = produits
      .sort((a, b) => (b.ventesTotales || 0) - (a.ventesTotales || 0))
      .slice(0, 5)
      .map(p => ({
        nom: p.nom,
        ventes: p.ventesTotales || 0,
        prix: p.prix
      }));

    // 5. Calcul abonnement
    const joursRestantsEssai = req.user.abonnement?.type === 'essai_gratuit'
      ? Math.max(0, Math.ceil((new Date(req.user.abonnement.dateFin) - new Date()) / (1000 * 60 * 60 * 24)))
      : null;

    res.status(200).json({
      succes: true,
      dashboard: {
        stats: {
          ventesTotales: chiffreAffaires,
          commandesCount: commandes.length,
          produitsActifs: produitsActifs,
          stockTotal: stockTotal,
          clientsVus: Math.floor(Math.random() * 50) + 10 // Simulation en attendant un tracker de vues
        },
        finances: {
          chiffreAffaires,
          commission: chiffreAffaires * (parseFloat(process.env.COMMISSION_RATE || 5) / 100)
        },
        produitsPopulaires,
        dernieresCommandes: commandes.slice(0, 5),
        abonnement: {
          type: req.user.abonnement?.type,
          actif: req.user.abonnement?.actif,
          joursRestantsEssai
        }
      }
    });
  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération du dashboard.'
    });
  }
});

// @route   POST /api/users/abonnement/activer
// @desc    Activer un abonnement payant (fournisseur)
// @access  Privé (fournisseur)
router.post('/abonnement/activer', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    const { typeAbonnement } = req.body; // 'basique' ou 'premium'

    if (!['basique', 'premium'].includes(typeAbonnement)) {
      return res.status(400).json({
        succes: false,
        message: 'Type d\'abonnement invalide.'
      });
    }

    const utilisateur = await User.findById(req.user._id);
    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + 1);

    utilisateur.abonnement = {
      type: typeAbonnement,
      dateDebut: new Date(),
      dateFin,
      actif: true
    };

    await utilisateur.save();

    res.status(200).json({
      succes: true,
      message: `Abonnement ${typeAbonnement} activé avec succès !`,
      abonnement: utilisateur.abonnement
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de l\'activation de l\'abonnement.'
    });
  }
});

// @route   GET /api/users/fournisseur/:id
// @desc    Voir le profil public d'un fournisseur
// @access  Public
router.get('/fournisseur/:id', async (req, res) => {
  try {
    const fournisseur = await User.findById(req.params.id)
      .select('nom prenom entreprise stats verification');

    if (!fournisseur || fournisseur.role !== 'fournisseur') {
      return res.status(404).json({
        succes: false,
        message: 'Fournisseur introuvable.'
      });
    }

    const produits = await Product.find({
      fournisseur: req.params.id,
      actif: true
    }).limit(10);

    res.status(200).json({
      succes: true,
      fournisseur,
      produits: {
        count: produits.length,
        items: produits
      }
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération du profil fournisseur.'
    });
  }
});

// @route   DELETE /api/users/compte
// @desc    Supprimer son compte
// @access  Privé
router.delete('/compte', proteger, async (req, res) => {
  try {
    const utilisateur = await User.findById(req.user._id);

    if (utilisateur.role === 'fournisseur') {
      const commandesEnCours = await Order.countDocuments({
        'articles.fournisseur': req.user._id,
        statut: { $in: ['en_attente', 'confirmee', 'en_preparation', 'expediee'] }
      });

      if (commandesEnCours > 0) {
        return res.status(400).json({
          succes: false,
          message: 'Vous avez des commandes en cours. Veuillez les finaliser avant de supprimer votre compte.'
        });
      }

      await Product.updateMany(
        { fournisseur: req.user._id },
        { actif: false }
      );
    }

    await utilisateur.deleteOne();

    res.status(200).json({
      succes: true,
      message: 'Votre compte a été supprimé avec succès.'
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la suppression du compte.'
    });
  }
});

module.exports = router;