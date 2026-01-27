const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Numéro de commande unique
  numeroCommande: {
    type: String,
    unique: true,
    required: true
  },
  
  // Acheteur
  acheteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Produits commandés
  articles: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    fournisseur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    nom: String, // Sauvegardé pour historique
    prix: Number,
    quantite: {
      type: Number,
      required: true,
      min: 1
    },
    sousTotal: Number
  }],
  
  // Montants
  montants: {
    sousTotal: {
      type: Number,
      required: true
    },
    fraisLivraison: {
      type: Number,
      default: 0
    },
    commission: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  
  // Livraison
  adresseLivraison: {
    nom: String,
    telephone: String,
    rue: String,
    ville: String,
    codePostal: String,
    complement: String
  },
  
  // Statut
  statut: {
    type: String,
    enum: [
      'en_attente',
      'confirmee',
      'en_preparation',
      'expediee',
      'livree',
      'annulee',
      'remboursee'
    ],
    default: 'en_attente'
  },
  
  // Paiement
  paiement: {
    methode: {
      type: String,
      enum: ['virement', 'cash_livraison', 'carte', 'cheque'],
      required: true
    },
    statut: {
      type: String,
      enum: ['en_attente', 'paye', 'echoue', 'rembourse'],
      default: 'en_attente'
    },
    datePaiement: Date,
    reference: String // Référence transaction
  },
  
  // Suivi
  suivi: [{
    statut: String,
    description: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Notes
  notes: {
    acheteur: String,
    fournisseur: String,
    admin: String
  },
  
  // Évaluation (après livraison)
  evaluation: {
    note: {
      type: Number,
      min: 1,
      max: 5
    },
    commentaire: String,
    dateEvaluation: Date
  }
}, {
  timestamps: true
});

// Générer numéro de commande automatiquement
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.numeroCommande = `CMD${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calculer commission automatiquement
orderSchema.pre('save', function(next) {
  if (this.montants.sousTotal) {
    const tauxCommission = parseFloat(process.env.COMMISSION_RATE) / 100;
    this.montants.commission = this.montants.sousTotal * tauxCommission;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);