import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { commandesAPI } from '../utils/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, CreditCard, Sparkles, CheckCircle, Package } from 'lucide-react';

const Cart = () => {
  const [panier, setPanier] = useState([]);
  const [adresse, setAdresse] = useState({
    nom: '',
    telephone: '',
    rue: '',
    ville: '',
    codePostal: '',
    complement: ''
  });
  const [paiement, setPaiement] = useState('cash_livraison');
  const [loading, setLoading] = useState(false);
  const [etape, setEtape] = useState(1); // 1: Panier, 2: Livraison, 3: Paiement
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'acheteur') {
      navigate('/connexion');
      return;
    }
    chargerPanier();
  }, [user, navigate]);

  const chargerPanier = () => {
    const panierLocal = JSON.parse(localStorage.getItem('panier') || '[]');
    setPanier(panierLocal);
  };

  const updateQuantite = (index, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) return;
    const nouveauPanier = [...panier];
    nouveauPanier[index].quantite = nouvelleQuantite;
    setPanier(nouveauPanier);
    localStorage.setItem('panier', JSON.stringify(nouveauPanier));
  };

  const supprimerArticle = (index) => {
    const nouveauPanier = panier.filter((_, i) => i !== index);
    setPanier(nouveauPanier);
    localStorage.setItem('panier', JSON.stringify(nouveauPanier));
  };

  const viderPanier = () => {
    setPanier([]);
    localStorage.removeItem('panier');
  };

  const calculerTotal = () => {
    const sousTotal = panier.reduce((acc, item) => acc + (item.prix * item.quantite), 0);
    const fraisLivraison = 50;
    return { sousTotal, fraisLivraison, total: sousTotal + fraisLivraison };
  };

  const handleCommande = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const articles = panier.map(item => ({
        produit: item.produit,
        quantite: item.quantite
      }));

      await commandesAPI.create({
        articles,
        adresseLivraison: adresse,
        paiement: { methode: paiement }
      });

      viderPanier();
      navigate('/commandes');
    } catch (error) {
      console.error('Erreur création commande:', error);
      alert(error.response?.data?.message || 'Erreur lors de la commande');
    }

    setLoading(false);
  };

  if (panier.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="card max-w-2xl w-full text-center animate-scale-in">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="heading-2 gradient-text mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Découvrez notre catalogue et trouvez les produits parfaits pour votre pratique
          </p>
          <Link to="/produits" className="btn-primary inline-flex items-center group">
            <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Découvrir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  const { sousTotal, fraisLivraison, total } = calculerTotal();

  const etapes = [
    { num: 1, titre: 'Panier', icon: ShoppingBag },
    { num: 2, titre: 'Livraison', icon: MapPin },
    { num: 3, titre: 'Paiement', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="heading-2 gradient-text mb-4">Mon Panier</h1>
          <p className="text-xl text-gray-600">{panier.length} article(s) dans votre panier</p>
        </div>

        {/* Progression */}
        <div className="mb-12">
          <div className="flex justify-center items-center space-x-4">
            {etapes.map((e, idx) => (
              <div key={e.num} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  etape >= e.num ? 'opacity-100' : 'opacity-40'
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-glow mb-2 transition-all duration-500 ${
                    etape > e.num 
                      ? 'bg-gradient-to-br from-green-500 to-teal-500 scale-110' 
                      : etape === e.num
                      ? 'bg-gradient-to-br from-primary-600 to-purple-600 scale-110 animate-pulse'
                      : 'bg-gray-300'
                  }`}>
                    {etape > e.num ? <CheckCircle className="w-8 h-8" /> : <e.icon className="w-8 h-8" />}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{e.titre}</span>
                </div>
                {idx < etapes.length - 1 && (
                  <div className={`w-24 h-1 mx-4 rounded-full transition-all duration-500 ${
                    etape > e.num ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Étape 1: Articles */}
            {etape === 1 && (
              <div className="space-y-4 animate-fade-in">
                {panier.map((item, index) => (
                  <div key={index} className="card group hover-lift">
                    <div className="flex items-center space-x-6">
                      <img
                        src={item.image || 'https://via.placeholder.com/120'}
                        alt={item.nom}
                        className="w-28 h-28 object-cover rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:gradient-text transition-all">
                          {item.nom}
                        </h3>
                        <p className="text-2xl font-black gradient-text mb-3">{item.prix} MAD</p>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantite(index, item.quantite - 1)}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hover:from-primary-100 hover:to-purple-100 transition-all group/btn"
                          >
                            <Minus className="w-5 h-5 text-gray-600 group-hover/btn:text-primary-600" />
                          </button>
                          <span className="w-16 text-center font-bold text-xl text-gray-900">{item.quantite}</span>
                          <button
                            onClick={() => updateQuantite(index, item.quantite + 1)}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hover:from-primary-100 hover:to-purple-100 transition-all group/btn"
                          >
                            <Plus className="w-5 h-5 text-gray-600 group-hover/btn:text-primary-600" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right space-y-3">
                        <p className="text-3xl font-black text-gray-900">
                          {(item.prix * item.quantite).toFixed(2)} MAD
                        </p>
                        <button
                          onClick={() => supprimerArticle(index)}
                          className="text-red-600 hover:text-red-700 flex items-center space-x-2 text-sm font-bold group/del"
                        >
                          <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center">
                  <button onClick={viderPanier} className="text-red-600 hover:text-red-700 text-sm font-bold">
                    Vider le panier
                  </button>
                  <button onClick={() => setEtape(2)} className="btn-primary group">
                    Continuer
                    <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Étape 2: Livraison */}
            {etape === 2 && (
              <div className="card animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-primary-600" />
                  Adresse de livraison
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nom complet"
                      value={adresse.nom}
                      onChange={(e) => setAdresse({ ...adresse, nom: e.target.value })}
                      required
                      className="input-field"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      value={adresse.telephone}
                      onChange={(e) => setAdresse({ ...adresse, telephone: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Adresse complète"
                    value={adresse.rue}
                    onChange={(e) => setAdresse({ ...adresse, rue: e.target.value })}
                    required
                    className="input-field"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Ville"
                      value={adresse.ville}
                      onChange={(e) => setAdresse({ ...adresse, ville: e.target.value })}
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Code postal"
                      value={adresse.codePostal}
                      onChange={(e) => setAdresse({ ...adresse, codePostal: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <textarea
                    placeholder="Complément d'adresse (optionnel)"
                    value={adresse.complement}
                    onChange={(e) => setAdresse({ ...adresse, complement: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button onClick={() => setEtape(1)} className="btn-outline">
                    ← Retour
                  </button>
                  <button onClick={() => setEtape(3)} className="btn-primary group">
                    Continuer
                    <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Étape 3: Paiement */}
            {etape === 3 && (
              <div className="card animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-primary-600" />
                  Mode de paiement
                </h3>
                
                <div className="space-y-3 mb-8">
                  {[
                    { value: 'cash_livraison', label: 'Cash à la livraison', icon: '💵', popular: true },
                    { value: 'virement', label: 'Virement bancaire', icon: '🏦' },
                    { value: 'carte', label: 'Carte bancaire', icon: '💳' }
                  ].map((mode) => (
                    <label
                      key={mode.value}
                      className={`relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        paiement === mode.value
                          ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-purple-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paiement"
                        value={mode.value}
                        checked={paiement === mode.value}
                        onChange={(e) => setPaiement(e.target.value)}
                        className="w-6 h-6 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{mode.icon}</span>
                          <span className="font-bold text-gray-900 text-lg">{mode.label}</span>
                          {mode.popular && (
                            <span className="badge-primary text-xs">Populaire</span>
                          )}
                        </div>
                      </div>
                      {paiement === mode.value && (
                        <CheckCircle className="w-6 h-6 text-primary-600" />
                      )}
                    </label>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setEtape(2)} className="btn-outline">
                    ← Retour
                  </button>
                  <button
                    onClick={handleCommande}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 group"
                  >
                    {loading ? 'Traitement...' : 'Valider la commande'}
                    <CheckCircle className="w-5 h-5 inline ml-2 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total ({panier.length} article{panier.length > 1 ? 's' : ''})</span>
                  <span className="font-bold">{sousTotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Frais de livraison</span>
                  <span className="font-bold">{fraisLivraison.toFixed(2)} MAD</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span className="gradient-text text-3xl">{total.toFixed(2)} MAD</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Package className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-green-900 mb-1">Livraison gratuite</p>
                    <p className="text-xs text-green-700">Pour toute commande supérieure à 500 MAD</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Livraison rapide sous 2-5 jours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Service client disponible 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;