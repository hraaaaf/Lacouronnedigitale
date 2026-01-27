const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Informations de base
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    match: [/^(06|07|05)\d{8}$/, 'Numéro marocain invalide (ex: 0612345678)']
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Minimum 6 caractères'],
    select: false // Ne pas renvoyer le mdp par défaut
  },

  // Type de compte
  role: {
    type: String,
    enum: ['acheteur', 'fournisseur', 'admin'],
    default: 'acheteur'
  },

  // Informations professionnelles (pour fournisseurs)
  entreprise: {
    nom: String,
    registreCommerce: String,
    ice: String, // Identifiant Commun de l'Entreprise (Maroc)
    adresse: {
      rue: String,
      ville: String,
      codePostal: String
    }
  },

  // Vérification KYC
  verification: {
    statut: {
      type: String,
      enum: ['en_attente', 'verifie', 'refuse'],
      default: 'en_attente'
    },
    documentsKYC: [{
      type: String, // URLs des documents uploadés
      dateUpload: Date
    }]
  },

  // Gestion abonnement (pour fournisseurs)
  abonnement: {
    type: {
      type: String,
      enum: ['essai_gratuit', 'basique', 'premium', 'inactif'],
      default: 'essai_gratuit'
    },
    dateDebut: {
      type: Date,
      default: Date.now
    },
    dateFin: Date,
    actif: {
      type: Boolean,
      default: true
    }
  },

  // Statistiques
  stats: {
    nombreVentes: { type: Number, default: 0 },
    chiffreAffaires: { type: Number, default: 0 },
    noteGlobale: { type: Number, default: 5, min: 0, max: 5 }
  },

  // Métadonnées
  dateInscription: {
    type: Date,
    default: Date.now
  },
  dernierAcces: Date
}, {
  timestamps: true
});

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function() {
  // Si le mot de passe n'a pas été modifié, on ne fait rien
  if (!this.isModified('motDePasse')) return;
  
  // On enlève le "next()" et on utilise simplement "async/await"
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparerMotDePasse = async function(motDePasseSaisi) {
  return await bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

// Vérifier si l'essai gratuit est expiré
userSchema.methods.essaiGratuitExpire = function() {
  if (this.abonnement.type !== 'essai_gratuit') return false;
  
  const maintenant = new Date();
  const dateExpiration = new Date(this.abonnement.dateDebut);
  dateExpiration.setDate(dateExpiration.getDate() + parseInt(process.env.FREE_TRIAL_DAYS));
  
  return maintenant > dateExpiration;
};

module.exports = mongoose.model('User', userSchema);