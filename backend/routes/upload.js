const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { proteger } = require('../middleware/auth');

// 1. Configuration de Cloudinary (les clés seront sur Render)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuration du moteur de stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lacouronne_uploads', // Nom du dossier dans Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }] // Optimisation automatique
  }
});

const upload = multer({ storage: storage });

// @route   POST /api/upload/image (Une seule image)
router.post('/image', proteger, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ succes: false, message: 'Aucune image fournie.' });
    }

    // L'URL est maintenant fournie directement par Cloudinary (https://res.cloudinary.com/...)
    res.status(200).json({
      succes: true,
      message: 'Image uploadée sur Cloudinary !',
      imageUrl: req.file.path 
    });
  } catch (error) {
    res.status(500).json({ succes: false, message: error.message });
  }
});

// @route   POST /api/upload/images (Plusieurs images)
router.post('/images', proteger, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ succes: false, message: 'Aucune image fournie.' });
    }

    const imageUrls = req.files.map(file => file.path);

    res.status(200).json({
      succes: true,
      message: `${req.files.length} image(s) uploadée(s) sur Cloudinary !`,
      imageUrls
    });
  } catch (error) {
    res.status(500).json({ succes: false, message: error.message });
  }
});

module.exports = router;