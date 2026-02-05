// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { proteger, autoriser, verifierAbonnement } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

// --- CORRECTION : Import du middleware Multer ---
const upload = require('../middleware/upload'); 

// IMPORTANT : Cloudinary doit être configuré ailleurs (process.env.CLOUDINARY_URL ou cloudinary.config)

// GET /api/produits


// GET /api/produits/fournisseur/mes-produits
router.get('/fournisseur/mes-produits', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    const produits = await Product.find({ fournisseur: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ succes: true, count: produits.length, produits });
  } catch (error) {
    res.status(500).json({ succes: false, message: 'Erreur lors de la récupération des produits.' });
  }
});

// GET /api/produits/:id
router.get('/:id', async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id).populate('fournisseur', 'nom prenom entreprise telephone email stats');
    if (!produit) return res.status(404).json({ succes: false, message: 'Produit introuvable.' });
    produit.vues += 1;
    await produit.save();
    res.status(200).json({ succes: true, produit });
  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({ succes: false, message: 'Erreur lors de la récupération du produit ou ID invalide.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { categorie, ville, prixMin, prixMax, recherche, page = 1, limite = 20 } = req.query;
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
    console.error('Erreur récupération produits:', error);
    res.status(500).json({ succes: false, message: 'Erreur lors de la récupération des produits.' });
  }
});

// POST /api/produits
router.post('/', proteger, autoriser('fournisseur'), upload.array('images', 5), async (req, res) => {
  try {
    // 1. Gestion des images Cloudinary
    const imagesUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Conversion buffer -> base64 pour Cloudinary
        const b64 = Buffer.from(file.buffer).toString('base64');
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'dental_market/products',
        });
        
        imagesUrls.push({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    }

    // 2. Construction intelligente de l'objet Produit
    const { nom, description, prix, categorie, marque, conditionnement } = req.body;

    // Gestion stock (compatible FormData)
    const quantiteStock = req.body.stock || req.body['stock[quantite]'];

    const nouveauProduit = new Product({
      nom,
      description,
      prix: parseFloat(prix),
      categorie,
      marque,
      stock: {
        quantite: parseInt(quantiteStock, 10),
        unite: conditionnement || 'unité'
      },
      images: imagesUrls,
      fournisseur: req.user._id
    });

    // 3. Sauvegarde
    const produitSauvegarde = await nouveauProduit.save();

    res.status(201).json({
      succes: true,
      data: produitSauvegarde
    });

  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(400).json({ 
      succes: false, 
      message: error.message || 'Erreur lors de la création du produit' 
    });
  }
});

// PUT /api/produits/:id
router.put('/:id', proteger, autoriser('fournisseur'), verifierAbonnement, async (req, res) => {
  try {
    let produit = await Product.findById(req.params.id);
    if (!produit) return res.status(404).json({ succes: false, message: 'Produit introuvable.' });
    if (produit.fournisseur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Vous n\'êtes pas autorisé à modifier ce produit.' });
    }

    if (req.body.images) {
      let images = Array.isArray(req.body.images) ? req.body.images : (() => {
        try { return JSON.parse(req.body.images); } catch { return []; }
      })();
      if (images.length > 0) req.body.images = images;
      else delete req.body.images;
    }

    produit = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ succes: true, message: 'Produit modifié avec succès !', produit });
  } catch (error) {
    console.error('Erreur modification produit:', error);
    res.status(500).json({ succes: false, message: 'Erreur lors de la modification du produit.' });
  }
});

// DELETE /api/produits/:id
router.delete('/:id', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) return res.status(404).json({ succes: false, message: 'Produit introuvable.' });
    if (produit.fournisseur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Vous n\'êtes pas autorisé à supprimer ce produit.' });
    }

    if (produit.images && produit.images.length > 0) {
      for (const img of produit.images) {
        try {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id, { resource_type: 'image' });
          }
        } catch (e) {
          console.warn('Erreur suppression image Cloudinary', img.public_id, e.message);
        }
      }
    }

    await produit.deleteOne();

    res.status(200).json({ succes: true, message: 'Produit supprimé avec succès !' });
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({ succes: false, message: 'Erreur lors de la suppression du produit.' });
  }
});

module.exports = router;