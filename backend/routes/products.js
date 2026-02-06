const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { proteger, autoriser, verifierAbonnement } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const upload = require('../middleware/upload');

// ==========================================
// 1. ROUTES DE LECTURE (GET)
// ==========================================

/**
 * @desc    Obtenir tous les produits (Catalogue public)
 * @route   GET /api/produits
 */
router.get('/', async (req, res) => {
  try {
    const { categorie, prixMin, prixMax, recherche, page = 1, limite = 20 } = req.query;
    let filtre = { actif: true };

    if (categorie) filtre.categorie = categorie;
    if (prixMin || prixMax) {
      filtre.prix = {};
      if (prixMin) filtre.prix.$gte = parseFloat(prixMin);
      if (prixMax) filtre.prix.$lte = parseFloat(prixMax);
    }
    if (recherche) filtre.$text = { $search: recherche };

    const skip = (page - 1) * limite;
    const produits = await Product.find(filtre)
      .populate('fournisseur', 'nom prenom entreprise ville')
      .limit(parseInt(limite))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filtre);

    res.status(200).json({
      succes: true,
      count: produits.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limite),
      produits
    });
  } catch (error) {
    res.status(500).json({ succes: false, message: 'Erreur serveur.' });
  }
});

/**
 * @desc    Obtenir les produits du fournisseur connecté
 * @route   GET /api/produits/fournisseur/mes-produits
 * @note    DOIT ÊTRE PLACÉE AVANT /:id
 */
router.get('/fournisseur/mes-produits', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    const produits = await Product.find({ fournisseur: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ succes: true, count: produits.length, produits });
  } catch (error) {
    res.status(500).json({ succes: false, message: 'Erreur lors de la récupération de vos produits.' });
  }
});

/**
 * @desc    Détail d'un produit
 * @route   GET /api/produits/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id)
      .populate('fournisseur', 'nom prenom entreprise telephone email stats');
    
    if (!produit) return res.status(404).json({ succes: false, message: 'Produit introuvable.' });
    
    // Incrémenter les vues
    produit.vues += 1;
    await produit.save();
    
    res.status(200).json({ succes: true, produit });
  } catch (error) {
    res.status(500).json({ succes: false, message: 'ID invalide ou erreur serveur.' });
  }
});

// ==========================================
// 2. ROUTES D'ÉCRITURE (POST, PUT, DELETE)
// ==========================================


/**
 * @desc    Créer un nouveau produit (avec images)
 * @route   POST /api/produits
 */
router.post('/', proteger, autoriser('fournisseur'), verifierAbonnement, upload.array('images', 5), async (req, res) => {
  try {
    let imagesLinks = [];
    
    // Upload vers Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        let dataURI = "data:" + file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'dental-market/produits',
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    // Formatage du stock
    const stockFormatte = {
        quantite: req.body.stock ? Number(req.body.stock) : 0,
        unite: req.body.conditionnement || 'unité'
    };

    // Création de l'objet produit
    const produitData = {
      ...req.body,
      stock: stockFormatte,
      images: imagesLinks,
      fournisseur: req.user._id
    };

    const nouveauProduit = await Product.create(produitData);

    res.status(201).json({
      succes: true,
      produit: nouveauProduit
    });

  } catch (error) {
    console.error("Erreur création produit:", error);
    res.status(500).json({
      succes: false,
      message: "Erreur lors de la création du produit.",
      error: error.message
    });
  }
});

/**
 * @desc    Modifier un produit
 * @route   PUT /api/produits/:id
 */
router.put('/:id', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    let produit = await Product.findById(req.params.id);
    if (!produit) return res.status(404).json({ succes: false, message: 'Produit non trouvé.' });

    // Vérifier que le produit appartient bien au fournisseur
    if (produit.fournisseur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Action non autorisée.' });
    }

    // Mise à jour
    const produitMisAJour = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ succes: true, produit: produitMisAJour });
  } catch (error) {
    res.status(500).json({ succes: false, message: error.message });
  }
});

/**
 * @desc    Supprimer un produit + Nettoyage Cloudinary
 * @route   DELETE /api/produits/:id
 */
router.delete('/:id', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) return res.status(404).json({ succes: false, message: 'Produit introuvable.' });

    if (produit.fournisseur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Action non autorisée.' });
    }

    // Supprimer les images sur Cloudinary
    if (produit.images && produit.images.length > 0) {
      for (const img of produit.images) {
        if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await produit.deleteOne();
    res.status(200).json({ succes: true, message: 'Produit supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ succes: false, message: error.message });
  }
});

module.exports = router;