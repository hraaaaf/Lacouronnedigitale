const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { proteger } = require('../middleware/auth');

// @route   POST /api/reviews/:productId
// @desc    Ajouter un avis sur un produit
router.post('/:productId', proteger, async (req, res) => {
  try {
    const { note, commentaire } = req.body;

    // 1. Vérifier si l'utilisateur a déjà acheté ce produit (statut livré)
    const aAchete = await Order.findOne({
      acheteur: req.user._id,
      'articles.produit': req.params.productId,
      statut: 'livree'
    });

    if (!aAchete) {
      return res.status(403).json({
        succes: false,
        message: "Vous devez avoir acheté et reçu ce produit pour laisser un avis."
      });
    }

    // 2. Créer l'avis
    const avis = await Review.create({
      produit: req.params.productId,
      utilisateur: req.user._id,
      note,
      commentaire
    });

    // 3. (Optionnel) Recalculer la note moyenne du produit ici
    
    res.status(201).json({ succes: true, data: avis });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ succes: false, message: "Vous avez déjà noté ce produit." });
    }
    res.status(500).json({ succes: false, message: error.message });
  }
});

// @route   GET /api/reviews/:productId
// @desc    Obtenir tous les avis d'un produit
router.get('/:productId', async (req, res) => {
  try {
    const avis = await Review.find({ produit: req.params.productId })
      .populate('utilisateur', 'nom prenom')
      .sort('-createdAt');

    res.status(200).json({ succes: true, count: avis.length, data: avis });
  } catch (error) {
    res.status(500).json({ succes: false, message: error.message });
  }
});

module.exports = router;