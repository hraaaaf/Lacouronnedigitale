const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { proteger } = require('../middleware/auth');

// @route   POST /api/messages
// @desc    Envoyer un message
// @access  Privé
router.post('/', proteger, async (req, res) => {
  try {
    const { destinataire, contenu, produitConcerne } = req.body;

    // Validation
    if (!destinataire || !contenu) {
      return res.status(400).json({
        succes: false,
        message: 'Destinataire et contenu requis.'
      });
    }

    // Ne pas s'envoyer de message à soi-même
    if (destinataire === req.user._id.toString()) {
      return res.status(400).json({
        succes: false,
        message: 'Vous ne pouvez pas vous envoyer de message à vous-même.'
      });
    }

    // Générer l'ID de conversation
    const conversationId = Message.genererConversationId(req.user._id, destinataire);

    const message = await Message.create({
      conversationId,
      expediteur: req.user._id,
      destinataire,
      contenu,
      produitConcerne: produitConcerne || null
    });

    const messagePopule = await Message.findById(message._id)
      .populate('expediteur', 'nom prenom')
      .populate('destinataire', 'nom prenom')
      .populate('produitConcerne', 'nom images');

    res.status(201).json({
      succes: true,
      message: 'Message envoyé avec succès !',
      data: messagePopule
    });
  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de l\'envoi du message.',
      erreur: error.message
    });
  }
});

// @route   GET /api/messages/conversations
// @desc    Récupérer toutes les conversations de l'utilisateur
// @access  Privé
router.get('/conversations', proteger, async (req, res) => {
  try {
    // Trouver toutes les conversations où l'utilisateur est impliqué
    const messages = await Message.find({
      $or: [
        { expediteur: req.user._id },
        { destinataire: req.user._id }
      ]
    })
      .populate('expediteur', 'nom prenom entreprise')
      .populate('destinataire', 'nom prenom entreprise')
      .populate('produitConcerne', 'nom images')
      .sort({ createdAt: -1 });

    // Grouper par conversation et garder le dernier message
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const convId = msg.conversationId;
      if (!conversationsMap.has(convId)) {
        // Déterminer l'autre participant
        const autreUtilisateur = msg.expediteur._id.toString() === req.user._id.toString()
          ? msg.destinataire
          : msg.expediteur;

        conversationsMap.set(convId, {
          conversationId: convId,
          autreUtilisateur,
          dernierMessage: msg,
          messagesNonLus: 0
        });
      }

      // Compter les messages non lus
      if (msg.destinataire._id.toString() === req.user._id.toString() && !msg.lu) {
        conversationsMap.get(convId).messagesNonLus += 1;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      succes: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération des conversations.'
    });
  }
});

// @route   GET /api/messages/conversation/:autreUserId
// @desc    Récupérer tous les messages d'une conversation
// @access  Privé
router.get('/conversation/:autreUserId', proteger, async (req, res) => {
  try {
    const conversationId = Message.genererConversationId(req.user._id, req.params.autreUserId);

    const messages = await Message.find({ conversationId })
      .populate('expediteur', 'nom prenom')
      .populate('destinataire', 'nom prenom')
      .populate('produitConcerne', 'nom images prix')
      .sort({ createdAt: 1 });

    // Marquer les messages comme lus
    await Message.updateMany(
      {
        conversationId,
        destinataire: req.user._id,
        lu: false
      },
      {
        lu: true,
        dateLecture: new Date()
      }
    );

    res.status(200).json({
      succes: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la récupération des messages.'
    });
  }
});

// @route   GET /api/messages/non-lus
// @desc    Compter les messages non lus
// @access  Privé
router.get('/non-lus', proteger, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      destinataire: req.user._id,
      lu: false
    });

    res.status(200).json({
      succes: true,
      messagesNonLus: count
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors du comptage des messages non lus.'
    });
  }
});

// @route   PUT /api/messages/:id/lire
// @desc    Marquer un message comme lu
// @access  Privé
router.put('/:id/lire', proteger, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        succes: false,
        message: 'Message introuvable.'
      });
    }

    // Vérifier que c'est bien le destinataire
    if (message.destinataire.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        succes: false,
        message: 'Vous n\'êtes pas autorisé à modifier ce message.'
      });
    }

    message.lu = true;
    message.dateLecture = new Date();
    await message.save();

    res.status(200).json({
      succes: true,
      message: 'Message marqué comme lu.',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la mise à jour du message.'
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Supprimer un message
// @access  Privé
router.delete('/:id', proteger, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        succes: false,
        message: 'Message introuvable.'
      });
    }

    // Seul l'expéditeur peut supprimer son message
    if (message.expediteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        succes: false,
        message: 'Vous ne pouvez supprimer que vos propres messages.'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      succes: true,
      message: 'Message supprimé avec succès !'
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de la suppression du message.'
    });
  }
});

module.exports = router;