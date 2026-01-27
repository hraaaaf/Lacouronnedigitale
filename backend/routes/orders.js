const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { proteger, autoriser } = require('../middleware/auth');

// @route   POST /api/commandes
// @desc    Créer une nouvelle commande
// @access  Privé (acheteur)
router.post('/', proteger, async (req, res) => {
  try {
    const { articles, adresseLivraison, paiement } = req.body;

    // Validation
    if (!articles || articles.length === 0) {
      return res.status(400).json({
        succes: false,
        message: 'Aucun article dans la commande.'
      });
    }

    // Calculer les montants et vérifier les stocks
    let sousTotal = 0;
    let fraisLivraison = 0;
    const articlesDetailles = [];

    for (const item of articles) {
      const produit = await Product.findById(item.produit);

      if (!produit) {
        return res.status(404).json({
          succes: false,
          message: `Produit ${item.produit} introuvable.`
        });
      }

      // Vérifier le stock
      if (produit.stock.quantite < item.quantite) {
        return res.status(400).json({
          succes: false,
          message: `Stock insuffisant pour ${produit.nom}. Disponible: ${produit.stock.quantite}`
        });
      }

      const sousTotal_article = produit.prix * item.quantite;
      sousTotal += sousTotal_article;
      fraisLivraison += produit.livraison.frais || 0;

      articlesDetailles.push({
        produit: produit._id,
        fournisseur: produit.fournisseur,
        nom: produit.nom,
        prix: produit.prix,
        quantite: item.quantite,
        sousTotal: sousTotal_article
      });

      // Déduire du stock
      produit.stock.quantite -= item.quantite;
      produit.ventesTotales += item.quantite;
      await produit.save();
    }

    const total = sousTotal + fraisLivraison;

    // Créer la commande
    const commande = await Order.create({
      acheteur: req.user._id,
      articles: articlesDetailles,
      montants: {
        sousTotal,
        fraisLivraison,
        total
      },
      adresseLivraison,
      paiement,
      suivi: [{
        statut: 'en_attente',
        description: 'Commande créée',
        date: new Date()
      }]
    });

    // Mettre à jour les stats des fournisseurs
    for (const article of articlesDetailles) {
      await User.findByIdAndUpdate(article.fournisseur, {
        $inc: {
          'stats.nombreVentes': article.quantite,
          'stats.chiffreAffaires': article.sousTotal
        }
      });
    }

    res.status(201).json({
      succes: true,
      message: 'Commande créée avec succès !',
      commande
    });
  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la création de la commande.',
      erreur: error.message
    });
  }
});

// @route   GET /api/commandes
// @desc    Récupérer toutes les commandes de l'utilisateur
// @access  Privé
router.get('/', proteger, async (req, res) => {
  try {
    let filtre = {};

    // Si acheteur, voir ses commandes
    if (req.user.role === 'acheteur') {
      filtre.acheteur = req.user._id;
    }

    // Si fournisseur, voir les commandes de ses produits
    if (req.user.role === 'fournisseur') {
      filtre['articles.fournisseur'] = req.user._id;
    }

    const commandes = await Order.find(filtre)
      .populate('acheteur', 'nom prenom email telephone')
      .populate('articles.produit', 'nom images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      succes: true,
      count: commandes.length,
      commandes
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération des commandes.'
    });
  }
});

// @route   GET /api/commandes/:id
// @desc    Récupérer une commande par ID
// @access  Privé
router.get('/:id', proteger, async (req, res) => {
  try {
    const commande = await Order.findById(req.params.id)
      .populate('acheteur', 'nom prenom email telephone')
      .populate('articles.produit', 'nom images categorie')
      .populate('articles.fournisseur', 'nom prenom entreprise');

    if (!commande) {
      return res.status(404).json({
        succes: false,
        message: 'Commande introuvable.'
      });
    }

    // Vérifier les permissions
    const estAcheteur = commande.acheteur._id.toString() === req.user._id.toString();
    const estFournisseur = commande.articles.some(
      article => article.fournisseur._id.toString() === req.user._id.toString()
    );

    if (!estAcheteur && !estFournisseur && req.user.role !== 'admin') {
      return res.status(403).json({
        succes: false,
        message: 'Accès non autorisé à cette commande.'
      });
    }

    res.status(200).json({
      succes: true,
      commande
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération de la commande.'
    });
  }
});

// @route   PUT /api/commandes/:id/statut
// @desc    Modifier le statut d'une commande (fournisseur)
// @access  Privé (fournisseur)
router.put('/:id/statut', proteger, autoriser('fournisseur', 'admin'), async (req, res) => {
  try {
    const { statut, description } = req.body;

    const commande = await Order.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({
        succes: false,
        message: 'Commande introuvable.'
      });
    }

    // Vérifier que le fournisseur est concerné par cette commande
    if (req.user.role === 'fournisseur') {
      const estConcerne = commande.articles.some(
        article => article.fournisseur.toString() === req.user._id.toString()
      );

      if (!estConcerne) {
        return res.status(403).json({
          succes: false,
          message: 'Vous n\'êtes pas concerné par cette commande.'
        });
      }
    }

    // Mettre à jour le statut
    commande.statut = statut;
    commande.suivi.push({
      statut,
      description: description || `Statut changé à ${statut}`,
      date: new Date()
    });

    await commande.save();

    res.status(200).json({
      succes: true,
      message: 'Statut mis à jour avec succès !',
      commande
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la mise à jour du statut.'
    });
  }
});

// @route   POST /api/commandes/:id/evaluation
// @desc    Évaluer une commande (acheteur après livraison)
// @access  Privé (acheteur)
router.post('/:id/evaluation', proteger, autoriser('acheteur'), async (req, res) => {
  try {
    const { note, commentaire } = req.body;

    const commande = await Order.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({
        succes: false,
        message: 'Commande introuvable.'
      });
    }

    // Vérifier que c'est bien l'acheteur
    if (commande.acheteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        succes: false,
        message: 'Vous n\'êtes pas autorisé à évaluer cette commande.'
      });
    }

    // Vérifier que la commande est livrée
    if (commande.statut !== 'livree') {
      return res.status(400).json({
        succes: false,
        message: 'Vous ne pouvez évaluer qu\'une commande livrée.'
      });
    }

    // Ajouter l'évaluation
    commande.evaluation = {
      note,
      commentaire,
      dateEvaluation: new Date()
    };

    await commande.save();

    // Mettre à jour la note des produits et fournisseurs
    for (const article of commande.articles) {
      const produit = await Product.findById(article.produit);
      if (produit) {
        const nouvelleNote = ((produit.evaluations.note * produit.evaluations.nombreAvis) + note) / (produit.evaluations.nombreAvis + 1);
        produit.evaluations.note = nouvelleNote;
        produit.evaluations.nombreAvis += 1;
        await produit.save();
      }

      // Mettre à jour la note du fournisseur
      const fournisseur = await User.findById(article.fournisseur);
      if (fournisseur) {
        // Calculer la nouvelle note globale (simplifié)
        fournisseur.stats.noteGlobale = note;
        await fournisseur.save();
      }
    }

    res.status(200).json({
      succes: true,
      message: 'Évaluation enregistrée avec succès !',
      commande
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de l\'enregistrement de l\'évaluation.'
    });
  }
});

// @route   DELETE /api/commandes/:id
// @desc    Annuler une commande
// @access  Privé (acheteur, avant confirmation)
router.delete('/:id', proteger, async (req, res) => {
  try {
    const commande = await Order.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({
        succes: false,
        message: 'Commande introuvable.'
      });
    }

    // Vérifier que c'est l'acheteur
    if (commande.acheteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        succes: false,
        message: 'Vous n\'êtes pas autorisé à annuler cette commande.'
      });
    }

    // Vérifier que la commande n'est pas déjà expédiée
    if (['expediee', 'livree'].includes(commande.statut)) {
      return res.status(400).json({
        succes: false,
        message: 'Impossible d\'annuler une commande déjà expédiée.'
      });
    }

    // Remettre les stocks
    for (const article of commande.articles) {
      await Product.findByIdAndUpdate(article.produit, {
        $inc: {
          'stock.quantite': article.quantite,
          ventesTotales: -article.quantite
        }
      });
    }

    commande.statut = 'annulee';
    commande.suivi.push({
      statut: 'annulee',
      description: 'Commande annulée par l\'acheteur',
      date: new Date()
    });

    await commande.save();

    res.status(200).json({
      succes: true,
      message: 'Commande annulée avec succès !',
      commande
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de l\'annulation de la commande.'
    });
  }
});

module.exports = router;