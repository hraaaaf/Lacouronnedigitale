import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { commandesAPI } from '../utils/api';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, MapPin, Phone, Sparkles } from 'lucide-react';

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
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const voirDetails = async (id) => {
    try {
      const response = await commandesAPI.getById(id);
      setCommandeSelectionnee(response.data.commande);
      setShowModal(true);
    } catch (error) {
      console.error('Erreur:', error);
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
      'en_attente': { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock, text: 'En attente' },
      'confirmee': { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: CheckCircle, text: 'Confirmée' },
      'en_preparation': { color: 'bg-purple-100 text-purple-700 border-purple-300', icon: Package, text: 'En préparation' },
      'expediee': { color: 'bg-indigo-100 text-indigo-700 border-indigo-300', icon: Truck, text: 'Expédiée' },
      'livree': { color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, text: 'Livrée' },
      'annulee': { color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle, text: 'Annulée' }
    };
    return badges[statut] || badges['en_attente'];
  };

  const commandesFiltrees = filtreStatut === 'tous' ? commandes : commandes.filter(c => c.statut === filtreStatut);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="heading-2 gradient-text mb-8">Mes Commandes</h1>

        <div className="mb-6 flex flex-wrap gap-2">
          {['tous', 'en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee'].map((statut) => {
            const badge = getStatutBadge(statut);
            const Icon = badge.icon;
            return (
              <button key={statut} onClick={() => setFiltreStatut(statut)} className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${filtreStatut === statut ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-glow scale-105' : 'bg-white text-gray-700 hover:shadow-lg hover:scale-105'}`}>
                {statut !== 'tous' && <Icon className="w-5 h-5 inline mr-2" />}
                {statut === 'tous' ? `Toutes (${commandes.length})` : badge.text}
              </button>
            );
          })}
        </div>

        {commandesFiltrees.length === 0 ? (
          <div className="card text-center py-20 animate-scale-in">
            <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-600">Vous n'avez pas encore de commandes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commandesFiltrees.map((commande, idx) => {
              const badge = getStatutBadge(commande.statut);
              const Icon = badge.icon;
              return (
                <div key={commande._id} className="card hover-lift animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl font-black gradient-text">#{commande.numeroCommande}</span>
                        <span className={`badge ${badge.color} border-2 flex items-center space-x-1`}>
                          <Icon className="w-4 h-4" />
                          <span>{badge.text}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="mb-1"><strong>Date:</strong> {new Date(commande.createdAt).toLocaleDateString('fr-MA')}</p>
                          <p><strong>Articles:</strong> {commande.articles.length} produit(s)</p>
                        </div>
                        <div>
                          <p className="mb-1"><strong>Paiement:</strong> {commande.paiement.methode}</p>
                          <p className="text-2xl font-black gradient-text">{commande.montants.total.toFixed(2)} MAD</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button onClick={() => voirDetails(commande._id)} className="btn-primary flex items-center justify-center space-x-2">
                        <Eye className="w-5 h-5" />
                        <span>Détails</span>
                      </button>

                      {user.role === 'fournisseur' && commande.statut === 'en_attente' && (
                        <button onClick={() => changerStatut(commande._id, 'confirmee')} className="btn-outline">
                          Confirmer
                        </button>
                      )}

                      {user.role === 'acheteur' && ['en_attente', 'confirmee'].includes(commande.statut) && (
                        <button onClick={() => annulerCommande(commande._id)} className="text-red-600 hover:text-red-700 text-sm font-bold">
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

        {showModal && commandeSelectionnee && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-premium">
              <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-purple-600 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-3xl font-black text-white">Commande #{commandeSelectionnee.numeroCommande}</h2>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-all">
                  <XCircle className="w-8 h-8" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  {(() => {
                    const badge = getStatutBadge(commandeSelectionnee.statut);
                    const Icon = badge.icon;
                    return (
                      <div className="flex items-center space-x-3">
                        <Icon className="w-8 h-8 text-primary-600" />
                        <span className="text-2xl font-bold">{badge.text}</span>
                      </div>
                    );
                  })()}
                  <span className="text-gray-600">{new Date(commandeSelectionnee.createdAt).toLocaleString('fr-MA')}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
                    Articles commandés
                  </h3>
                  <div className="space-y-3">
                    {commandeSelectionnee.articles.map((article, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                        <div className="flex items-center space-x-4">
                          <img src={article.produit?.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={article.nom} className="w-20 h-20 object-cover rounded-xl" />
                          <div>
                            <p className="font-bold text-gray-900">{article.nom}</p>
                            <p className="text-sm text-gray-600">Quantité: {article.quantite}</p>
                          </div>
                        </div>
                        <p className="text-xl font-black gradient-text">{article.sousTotal.toFixed(2)} MAD</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-glass p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Adresse de livraison
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {commandeSelectionnee.adresseLivraison.nom}<br />
                    {commandeSelectionnee.adresseLivraison.rue}<br />
                    {commandeSelectionnee.adresseLivraison.ville}, {commandeSelectionnee.adresseLivraison.codePostal}
                  </p>
                  <div className="mt-3 flex items-center space-x-2 text-gray-700">
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold">{commandeSelectionnee.adresseLivraison.telephone}</span>
                  </div>
                </div>

                <div className="border-t-2 pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700 text-lg">
                      <span>Sous-total</span>
                      <span className="font-bold">{commandeSelectionnee.montants.sousTotal.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-lg">
                      <span>Frais de livraison</span>
                      <span className="font-bold">{commandeSelectionnee.montants.fraisLivraison.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between font-black text-2xl border-t-2 pt-4">
                      <span>Total</span>
                      <span className="gradient-text text-3xl">{commandeSelectionnee.montants.total.toFixed(2)} MAD</span>
                    </div>
                  </div>
                </div>

                {user.role === 'fournisseur' && (
                  <div className="flex space-x-3">
                    {commandeSelectionnee.statut === 'confirmee' && (
                      <button onClick={() => changerStatut(commandeSelectionnee._id, 'en_preparation')} className="flex-1 btn-primary">
                        Marquer en préparation
                      </button>
                    )}
                    {commandeSelectionnee.statut === 'en_preparation' && (
                      <button onClick={() => changerStatut(commandeSelectionnee._id, 'expediee')} className="flex-1 btn-primary">
                        Marquer comme expédiée
                      </button>
                    )}
                    {commandeSelectionnee.statut === 'expediee' && (
                      <button onClick={() => changerStatut(commandeSelectionnee._id, 'livree')} className="flex-1 btn-primary">
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
    </div>
  );
};

export default Orders;