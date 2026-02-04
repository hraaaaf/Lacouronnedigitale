// upload.js
// Version production-friendly : stockage en mémoire (pour upload via backend si besoin).
// Si tu fais Cloudinary-only depuis le front, ce fichier peut être ignoré.
const multer = require('multer');
const path = require('path');

// Mémoire (pas d'écriture disque)
const storage = multer.memoryStorage();

// Filtrer les types de fichiers (images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images (JPEG, JPG, PNG, WEBP) sont autorisées !'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

module.exports = upload;
