import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { usersAPI, produitsAPI } from '../utils/api';
import { Package, ShoppingBag, DollarSign, TrendingUp, Plus, Clock, Sparkles, Award, Users, Eye } from 'lucide-react';

const Dashboard = () => {
  const { user, essaiExpire } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mesProduits, setMesProduits] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'fournisseur') {
      navigate('/connexion');
      return;
    }
    chargerDashboard();
  }, [user, navigate]);

  const chargerDashboard = async () => {
    try {
      const [dashboardRes, produitsRes] = await Promise.all([
        usersAPI.getDashboard(),
        produitsAPI.getMesProduits()
      ]);
      
      setStats(dashboardRes.data.dashboard);
      setMesProduits(produitsRes.data.produits);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner w-16 h-16"></div>
      </div>
    );
  }

  const cardsStats = [
    {
      titre: 'Produits actifs',
      valeur: stats?.produits?.actifs || 0,
      total: stats?.produits?.total || 0,
      icon: <Package className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      titre: 'En attente',
      valeur: stats?.commandes?.enAttente || 0,
      total: stats?.commandes?.total || 0,
      icon: <Clock className="w-8 h-8" />,
      gradient: 'from-orange-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-yellow-50'
    },
    {
      titre: 'Chiffre d\'affaires',
      valeur: `${(stats?.finances?.chiffreAffaires || 0).toFixed(2)} MAD`,
      icon: <DollarSign className="w-8 h-8" />,
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50'
    },
    {
      titre: 'Livrées',
      valeur: stats?.commandes?.livrees || 0,
      icon: <TrendingUp className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Premium */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="heading-2 gradient-text mb-2">
                Tableau de bord
              </h1>
              <p className="text-xl text-gray-600">
                Bienvenue, <span className="font-bold text-gray-900">{user?.prenom} {user?.nom}</span> 👋
              </p>
            </div>
            <Link to="/ajouter-produit" className="btn-primary group">
              <Plus className="w-5 h-5 inline mr-2 group-hover:rotate-90 transition-transform" />
              Ajouter un produit
            </Link>
          </div>
        </div>

        {/* Alerte essai gratuit */}
        {stats?.abonnement?.type === 'essai_gratuit' && (
          <div className="mb-8 card-gradient animate-scale-in overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-start space-x-4">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-glow">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🎉 Essai gratuit - {stats.abonnement.joursRestantsEssai} jour(s) restant(s)
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Profitez de toutes les fonctionnalités premium. Passez à un abonnement payant pour continuer sans interruption.
                  </p>
                  <Link to="/abonnement" className="btn-primary inline-flex items-center group">
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Voir les offres d'abonnement
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cards Stats Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardsStats.map((card, index) => (
            <div
              key={index}
              className="card hover-lift relative overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 bg-gradient-to-br ${card.gradient} rounded-2xl text-white shadow-glow group-hover:scale-110 transition-transform duration-500`}>
                    {card.icon}
                  </div>
                </div>
                
                <h3 className="text-gray-600 text-sm font-bold mb-2 uppercase tracking-wide">
                  {card.titre}
                </h3>
                
                <p className="text-4xl font-black text-gray-900 mb-1">
                  {card.valeur}
                </p>
                
                {card.total && (
                  <p className="text-sm text-gray-500">
                    sur <span className="font-semibold">{card.total}</span> total
                  </p>
                )}

                <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-700 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produits populaires */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-primary-600" />
                  Produits les plus vendus
                </h2>
                <Link to="/mes-produits" className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center group">
                  Voir tout
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              {stats?.produitsPopulaires?.length > 0 ? (
                <div className="space-y-3">
                  {stats.produitsPopulaires.map((produit, index) => (
                    <div
                      key={index}
                      className="group p-4 bg-gradient-to-r from-gray-50 to-white hover:from-primary-50 hover:to-purple-50 rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${
                            index === 0 ? 'from-yellow-400 to-orange-500' :
                            index === 1 ? 'from-gray-300 to-gray-400' :
                            index === 2 ? 'from-orange-400 to-yellow-600' :
                            'from-primary-400 to-purple-500'
                          } rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:gradient-text transition-all">
                              {produit.nom}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center space-x-2">
                              <ShoppingBag className="w-4 h-4" />
                              <span className="font-semibold">{produit.ventes} vente(s)</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black gradient-text">
                            {produit.chiffreAffaires?.toFixed(2)} MAD
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune vente pour le moment</h3>
                  <p className="text-gray-600 mb-6">Commencez par ajouter des produits à votre catalogue</p>
                  <Link to="/ajouter-produit" className="btn-primary inline-flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter un produit
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                Actions rapides
              </h3>
              <div className="space-y-3">
                <Link to="/ajouter-produit" className="w-full btn-primary group">
                  <Plus className="w-5 h-5 inline mr-2 group-hover:rotate-90 transition-transform" />
                  Ajouter un produit
                </Link>
                <Link to="/mes-produits" className="w-full btn-outline">
                  <Package className="w-5 h-5 inline mr-2" />
                  Gérer mes produits
                </Link>
                <Link to="/commandes" className="w-full btn-outline">
                  <ShoppingBag className="w-5 h-5 inline mr-2" />
                  Voir mes commandes
                </Link>
              </div>
            </div>

            {/* Abonnement */}
            <div className="card-gradient relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Mon abonnement
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Type:</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 rounded-full text-sm font-bold">
                      {stats?.abonnement?.type === 'essai_gratuit' ? 'Essai gratuit' : stats?.abonnement?.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Statut:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      stats?.abonnement?.actif 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {stats?.abonnement?.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  {stats?.abonnement?.joursRestantsEssai !== null && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Jours restants:</span>
                      <span className="text-2xl font-black gradient-text">
                        {stats.abonnement.joursRestantsEssai}
                      </span>
                    </div>
                  )}
                </div>
                <Link 
                  to="/abonnement" 
                  className="mt-4 block text-center text-primary-600 hover:text-primary-700 text-sm font-bold group"
                >
                  Gérer mon abonnement
                  <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Stats supplémentaires */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Stock total</span>
                  <span className="text-lg font-black text-gray-900">{stats?.produits?.stockTotal || 0}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Vues totales</span>
                  <span className="text-lg font-black text-gray-900">
                    {mesProduits.reduce((acc, p) => acc + (p.vues || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Commission</span>
                  <span className="text-lg font-black text-red-600">
                    {stats?.finances?.commission?.toFixed(2) || 0} MAD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mes derniers produits */}
        {mesProduits.length > 0 && (
          <div className="mt-8">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mes derniers produits</h2>
                <Link to="/mes-produits" className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center group">
                  Voir tout ({mesProduits.length})
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mesProduits.slice(0, 4).map((produit, idx) => (
                  <Link
                    key={produit._id}
                    to={`/produits/${produit._id}`}
                    className="group border-2 border-gray-100 rounded-2xl p-4 hover:border-primary-200 hover:shadow-lg transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <img
                      src={produit.images?.[0]?.url || 'https://via.placeholder.com/200'}
                      alt={produit.nom}
                      className="w-full h-32 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform"
                    />
                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:gradient-text transition-all">
                      {produit.nom}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary-600 font-black">{produit.prix} MAD</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        produit.actif 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {produit.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;