const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { proteger } = require('../middleware/auth');

// @route   POST /api/upload/image
// @desc    Upload une image
// @access  Privé
router.post('/image', proteger, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        succes: false,
        message: 'Aucune image fournie.'
      });
    }

    // URL de l'image uploadée
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      succes: true,
      message: 'Image uploadée avec succès !',
      imageUrl
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de l\'upload de l\'image.',
      erreur: error.message
    });
  }
});

// @route   POST /api/upload/images
// @desc    Upload plusieurs images (max 5)
// @access  Privé
router.post('/images', proteger, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        succes: false,
        message: 'Aucune image fournie.'
      });
    }

    // URLs des images uploadées
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
      succes: true,
      message: `${req.files.length} image(s) uploadée(s) avec succès !`,
      imageUrls
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: 'Erreur lors de l\'upload des images.',
      erreur: error.message
    });
  }
});

module.exports = router;