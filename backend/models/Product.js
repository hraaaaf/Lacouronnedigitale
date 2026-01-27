const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Informations de base
  nom: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    maxlength: [200, 'Maximum 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [2000, 'Maximum 2000 caractères']
  },
  
  // Catégorisation
  categorie: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: [
      'Instruments',
      'Consommables',
      'Équipements lourds',
      'Hygiène & Stérilisation',
      'Radiologie',
      'Prothèse',
      'Implantologie',
      'Orthodontie',
      'Endodontie',
      'Parodontologie',
      'Autres'
    ]
  },
  sousCategorie: String,
  marque: String,
  
  // Prix et stock
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix doit être positif']
  },
  devise: {
    type: String,
    default: 'MAD'
  },
  stock: {
    quantite: {
      type: Number,
      required: [true, 'La quantité en stock est requise'],
      min: [0, 'Le stock ne peut pas être négatif']
    },
    unite: {
      type: String,
      default: 'unité',
      enum: ['unité', 'boîte', 'paquet', 'set', 'kg', 'litre']
    }
  },
  
  // Images
  images: [{
    url: String,
    altText: String
  }],
  
  // Fournisseur
  fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Spécifications techniques
  specifications: {
    reference: String,
    dimensions: String,
    poids: String,
    materiau: String,
    certification: String, // Ex: CE, FDA
    origine: String
  },
  
  // Livraison
  livraison: {
    type: {
      type: String,
      enum: ['standard', 'express', 'equipement_lourd', 'sur_devis'],
      default: 'standard'
    },
    delai: String, // Ex: "2-5 jours"
    frais: Number,
    zones: [String] // Villes disponibles
  },
  
  // Évaluations
  evaluations: {
    note: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    nombreAvis: {
      type: Number,
      default: 0
    }
  },
  
  // Statut
  actif: {
    type: Boolean,
    default: true
  },
  enPromo: {
    actif: Boolean,
    prixPromo: Number,
    dateFin: Date
  },
  
  // Métadonnées
  vues: {
    type: Number,
    default: 0
  },
  ventesTotales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
productSchema.index({ nom: 'text', description: 'text', marque: 'text' });
productSchema.index({ categorie: 1, prix: 1 });
productSchema.index({ fournisseur: 1 });

module.exports = mongoose.model('Product', productSchema);