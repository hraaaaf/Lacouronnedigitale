const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Conversation (identifiant unique pour une conversation entre 2 utilisateurs)
  conversationId: {
    type: String,
    required: true,
    index: true
  },

  // Expéditeur
  expediteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Destinataire
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Contenu du message
  contenu: {
    type: String,
    required: [true, 'Le message ne peut pas être vide'],
    maxlength: [1000, 'Maximum 1000 caractères']
  },

  // Type de message
  type: {
    type: String,
    enum: ['texte', 'image', 'fichier'],
    default: 'texte'
  },

  // URL si image ou fichier
  fichierUrl: String,

  // Produit concerné (optionnel, pour les discussions produit)
  produitConcerne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },

  // Statut
  lu: {
    type: Boolean,
    default: false
  },
  dateLecture: Date

}, {
  timestamps: true
});

// Index pour recherche rapide des conversations
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ destinataire: 1, lu: 1 });

// Méthode statique pour générer un ID de conversation unique
messageSchema.statics.genererConversationId = function(userId1, userId2) {
  // Trier les IDs pour garantir le même ID peu importe l'ordre
  const ids = [userId1.toString(), userId2.toString()].sort();
  return `${ids[0]}_${ids[1]}`;
};

module.exports = mongoose.model('Message', messageSchema);