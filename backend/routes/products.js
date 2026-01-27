const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload'); // Assure-toi que ce fichier existe bien
const { proteger, autoriser, verifierAbonnement } = require('../middleware/auth');

// @route   GET /api/produits
// @desc    Récupérer tous les produits (avec filtres, pagination, recherche)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { categorie, ville, prixMin, prixMax, recherche, page = 1, limite = 20 } = req.query;

    // Construire le filtre
    let filtre = { actif: true };

    if (categorie) filtre.categorie = categorie;
    
    // Filtre Prix
    if (prixMin || prixMax) {
      filtre.prix = {};
      if (prixMin) filtre.prix.$gte = parseFloat(prixMin);
      if (prixMax) filtre.prix.$lte = parseFloat(prixMax);
    }

    // Filtre Recherche Textuelle
    if (recherche) {
      filtre.$text = { $search: recherche };
    }

    // Pagination
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
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération des produits.'
    });
  }
});

// @route   GET /api/produits/fournisseur/mes-produits
// @desc    Récupérer les produits du fournisseur connecté
// @access  Privé (fournisseur)
// NOTE : Placée AVANT /:id pour éviter les conflits de routes
router.get('/fournisseur/mes-produits', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    const produits = await Product.find({ fournisseur: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      succes: true,
      count: produits.length,
      produits
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération des produits.'
    });
  }
});

// @route   GET /api/produits/:id
// @desc    Récupérer un produit par ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id)
      .populate('fournisseur', 'nom prenom entreprise telephone email stats');

    if (!produit) {
      return res.status(404).json({
        succes: false,
        message: 'Produit introuvable.'
      });
    }

    // Incrémenter le nombre de vues
    produit.vues += 1;
    await produit.save();

    res.status(200).json({
      succes: true,
      produit
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération du produit ou ID invalide.'
    });
  }
});

// @route   POST /api/produits
// @desc    Créer un nouveau produit (avec images et stock corrigé)
// @access  Privé (fournisseur avec abonnement actif)
router.post('/', proteger, autoriser('fournisseur'), verifierAbonnement, upload.array('images', 5), async (req, res) => {
  try {
    // 1. Gestion des Images (Multer)
    let imagesUrls = [];
    if (req.files && req.files.length > 0) {
      imagesUrls = req.files.map(file => ({
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        public_id: file.filename
      }));
    }

    // 2. Gestion des caractéristiques (Parsing JSON ou Array)
    let caracs = [];
    if (req.body.caracteristiques) {
      // Si c'est déjà un tableau, on le garde, sinon on essaie de le parser ou split
      if (Array.isArray(req.body.caracteristiques)) {
        caracs = req.body.caracteristiques;
      } else if (req.body.caracteristiques.startsWith('[')) {
        try {
            caracs = JSON.parse(req.body.caracteristiques);
        } catch (e) { console.log('Erreur parsing caracs JSON'); }
      } else {
        caracs = req.body.caracteristiques.split(',').map(c => c.trim());
      }
    }

    // 3. Gestion du Stock (CORRECTION MAJEURE)
    // On convertit la valeur "stock" simple du formulaire en objet { quantite: X, ... }
    const quantiteStock = parseInt(req.body.stock) || 0;
    const stockObject = {
        quantite: quantiteStock,
        seuilAlerte: 5,
        statut: quantiteStock > 0 ? 'en_stock' : 'rupture'
    };

    // 4. Création
    const produit = await Product.create({
      nom: req.body.nom,
      description: req.body.description,
      categorie: req.body.categorie,
      sousCategorie: req.body.sousCategorie, // Optionnel
      marque: req.body.marque,
      conditionnement: req.body.conditionnement,
      prix: req.body.prix,
      stock: stockObject, // On passe l'objet corrigé
      images: imagesUrls,
      caracteristiques: caracs,
      livraison: req.body.livraison, // Si envoyé par le front
      fournisseur: req.user._id
    });

    res.status(201).json({
      succes: true,
      message: 'Produit créé avec succès !',
      produit
    });

  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la création du produit.',
      erreur: error.message
    });
  }
});

// @route   PUT /api/produits/:id
// @desc    Modifier un produit
// @access  Privé (fournisseur propriétaire uniquement)
router.put('/:id', proteger, autoriser('fournisseur'), verifierAbonnement, async (req, res) => {
  try {
    let produit = await Product.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({
        succes: false,
        message: 'Produit introuvable.'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (produit.fournisseur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        succes: false,
        message: 'Vous n\'êtes pas autorisé à modifier ce produit.'
      });
    }

    // NOTE: Si tu veux gérer l'update des images ici plus tard, il faudra ajouter upload.array() 
    // et la logique de suppression des anciennes images. Pour l'instant, on garde la logique texte.

    produit = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      succes: true,
      message: 'Produit modifié avec succès !',
      produit
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la modification du produit.'
    });
  }
});

// @route   DELETE /api/produits/:id
// @desc    Supprimer un produit
// @access  Privé (fournisseur propriétaire uniquement)
router.delete('/:id', proteger, autoriser('fournisseur'), async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);

    if (!produit) {
      return res.status(404).json({
        succes: false,
        message: 'Produit introuvable.'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (produit.fournisseur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        succes: false,
        message: 'Vous n\'êtes pas autorisé à supprimer ce produit.'
      });
    }

    await produit.deleteOne();

    res.status(200).json({
      succes: true,
      message: 'Produit supprimé avec succès !'
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la suppression du produit.'
    });
  }
});

module.exports = router;