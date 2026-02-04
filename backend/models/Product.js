const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  categorie: { 
    type: String, 
    required: true,
    enum: ['Instruments', 'Consommables', 'Équipements lourds', 'Hygiène & Stérilisation', 'Radiologie', 'Prothèse', 'Implantologie', 'Orthodontie', 'Endodontie', 'Parodontologie', 'Autres']
  },
  marque: String,
  prix: { type: Number, required: true, min: 0 },
  conditionnement: String, 
  stock: {
    quantite: { type: Number, required: true, min: 0 },
    unite: { type: String, default: 'unité' }
  },
  images: [imageSchema],
  fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // ON GARDE TES CHAMPS TECHNIQUES ICI :
  specifications: {
    reference: String,
    dimensions: String,
    poids: String,
    materiau: String,
    certification: String,
    origine: String
  },
  livraison: {
    type: { type: String, enum: ['standard', 'express', 'equipement_lourd', 'sur_devis'], default: 'standard' },
    delai: String,
    frais: Number,
    zones: [String]
  },
  evaluations: {
    note: { type: Number, default: 0 },
    nombreAvis: { type: Number, default: 0 }
  },
  actif: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ nom: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);