import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { usersAPI } from '../utils/api';
import { User, Mail, Phone, Building, MapPin, Lock, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

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
      console.error('Erreur chargement profil:', error);
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
    { id: 'infos', nom: 'Informations', icon: <User className="w-5 h-5" /> },
    { id: 'securite', nom: 'Sécurité', icon: <Lock className="w-5 h-5" /> }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

      {/* Onglets */}
      <div className="flex space-x-1 mb-6 border-b">
        {onglets.map((onglet) => (
          <button
            key={onglet.id}
            onClick={() => {
              setOngletActif(onglet.id);
              setMessage({ type: '', text: '' });
            }}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition ${
              ongletActif === onglet.id
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {onglet.icon}
            <span>{onglet.nom}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Contenu onglets */}
      <div className="card">
        {ongletActif === 'infos' && (
          <form onSubmit={handleSubmitInfos} className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-br from-primary-600 to-blue-600 text-white w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Informations Entreprise
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'entreprise
                      </label>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        )}

        {ongletActif === 'securite' && (
          <div className="space-y-8">
            {/* Changer mot de passe */}
            <form onSubmit={handleSubmitMotDePasse} className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancien mot de passe
                </label>
                <input
                  type="password"
                  value={motDePasse.ancien}
                  onChange={(e) => setMotDePasse({ ...motDePasse, ancien: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={motDePasse.nouveau}
                  onChange={(e) => setMotDePasse({ ...motDePasse, nouveau: e.target.value })}
                  className="input-field"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
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
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
            </form>

            {/* Supprimer le compte */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                <Trash2 className="w-5 h-5 mr-2" />
                Zone dangereuse
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-sm text-red-700 mb-4">
                  La suppression de votre compte est irréversible. Toutes vos données seront définitivement perdues.
                </p>
                <button
                  onClick={supprimerCompte}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;