import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Heart, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const ProductCard = ({ produit }) => {
  console.log("Données du produit reçu:", produit.nom, produit.images);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const imageUrl = produit.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=Produit';
  const prixAffiche = produit.enPromo?.actif ? produit.enPromo.prixPromo : produit.prix;
  const reduction = produit.enPromo?.actif 
    ? Math.round(((produit.prix - produit.enPromo.prixPromo) / produit.prix) * 100)
    : 0;

  return (
    <div 
      className="group card hover-lift relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay au hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

      {/* Image Container */}
      <Link to={`/produits/${produit._id}`} className="block relative">
        <div className="relative overflow-hidden rounded-2xl mb-4 bg-gray-100">
          <img
            src={imageUrl}
            alt={produit.nom}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Overlay gradient sur l'image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Badge réduction */}
          {produit.enPromo?.actif && (
            <div className="absolute top-3 right-3 animate-scale-in">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-glow-lg">
                -{reduction}%
              </div>
            </div>
          )}

          {/* Badge trending */}
          {produit.ventesTotales > 50 && (
            <div className="absolute top-3 left-3 animate-scale-in">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>Populaire</span>
              </div>
            </div>
          )}

          {/* Badge stock */}
          {produit.stock?.quantite < 5 && produit.stock?.quantite > 0 && (
            <div className="absolute bottom-3 left-3 animate-scale-in">
              <div className="bg-yellow-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                Plus que {produit.stock.quantite} !
              </div>
            </div>
          )}

          {produit.stock?.quantite === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-glow-lg">
                Rupture de stock
              </div>
            </div>
          )}

          {/* Quick actions overlay */}
          <div className={`absolute inset-0 flex items-center justify-center space-x-3 transition-all duration-300 ${
            isHovered && produit.stock?.quantite > 0 ? 'opacity-100' : 'opacity-0'
          }`}>
            <button className="bg-white/90 backdrop-blur-xl p-3 rounded-full shadow-glow hover:scale-110 transition-transform">
              <Eye className="w-5 h-5 text-primary-600" />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="bg-white/90 backdrop-blur-xl p-3 rounded-full shadow-glow hover:scale-110 transition-transform"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </Link>

      {/* Contenu */}
      <div className="space-y-3">
        {/* Catégorie */}
        <div className="flex items-center justify-between">
          <span className="inline-block text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            {produit.categorie}
          </span>
          {produit.marque && (
            <span className="text-xs text-gray-500 font-medium">{produit.marque}</span>
          )}
        </div>

        {/* Nom */}
        <Link to={`/produits/${produit._id}`}>
          <h3 className="text-lg font-bold text-gray-900 hover:gradient-text transition-all line-clamp-2 min-h-[3.5rem]">
            {produit.nom}
          </h3>
        </Link>

        {/* Note & Avis */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= (produit.evaluations?.note || 5)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {(produit.evaluations?.note || 5).toFixed(1)}
          </span>
          <span className="text-sm text-gray-400">
            ({produit.evaluations?.nombreAvis || 0})
          </span>
        </div>

        {/* Prix */}
        <div className="flex items-end justify-between pt-2 border-t border-gray-100">
          <div>
            {produit.enPromo?.actif ? (
              <div className="space-y-1">
                <div className="text-2xl font-black gradient-text">
                  {prixAffiche} MAD
                </div>
                <div className="text-sm text-gray-400 line-through">
                  {produit.prix} MAD
                </div>
              </div>
            ) : (
              <div className="text-2xl font-black text-gray-900">
                {produit.prix} MAD
              </div>
            )}
          </div>

          {/* Bouton ajout panier */}
          {produit.stock?.quantite > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                // Logique d'ajout au panier
              }}
              className="btn-primary p-3 hover:scale-110 transition-transform shadow-glow"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Fournisseur */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {produit.fournisseur?.entreprise?.nom?.[0] || 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">
                {produit.fournisseur?.entreprise?.nom || 'Fournisseur'}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">
                {produit.fournisseur?.stats?.noteGlobale?.toFixed(1) || '5.0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Badge "Nouveau" si créé récemment */}
      {new Date(produit.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
        <div className="absolute top-3 left-3">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-glow-lg animate-pulse">
            Nouveau
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;