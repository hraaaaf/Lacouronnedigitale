const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaire: {
    type: String,
    required: [true, 'Veuillez ajouter un commentaire'],
    maxlength: 500
  }
}, { timestamps: true });

// Un utilisateur ne peut laisser qu'un seul avis par produit
reviewSchema.index({ produit: 1, utilisateur: 1 }, { unique: true });

module.exports = mongoose.mongo.model('Review', reviewSchema);