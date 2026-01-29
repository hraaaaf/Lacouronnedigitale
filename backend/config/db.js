const mongoose = require('mongoose');

const connectDB = async () => {
  // 1. On force la lecture de la variable
  const dbUri = process.env.MONGODB_URI;

  console.log("--- DEBUG DIAGNOSTIC ---");
  // On vérifie si la variable existe (sans l'afficher en entier pour la sécurité)
  if (!dbUri) {
    console.error("❌ ERREUR FATALE : La variable MONGODB_URI est vide ou invisible !");
    console.error("👉 Le serveur ne sait pas où se connecter.");
    process.exit(1); // On arrête tout de suite
  } else {
    console.log("✅ Variable MONGODB_URI détectée (longueur: " + dbUri.length + " caractères).");
  }

  // 2. Connexion
  try {
    const conn = await mongoose.connect(dbUri); 
    // Note: J'ai enlevé les options deprecated (useNewUrlParser, etc) car Mongoose 6+ gère ça tout seul
    
    console.log(`✅ MongoDB Atlas Connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion Mongoose : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;