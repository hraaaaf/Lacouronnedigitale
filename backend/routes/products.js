// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { proteger, autoriser, verifierAbonnement } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

// IMPORTANT : Cloudinary doit être configuré ailleurs (process.env.CLOUDINARY_URL ou cloudinary.config)


// GET /api/produits
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

// POST /api/produits
// Cloudinary-only flow: le frontend doit avoir uploadé l'image(s) vers Cloudinary et envoie ici `req.body.images`
// Ex: images = [{ url: 'https://res.cloudinary.com/..../image.jpg', public_id: 'produits/abcd', altText: '...' }, ...]
router.post('/', proteger, autoriser('fournisseur'), verifierAbonnement, async (req, res) => {
  try {
    // Récupérer et parser images si besoin
    let images = [];
    if (req.body.images) {
      if (Array.isArray(req.body.images)) images = req.body.images;
      else {
        try { images = JSON.parse(req.body.images); } catch (e) { images = []; }
      }
    }

    // Validation minimale : exiger au moins une image (optionnel, modifiable)
    if (!images || images.length === 0) {
      return res.status(400).json({ succes: false, message: 'Au moins une image (url + public_id) est requise.' });
    }

    // Vérifier la structure des images
    const invalid = images.some(img => !img.url || !img.public_id);
    if (invalid) {
      return res.status(400).json({ succes: false, message: 'Chaque image doit contenir url et public_id.' });
    }

    // Caractéristiques parsing
    let caracs = [];
    if (req.body.caracteristiques) {
      if (Array.isArray(req.body.caracteristiques)) caracs = req.body.caracteristiques;
      else if (req.body.caracteristiques.startsWith && req.body.caracteristiques.startsWith('[')) {
        try { caracs = JSON.parse(req.body.caracteristiques); } catch (e) { console.log('Erreur parsing caracs JSON'); }
      } else {
        caracs = req.body.caracteristiques.split(',').map(c => c.trim());
      }
    }

    const quantiteStock = parseInt(req.body.stock) || 0;
    const stockObject = {
      quantite: quantiteStock,
      seuilAlerte: 5,
      statut: quantiteStock > 0 ? 'en_stock' : 'rupture'
    };

    const produit = await Product.create({
      nom: req.body.nom,
      description: req.body.description,
      categorie: req.body.categorie,
      sousCategorie: req.body.sousCategorie,
      marque: req.body.marque,
      conditionnement: req.body.conditionnement,
      prix: req.body.prix,
      stock: stockObject,
      images: images,
      caracteristiques: caracs,
      livraison: req.body.livraison,
      fournisseur: req.user._id
    });

    res.status(201).json({ succes: true, message: 'Produit créé avec succès !', produit });
  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({ succes: false, message: 'Erreur lors de la création du produit.', erreur: error.message });
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

    // Si le frontend envoie `images` (mise à jour), on accepte la nouvelle valeur (expects url+public_id)
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
// Supprime aussi les images côté Cloudinary si public_id présent
router.delete('/:id', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) return res.status(404).json({ succes: false, message: 'Produit introuvable.' });
    if (produit.fournisseur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ succes: false, message: 'Vous n\'êtes pas autorisé à supprimer ce produit.' });
    }

    // Supprimer images Cloudinary (si configured)
    if (produit.images && produit.images.length > 0) {
      for (const img of produit.images) {
        try {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id, { resource_type: 'image' });
          }
        } catch (e) {
          console.warn('Erreur suppression image Cloudinary', img.public_id, e.message);
          // continuer la suppression produit même si une image échoue
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
