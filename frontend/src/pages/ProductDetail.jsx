import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { produitsAPI, api } from '../utils/api'; // J'utilise 'api' générique pour les avis
import { AuthContext } from '../context/AuthContext';
import { 
  ShoppingCart, Star, MessageCircle, Package, Truck, Shield, 
  ChevronLeft, MapPin, Check, AlertCircle, User 
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // États Produit
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);
  const [imageActive, setImageActive] = useState(0);
  
  // États Avis
  const [avis, setAvis] = useState([]);
  const [loadingAvis, setLoadingAvis] = useState(true);
  const [nouvelAvis, setNouvelAvis] = useState({ note: 5, commentaire: '' });
  const [messageAvis, setMessageAvis] = useState({ type: '', text: '' });

  useEffect(() => {
    chargerDonnees();
  }, [id]);

  const chargerDonnees = async () => {
    try {
      // On charge le produit et les avis en parallèle
      const [produitRes, avisRes] = await Promise.all([
        produitsAPI.getById(id),
        api.get(`/reviews/${id}`)
      ]);

      setProduit(produitRes.data.produit);
      setAvis(avisRes.data.data || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
    setLoading(false);
    setLoadingAvis(false);
  };

  const ajouterAuPanier = () => {
    const panierActuel = JSON.parse(localStorage.getItem('panier') || '[]');
    const indexExistant = panierActuel.findIndex(item => item.produit === produit._id);

    if (indexExistant > -1) {
      panierActuel[indexExistant].quantite += quantite;
    } else {
      panierActuel.push({
        produit: produit._id,
        nom: produit.nom,
        prix: produit.prix,
        image: produit.images[0]?.url,
        quantite: quantite,
        fournisseur: produit.fournisseur
      });
    }

    localStorage.setItem('panier', JSON.stringify(panierActuel));
    
    // Petit effet visuel ou navigation
    const confirm = window.confirm("Produit ajouté ! Voir le panier ?");
    if (confirm) navigate('/panier');
  };

  const envoyerAvis = async (e) => {
    e.preventDefault();
    setMessageAvis({ type: '', text: '' });

    try {
      const res = await api.post(`/reviews/${id}`, nouvelAvis);
      setAvis([res.data.data, ...avis]); // Ajoute le nouvel avis en haut
      setNouvelAvis({ note: 5, commentaire: '' }); // Reset formulaire
      setMessageAvis({ type: 'success', text: 'Merci pour votre avis !' });
    } catch (error) {
      setMessageAvis({ 
        type: 'error', 
        text: error.response?.data?.message || "Erreur lors de l'envoi de l'avis" 
      });
    }
  };

  // Calcul de la moyenne des notes
  const noteMoyenne = avis.length > 0 
    ? (avis.reduce((acc, curr) => acc + curr.note, 0) / avis.length).toFixed(1)
    : 0;

  // Fonction pour afficher les étoiles
  const renderStars = (note, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''} ${
          index < note ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
        onClick={() => interactive && setNouvelAvis({ ...nouvelAvis, note: index + 1 })}
      />
    ));
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loading-spinner"></div></div>;
  if (!produit) return <div className="text-center py-20">Produit introuvable</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fil d'ariane */}
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary-600 mb-6 transition">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Galerie Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 p-4">
            <img 
              src={produit.images[imageActive]?.url || 'https://via.placeholder.com/600'} 
              alt={produit.nom}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {produit.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setImageActive(idx)}
                className={`aspect-square rounded-xl border-2 overflow-hidden ${
                  imageActive === idx ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Infos Produit */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="badge bg-primary-50 text-primary-700 border-primary-100">
              {produit.categorie}
            </span>
            {produit.stock.quantite > 0 ? (
              <span className="badge bg-green-50 text-green-700 border-green-100 flex items-center">
                <Check className="w-3 h-3 mr-1" /> En stock
              </span>
            ) : (
              <span className="badge bg-red-50 text-red-700 border-red-100">Rupture</span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{produit.nom}</h1>
          
          {/* Note Moyenne */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex">{renderStars(Math.round(noteMoyenne))}</div>
            <span className="text-gray-500 text-sm">({avis.length} avis)</span>
          </div>

          <div className="text-gray-600 mb-8 leading-relaxed">
            {produit.description}
          </div>

          <div className="flex items-end space-x-4 mb-8">
            <span className="text-4xl font-black text-primary-600">{produit.prix} MAD</span>
            {produit.prixPromo && (
              <span className="text-xl text-gray-400 line-through mb-1">{produit.prixPromo} MAD</span>
            )}
          </div>

          {/* Sélecteur Quantité & Bouton */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 border-b border-gray-100 pb-8">
            <div className="flex items-center border border-gray-300 rounded-xl w-fit">
              <button 
                onClick={() => setQuantite(Math.max(1, quantite - 1))}
                className="p-3 hover:bg-gray-50 text-gray-600"
              >
                -
              </button>
              <span className="w-12 text-center font-bold">{quantite}</span>
              <button 
                onClick={() => setQuantite(Math.min(produit.stock.quantite, quantite + 1))}
                className="p-3 hover:bg-gray-50 text-gray-600"
              >
                +
              </button>
            </div>
            
            <button 
              onClick={ajouterAuPanier}
              disabled={produit.stock.quantite === 0}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{produit.stock.quantite === 0 ? 'Indisponible' : 'Ajouter au panier'}</span>
            </button>
          </div>

          {/* Infos Fournisseur */}
          {produit.fournisseur && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BuildingIcon className="w-5 h-5 mr-2 text-gray-500" />
                Vendu par
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">{produit.fournisseur.entreprise?.nom || 'Fournisseur Certifié'}</p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {produit.fournisseur.entreprise?.adresse?.ville || 'Maroc'}
                  </p>
                </div>
                <Link 
                  to={`/messages?destinataire=${produit.fournisseur._id}`}
                  className="btn-secondary text-sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section Spécifications & Avis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Colonne Gauche : Spécifications */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Spécifications</h3>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <dl className="space-y-4">
              {produit.marque && (
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <dt className="text-gray-500">Marque</dt>
                  <dd className="font-medium text-gray-900">{produit.marque}</dd>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <dt className="text-gray-500">Référence</dt>
                <dd className="font-medium text-gray-900 font-mono text-sm">REF-{produit._id.slice(-6).toUpperCase()}</dd>
              </div>
              {/* Tu peux ajouter d'autres specs ici */}
            </dl>
          </div>

          {/* Réassurance */}
          <div className="bg-primary-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-primary-600" />
              <span className="text-sm font-medium text-primary-900">Garantie constructeur</span>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6 text-primary-600" />
              <span className="text-sm font-medium text-primary-900">Livraison 24/48h</span>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-primary-600" />
              <span className="text-sm font-medium text-primary-900">Emballage sécurisé</span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Avis Clients */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            Avis Clients 
            <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {avis.length} avis
            </span>
          </h3>

          {/* Formulaire d'avis (Seulement pour acheteurs) */}
          {user && user.role === 'acheteur' && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Donnez votre avis</h4>
              <form onSubmit={envoyerAvis}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Votre note</label>
                  <div className="flex space-x-1">
                    {renderStars(nouvelAvis.note, true)}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
                  <textarea
                    value={nouvelAvis.commentaire}
                    onChange={(e) => setNouvelAvis({...nouvelAvis, commentaire: e.target.value})}
                    className="input-field w-full h-24 resize-none"
                    placeholder="Qu'avez-vous pensé de ce produit ?"
                    required
                  ></textarea>
                </div>
                
                {messageAvis.text && (
                  <div className={`p-3 rounded-lg mb-4 text-sm ${
                    messageAvis.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {messageAvis.text}
                  </div>
                )}

                <button type="submit" className="btn-primary">Publier l'avis</button>
              </form>
            </div>
          )}

          {/* Liste des avis */}
          <div className="space-y-6">
            {avis.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">Aucun avis pour le moment. Soyez le premier !</p>
              </div>
            ) : (
              avis.map((review) => (
                <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold">
                        {review.utilisateur?.nom?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          Dr. {review.utilisateur?.nom} {review.utilisateur?.prenom}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex">{renderStars(review.note)}</div>
                  </div>
                  <p className="text-gray-600 mt-3 bg-gray-50 p-4 rounded-xl rounded-tl-none">
                    "{review.commentaire}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Petit composant icône manquant
const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default ProductDetail;