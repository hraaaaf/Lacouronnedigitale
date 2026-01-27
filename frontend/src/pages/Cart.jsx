import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { commandesAPI } from '../utils/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

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
    const fraisLivraison = 50; // Fixe pour l'exemple
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
        paiement: {
          methode: paiement
        }
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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
        <p className="text-gray-600 mb-8">Découvrez nos produits et ajoutez-les à votre panier</p>
        <Link to="/produits" className="btn-primary">
          Parcourir le catalogue
        </Link>
      </div>
    );
  }

  const { sousTotal, fraisLivraison, total } = calculerTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier ({panier.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste articles */}
        <div className="lg:col-span-2 space-y-4">
          {panier.map((item, index) => (
            <div key={index} className="card flex items-center space-x-6">
              <img
                src={item.image || 'https://via.placeholder.com/100'}
                alt={item.nom}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{item.nom}</h3>
                <p className="text-primary-600 font-bold">{item.prix} MAD</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantite(index, item.quantite - 1)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{item.quantite}</span>
                <button
                  onClick={() => updateQuantite(index, item.quantite + 1)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-gray-900 mb-2">
                  {(item.prix * item.quantite).toFixed(2)} MAD
                </p>
                <button
                  onClick={() => supprimerArticle(index)}
                  className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Supprimer</span>
                </button>
              </div>
            </div>
          ))}

          <button onClick={viderPanier} className="text-red-600 hover:text-red-700 text-sm">
            Vider le panier
          </button>
        </div>

        {/* Récapitulatif et commande */}
        <div className="space-y-6">
          {/* Résumé */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Sous-total</span>
                <span>{sousTotal.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Frais de livraison</span>
                <span>{fraisLivraison.toFixed(2)} MAD</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">{total.toFixed(2)} MAD</span>
              </div>
            </div>
          </div>

          {/* Formulaire adresse */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Adresse de livraison</h3>
            <form onSubmit={handleCommande} className="space-y-4">
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
              <input
                type="text"
                placeholder="Rue"
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
                rows="2"
              />

              {/* Mode de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Mode de paiement</label>
                <div className="space-y-2">
                  {['cash_livraison', 'virement', 'carte'].map((mode) => (
                    <label key={mode} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paiement"
                        value={mode}
                        checked={paiement === mode}
                        onChange={(e) => setPaiement(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">
                        {mode === 'cash_livraison' && 'Cash à la livraison'}
                        {mode === 'virement' && 'Virement bancaire'}
                        {mode === 'carte' && 'Carte bancaire'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Traitement...' : 'Valider la commande'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;