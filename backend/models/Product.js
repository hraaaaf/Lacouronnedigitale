// models/Product.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  altText: { type: String, default: '' }
}, { _id: false });

const productSchema = new mongoose.Schema({
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
  images: {
    type: [imageSchema],
    default: []
  },
  fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specifications: {
    reference: String,
    dimensions: String,
    poids: String,
    materiau: String,
    certification: String,
    origine: String
  },
  livraison: {
    type: {
      type: String,
      enum: ['standard', 'express', 'equipement_lourd', 'sur_devis'],
      default: 'standard'
    },
    delai: String,
    frais: Number,
    zones: [String]
  },
  evaluations: {
    note: { type: Number, default: 0, min: 0, max: 5 },
    nombreAvis: { type: Number, default: 0 }
  },
  actif: { type: Boolean, default: true },
  enPromo: {
    actif: Boolean,
    prixPromo: Number,
    dateFin: Date
  },
  vues: { type: Number, default: 0 },
  ventesTotales: { type: Number, default: 0 }
}, {
  timestamps: true
});

productSchema.index({ nom: 'text', description: 'text', marque: 'text' });
productSchema.index({ categorie: 1, prix: 1 });
productSchema.index({ fournisseur: 1 });

module.exports = mongoose.model('Product', productSchema);
