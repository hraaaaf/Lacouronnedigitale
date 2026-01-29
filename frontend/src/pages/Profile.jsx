import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { usersAPI } from '../utils/api';
import { User, Mail, Phone, Building, MapPin, Lock, AlertCircle, CheckCircle, Trash2, Sparkles, Award } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ongletActif, setOngletActif] = useState('infos');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    entreprise: {
      nom: '',
      adresse: {
        ville: ''
      }
    }
  });
  const [motDePasse, setMotDePasse] = useState({
    ancien: '',
    nouveau: '',
    confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    chargerProfil();
  }, [user, navigate]);

  const chargerProfil = async () => {
    try {
      const response = await usersAPI.getProfil();
      const userData = response.data.utilisateur;
      setFormData({
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        telephone: userData.telephone || '',
        entreprise: userData.entreprise || { nom: '', adresse: { ville: '' } }
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSubmitInfos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await usersAPI.updateProfil(formData);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour' });
    }

    setLoading(false);
  };

  const handleSubmitMotDePasse = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (motDePasse.nouveau !== motDePasse.confirmation) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (motDePasse.nouveau.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    setLoading(true);

    try {
      await usersAPI.updateMotDePasse({
        ancienMotDePasse: motDePasse.ancien,
        nouveauMotDePasse: motDePasse.nouveau
      });
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
      setMotDePasse({ ancien: '', nouveau: '', confirmation: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la modification' });
    }

    setLoading(false);
  };

  const supprimerCompte = async () => {
    if (!confirm('⚠️ ATTENTION : Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?')) {
      return;
    }

    if (!confirm('Êtes-vous absolument sûr ? Toutes vos données seront perdues.')) {
      return;
    }

    try {
      await usersAPI.deleteCompte();
      logout();
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const onglets = [
    { id: 'infos', nom: 'Informations', icon: User },
    { id: 'securite', nom: 'Sécurité', icon: Lock }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="heading-2 gradient-text mb-8 flex items-center">
          <Sparkles className="w-10 h-10 mr-4 text-yellow-500" />
          Mon Profil
        </h1>

        {/* Onglets Premium */}
        <div className="flex space-x-2 mb-8 p-2 bg-gray-100 rounded-3xl">
          {onglets.map((onglet) => {
            const Icon = onglet.icon;
            return (
              <button
                key={onglet.id}
                onClick={() => {
                  setOngletActif(onglet.id);
                  setMessage({ type: '', text: '' });
                }}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  ongletActif === onglet.id
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-glow scale-105'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{onglet.nom}</span>
              </button>
            );
          })}
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-6 p-6 rounded-2xl flex items-start space-x-4 animate-scale-in ${
            message.type === 'success' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-7 h-7 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-7 h-7 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <p className={`font-semibold ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Contenu */}
        <div className="card">
          {ongletActif === 'infos' && (
            <form onSubmit={handleSubmitInfos} className="space-y-6">
              <div className="flex items-center justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-glow group-hover:scale-110 transition-transform">
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    <User className="w-4 h-4 inline mr-2" />
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              {user?.role === 'fournisseur' && (
                <div className="border-t-2 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Building className="w-6 h-6 mr-2 text-primary-600" />
                    Informations Entreprise
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Nom de l'entreprise</label>
                      <input
                        type="text"
                        value={formData.entreprise?.nom || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          entreprise: { ...formData.entreprise, nom: e.target.value }
                        })}
                        className="input-field"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Ville
                      </label>
                      <input
                        type="text"
                        value={formData.entreprise?.adresse?.ville || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          entreprise: {
                            ...formData.entreprise,
                            adresse: { ...formData.entreprise.adresse, ville: e.target.value }
                          }
                        })}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-lg disabled:opacity-50 group"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                <CheckCircle className="w-5 h-5 inline ml-2 group-hover:scale-110 transition-transform" />
              </button>
            </form>
          )}

          {ongletActif === 'securite' && (
            <div className="space-y-8">
              <form onSubmit={handleSubmitMotDePasse} className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lock className="w-6 h-6 mr-2 text-primary-600" />
                  Changer le mot de passe
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Ancien mot de passe</label>
                  <input
                    type="password"
                    value={motDePasse.ancien}
                    onChange={(e) => setMotDePasse({ ...motDePasse, ancien: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={motDePasse.nouveau}
                    onChange={(e) => setMotDePasse({ ...motDePasse, nouveau: e.target.value })}
                    className="input-field"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500">Minimum 6 caractères</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    value={motDePasse.confirmation}
                    onChange={(e) => setMotDePasse({ ...motDePasse, confirmation: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg disabled:opacity-50"
                >
                  {loading ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
              </form>

              <div className="border-t-2 pt-8">
                <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
                  <Trash2 className="w-6 h-6 mr-2" />
                  Zone dangereuse
                </h3>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8">
                  <p className="text-sm text-red-700 mb-6 font-semibold">
                    ⚠️ La suppression de votre compte est irréversible. Toutes vos données seront définitivement perdues.
                  </p>
                  <button
                    onClick={supprimerCompte}
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-red-700 hover:to-pink-700 transition-all shadow-glow hover:scale-105 flex items-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Supprimer mon compte</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;