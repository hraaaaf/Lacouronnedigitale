import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { produitsAPI, messagesAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Star, MessageCircle, Package, Truck, Shield, ChevronLeft, MapPin, Heart, Share2, Eye, CheckCircle } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);
  const [imageActive, setImageActive] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    chargerProduit();
  }, [id]);

  const chargerProduit = async () => {
    try {
      const response = await produitsAPI.getById(id);
      setProduit(response.data.produit);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const ajouterAuPanier = () => {
    const panier = JSON.parse(localStorage.getItem('panier') || '[]');
    const produitExiste = panier.find(item => item.produit === produit._id);

    if (produitExiste) {
      produitExiste.quantite += quantite;
    } else {
      panier.push({
        produit: produit._id,
        nom: produit.nom,
        prix: produit.prix,
        quantite,
        image: produit.images?.[0]?.url
      });
    }

    localStorage.setItem('panier', JSON.stringify(panier));
    alert('Produit ajouté au panier !');
  };

  const contacterFournisseur = async () => {
    if (!user) {
      navigate('/connexion');
      return;
    }

    try {
      await messagesAPI.send({
        destinataire: produit.fournisseur._id,
        contenu: `Bonjour, je suis intéressé par le produit "${produit.nom}"`,
        produitConcerne: produit._id
      });
      navigate('/messages');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner w-16 h-16"></div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Produit introuvable</h2>
        <Link to="/produits" className="btn-primary">Retour au catalogue</Link>
      </div>
    );
  }

  const images = produit.images?.length ? produit.images : [{ url: 'https://via.placeholder.com/600x600?text=Produit' }];
  const prixAffiche = produit.enPromo?.actif ? produit.enPromo.prixPromo : produit.prix;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary-600">Accueil</Link>
          <span className="text-gray-400">/</span>
          <Link to="/produits" className="text-gray-500 hover:text-primary-600">Produits</Link>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-900">{produit.categorie}</span>
        </nav>

        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Retour</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div className="space-y-4 animate-fade-in">
            <div className="card p-6 relative group">
              <img src={images[imageActive].url} alt={produit.nom} className="w-full h-96 object-contain rounded-2xl" />
              
              {produit.enPromo?.actif && (
                <div className="absolute top-8 right-8">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-black shadow-glow text-lg">
                    -{Math.round(((produit.prix - produit.enPromo.prixPromo) / produit.prix) * 100)}%
                  </div>
                </div>
              )}

              <div className="absolute top-8 left-8 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => setIsLiked(!isLiked)} className="p-3 bg-white/90 backdrop-blur-xl rounded-full shadow-glow hover:scale-110 transition-transform">
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                <button className="p-3 bg-white/90 backdrop-blur-xl rounded-full shadow-glow hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button key={index} onClick={() => setImageActive(index)} className={`card p-2 transition-all ${imageActive === index ? 'ring-4 ring-primary-500 scale-105' : 'hover:scale-105'}`}>
                    <img src={img.url} alt="" className="w-full h-20 object-contain rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="animate-slide-in-up">
            <span className="badge-primary mb-4">{produit.categorie}</span>
            
            <h1 className="text-4xl font-black text-gray-900 mb-4">{produit.nom}</h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-6 h-6 ${star <= (produit.evaluations?.note || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-lg font-bold text-gray-900">{(produit.evaluations?.note || 5).toFixed(1)}</span>
              <span className="text-gray-500">({produit.evaluations?.nombreAvis || 0} avis)</span>
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-1">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{produit.vues || 0} vues</span>
              </div>
            </div>

            {produit.enPromo?.actif ? (
              <div className="mb-6">
                <div className="flex items-baseline space-x-4">
                  <span className="text-5xl font-black gradient-text">{produit.enPromo.prixPromo} MAD</span>
                  <span className="text-3xl text-gray-400 line-through">{produit.prix} MAD</span>
                </div>
              </div>
            ) : (
              <div className="text-5xl font-black text-gray-900 mb-6">{produit.prix} MAD</div>
            )}

            <div className="mb-6">
              {produit.stock?.quantite > 0 ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-600 font-bold text-lg">En stock ({produit.stock.quantite} disponible{produit.stock.quantite > 1 ? 's' : ''})</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Package className="w-6 h-6 text-red-600" />
                  <span className="text-red-600 font-bold text-lg">Rupture de stock</span>
                </div>
              )}
            </div>

            {produit.marque && (
              <div className="mb-6 pb-6 border-b">
                <span className="text-gray-600 font-medium">Marque: </span>
                <span className="font-bold text-gray-900 text-lg">{produit.marque}</span>
              </div>
            )}

            {produit.stock?.quantite > 0 && user?.role === 'acheteur' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Quantité</label>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => setQuantite(Math.max(1, quantite - 1))} className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hover:from-primary-100 hover:to-purple-100 transition-all font-bold text-xl">
                      -
                    </button>
                    <input type="number" value={quantite} onChange={(e) => setQuantite(Math.max(1, parseInt(e.target.value) || 1))} className="w-24 text-center input-field text-xl font-bold" min="1" max={produit.stock.quantite} />
                    <button onClick={() => setQuantite(Math.min(produit.stock.quantite, quantite + 1))} className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hover:from-primary-100 hover:to-purple-100 transition-all font-bold text-xl">
                      +
                    </button>
                  </div>
                </div>

                <button onClick={ajouterAuPanier} className="w-full btn-primary text-lg py-4 group">
                  <ShoppingCart className="w-6 h-6 inline mr-2 group-hover:scale-110 transition-transform" />
                  Ajouter au panier - {prixAffiche * quantite} MAD
                </button>
              </div>
            )}

            <button onClick={contacterFournisseur} className="w-full btn-outline text-lg py-4 mb-6 group">
              <MessageCircle className="w-6 h-6 inline mr-2 group-hover:scale-110 transition-transform" />
              Contacter le fournisseur
            </button>

            <div className="card-gradient p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Fournisseur</h3>
              <Link to={`/fournisseur/${produit.fournisseur._id}`} className="flex items-start space-x-4 hover:bg-white/50 p-4 rounded-2xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-glow group-hover:scale-110 transition-transform">
                  {produit.fournisseur.entreprise?.nom?.[0] || 'F'}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg group-hover:gradient-text transition-all">{produit.fournisseur.entreprise?.nom || 'Fournisseur'}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-700">{produit.fournisseur.stats?.noteGlobale?.toFixed(1) || '5.0'}</span>
                  </div>
                  {produit.fournisseur.entreprise?.adresse?.ville && (
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{produit.fournisseur.entreprise.adresse.ville}</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            <div className="card-glass p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Truck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Livraison</h4>
                    <p className="text-sm text-gray-600">Type: {produit.livraison?.type === 'equipement_lourd' ? 'Équipement lourd (sur devis)' : 'Standard'}</p>
                    {produit.livraison?.delai && <p className="text-sm text-gray-600">Délai: {produit.livraison.delai}</p>}
                    {produit.livraison?.frais > 0 && <p className="text-sm text-gray-600">Frais: {produit.livraison.frais} MAD</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">{produit.description}</p>

              {produit.specifications && Object.keys(produit.specifications).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Spécifications techniques</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(produit.specifications).filter(([_, v]) => v).map(([key, value]) => (
                      <div key={key} className="p-4 bg-gray-50 rounded-xl">
                        <dt className="text-sm font-bold text-gray-600 uppercase mb-1">{key}</dt>
                        <dd className="text-gray-900 font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-gradient">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Paiement sécurisé</h4>
                    <p className="text-sm text-gray-600 mt-1">Vos données sont protégées</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Produits certifiés</h4>
                    <p className="text-sm text-gray-600 mt-1">Conformes aux normes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Truck className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900">Livraison rapide</h4>
                    <p className="text-sm text-gray-600 mt-1">Dans tout le Maroc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;