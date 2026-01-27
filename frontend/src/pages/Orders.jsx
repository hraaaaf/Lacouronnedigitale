import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { commandesAPI } from '../utils/api';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, MapPin, Phone } from 'lucide-react';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    chargerCommandes();
  }, [user, navigate]);

  const chargerCommandes = async () => {
    try {
      const response = await commandesAPI.getAll();
      setCommandes(response.data.commandes);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
    setLoading(false);
  };

  const voirDetails = async (id) => {
    try {
      const response = await commandesAPI.getById(id);
      setCommandeSelectionnee(response.data.commande);
      setShowModal(true);
    } catch (error) {
      console.error('Erreur chargement commande:', error);
    }
  };

  const changerStatut = async (id, nouveauStatut) => {
    try {
      await commandesAPI.updateStatut(id, { statut: nouveauStatut });
      chargerCommandes();
      if (commandeSelectionnee?._id === id) {
        voirDetails(id);
      }
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert(error.response?.data?.message || 'Erreur');
    }
  };

  const annulerCommande = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) return;

    try {
      await commandesAPI.annuler(id);
      chargerCommandes();
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur');
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      'en_attente': { color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-4 h-4" />, text: 'En attente' },
      'confirmee': { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-4 h-4" />, text: 'Confirmée' },
      'en_preparation': { color: 'bg-purple-100 text-purple-700', icon: <Package className="w-4 h-4" />, text: 'En préparation' },
      'expediee': { color: 'bg-indigo-100 text-indigo-700', icon: <Truck className="w-4 h-4" />, text: 'Expédiée' },
      'livree': { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" />, text: 'Livrée' },
      'annulee': { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" />, text: 'Annulée' }
    };
    return badges[statut] || badges['en_attente'];
  };

  const commandesFiltrees = filtreStatut === 'tous'
    ? commandes
    : commandes.filter(c => c.statut === filtreStatut);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Commandes</h1>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['tous', 'en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee'].map((statut) => (
          <button
            key={statut}
            onClick={() => setFiltreStatut(statut)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filtreStatut === statut
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {statut === 'tous' ? 'Toutes' : getStatutBadge(statut).text}
            {statut === 'tous' && ` (${commandes.length})`}
          </button>
        ))}
      </div>

      {/* Liste des commandes */}
      {commandesFiltrees.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
          <p className="text-gray-600">Vous n'avez pas encore de commandes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {commandesFiltrees.map((commande) => {
            const badge = getStatutBadge(commande.statut);
            return (
              <div key={commande._id} className="card hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="font-bold text-lg text-gray-900">#{commande.numeroCommande}</span>
                      <span className={`badge ${badge.color} flex items-center space-x-1`}>
                        {badge.icon}
                        <span>{badge.text}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="mb-1">
                          <strong>Date:</strong> {new Date(commande.createdAt).toLocaleDateString('fr-MA')}
                        </p>
                        <p className="mb-1">
                          <strong>Articles:</strong> {commande.articles.length} produit(s)
                        </p>
                      </div>
                      <div>
                        <p className="mb-1">
                          <strong>Paiement:</strong> {commande.paiement.methode}
                        </p>
                        <p className="font-bold text-primary-600 text-lg">
                          {commande.montants.total.toFixed(2)} MAD
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => voirDetails(commande._id)}
                      className="btn-outline flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Détails</span>
                    </button>

                    {/* Actions fournisseur */}
                    {user.role === 'fournisseur' && commande.statut === 'en_attente' && (
                      <button
                        onClick={() => changerStatut(commande._id, 'confirmee')}
                        className="btn-primary"
                      >
                        Confirmer
                      </button>
                    )}

                    {/* Actions acheteur */}
                    {user.role === 'acheteur' && ['en_attente', 'confirmee'].includes(commande.statut) && (
                      <button
                        onClick={() => annulerCommande(commande._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal détails */}
      {showModal && commandeSelectionnee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Commande #{commandeSelectionnee.numeroCommande}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Statut */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatutBadge(commandeSelectionnee.statut).icon}
                  <span className="font-semibold text-lg">
                    {getStatutBadge(commandeSelectionnee.statut).text}
                  </span>
                </div>
                <span className="text-gray-600">
                  {new Date(commandeSelectionnee.createdAt).toLocaleString('fr-MA')}
                </span>
              </div>

              {/* Articles */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Articles commandés</h3>
                <div className="space-y-3">
                  {commandeSelectionnee.articles.map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={article.produit?.images?.[0]?.url || 'https://via.placeholder.com/60'}
                          alt={article.nom}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{article.nom}</p>
                          <p className="text-sm text-gray-600">Quantité: {article.quantite}</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary-600">{article.sousTotal.toFixed(2)} MAD</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adresse livraison */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Adresse de livraison</span>
                </h3>
                <p className="text-gray-700">
                  {commandeSelectionnee.adresseLivraison.nom}<br />
                  {commandeSelectionnee.adresseLivraison.rue}<br />
                  {commandeSelectionnee.adresseLivraison.ville}, {commandeSelectionnee.adresseLivraison.codePostal}
                </p>
                <div className="mt-2 flex items-center space-x-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  <span>{commandeSelectionnee.adresseLivraison.telephone}</span>
                </div>
              </div>

              {/* Récapitulatif */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Sous-total</span>
                    <span>{commandeSelectionnee.montants.sousTotal.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Frais de livraison</span>
                    <span>{commandeSelectionnee.montants.fraisLivraison.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary-600">{commandeSelectionnee.montants.total.toFixed(2)} MAD</span>
                  </div>
                </div>
              </div>

              {/* Actions fournisseur */}
              {user.role === 'fournisseur' && (
                <div className="flex space-x-3">
                  {commandeSelectionnee.statut === 'confirmee' && (
                    <button
                      onClick={() => changerStatut(commandeSelectionnee._id, 'en_preparation')}
                      className="flex-1 btn-primary"
                    >
                      Marquer en préparation
                    </button>
                  )}
                  {commandeSelectionnee.statut === 'en_preparation' && (
                    <button
                      onClick={() => changerStatut(commandeSelectionnee._id, 'expediee')}
                      className="flex-1 btn-primary"
                    >
                      Marquer comme expédiée
                    </button>
                  )}
                  {commandeSelectionnee.statut === 'expediee' && (
                    <button
                      onClick={() => changerStatut(commandeSelectionnee._id, 'livree')}
                      className="flex-1 btn-primary"
                    >
                      Marquer comme livrée
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;