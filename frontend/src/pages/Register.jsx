import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Building, AlertCircle, CheckCircle, Sparkles, Award } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmMotDePasse: '',
    role: 'acheteur',
    entreprise: {
      nom: '',
      registreCommerce: '',
      ice: '',
      adresse: {
        rue: '',
        ville: '',
        codePostal: ''
      }
    }
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('entreprise.')) {
      const field = name.split('.')[1];
      if (field === 'rue' || field === 'ville' || field === 'codePostal') {
        setFormData({
          ...formData,
          entreprise: {
            ...formData.entreprise,
            adresse: {
              ...formData.entreprise.adresse,
              [field]: value
            }
          }
        });
      } else {
        setFormData({
          ...formData,
          entreprise: {
            ...formData.entreprise,
            [field]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.motDePasse !== formData.confirmMotDePasse) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.motDePasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const telRegex = /^(06|07|05)\d{8}$/;
    if (!telRegex.test(formData.telephone)) {
      setError('Numéro de téléphone invalide (ex: 0612345678)');
      return;
    }

    setLoading(true);

    const userData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      motDePasse: formData.motDePasse,
      role: formData.role
    };

    if (formData.role === 'fournisseur') {
      userData.entreprise = formData.entreprise;
    }

    const result = await register(userData);

    if (result.success) {
      if (result.data.utilisateur.role === 'fournisseur') {
        navigate('/dashboard');
      } else {
        navigate('/produits');
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-500 to-purple-600">
        <div className="absolute inset-0 bg-dots opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex justify-center mb-6 group">
            <div className="bg-white p-4 rounded-3xl shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-5xl">🦷</span>
            </div>
          </Link>
          <h2 className="heading-2 text-white text-shadow-premium mb-3">
            Rejoignez DentalMarket
          </h2>
          <p className="text-xl text-white/80">
            Commencez votre transformation digitale aujourd'hui
          </p>
        </div>

        <div className="card-glass p-8 md:p-10 backdrop-blur-premium animate-scale-in">
          {error && (
            <div className="mb-6 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-100 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Choix du rôle */}
            <div>
              <label className="block text-sm font-bold text-white mb-4">
                Je souhaite m'inscrire en tant que :
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'acheteur' })}
                  className={`group relative p-6 rounded-2xl transition-all duration-300 ${
                    formData.role === 'acheteur'
                      ? 'bg-white shadow-glow scale-105'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">🏥</div>
                    <div className={`text-xl font-bold mb-2 ${formData.role === 'acheteur' ? 'gradient-text' : 'text-white'}`}>
                      Acheteur
                    </div>
                    <div className={`text-sm ${formData.role === 'acheteur' ? 'text-gray-600' : 'text-white/70'}`}>
                      Dentiste / Clinique
                    </div>
                  </div>
                  {formData.role === 'acheteur' && (
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'fournisseur' })}
                  className={`group relative p-6 rounded-2xl transition-all duration-300 ${
                    formData.role === 'fournisseur'
                      ? 'bg-white shadow-glow scale-105'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">📦</div>
                    <div className={`text-xl font-bold mb-2 ${formData.role === 'fournisseur' ? 'gradient-text' : 'text-white'}`}>
                      Fournisseur
                    </div>
                    <div className={`text-sm ${formData.role === 'fournisseur' ? 'text-gray-600' : 'text-white/70'}`}>
                      Grossiste / Fabricant
                    </div>
                  </div>
                  {formData.role === 'fournisseur' && (
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations Personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-white">Nom *</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="input-field text-gray-900"
                    placeholder="Alami"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-white">Prénom *</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    className="input-field text-gray-900"
                    placeholder="Hassan"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-white">Email *</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field pl-12 text-gray-900"
                    placeholder="hassan@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-white">Téléphone *</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    className="input-field pl-12 text-gray-900"
                    placeholder="0612345678"
                  />
                </div>
                <p className="text-xs text-white/60">Format: 06XXXXXXXX ou 07XXXXXXXX</p>
              </div>
            </div>

            {/* Informations entreprise */}
            {formData.role === 'fournisseur' && (
              <div className="space-y-6 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Informations Entreprise
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-white">Nom de l'entreprise *</label>
                  <input
                    type="text"
                    name="entreprise.nom"
                    value={formData.entreprise.nom}
                    onChange={handleChange}
                    required={formData.role === 'fournisseur'}
                    className="input-field text-gray-900"
                    placeholder="Dental Supply Maroc"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white">Registre de Commerce</label>
                    <input
                      type="text"
                      name="entreprise.registreCommerce"
                      value={formData.entreprise.registreCommerce}
                      onChange={handleChange}
                      className="input-field text-gray-900"
                      placeholder="RC123456"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-white">ICE</label>
                    <input
                      type="text"
                      name="entreprise.ice"
                      value={formData.entreprise.ice}
                      onChange={handleChange}
                      className="input-field text-gray-900"
                      placeholder="001234567890123"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-white">Ville</label>
                  <input
                    type="text"
                    name="entreprise.ville"
                    value={formData.entreprise.adresse.ville}
                    onChange={handleChange}
                    className="input-field text-gray-900"
                    placeholder="Casablanca"
                  />
                </div>

                {/* Badge essai gratuit */}
                <div className="bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <Award className="w-6 h-6 text-green-300 flex-shrink-0 mt-1 animate-pulse" />
                    <div>
                      <p className="text-sm font-bold text-green-100 mb-1">
                        🎉 30 jours d'essai gratuit !
                      </p>
                      <p className="text-xs text-green-200">
                        Profitez de toutes les fonctionnalités premium sans engagement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mots de passe */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Sécurité
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-white">Mot de passe *</label>
                  <input
                    type="password"
                    name="motDePasse"
                    value={formData.motDePasse}
                    onChange={handleChange}
                    required
                    className="input-field text-gray-900"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-white">Confirmer *</label>
                  <input
                    type="password"
                    name="confirmMotDePasse"
                    value={formData.confirmMotDePasse}
                    onChange={handleChange}
                    required
                    className="input-field text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Sparkles className="w-6 h-6 inline mr-2" />
              <span>{loading ? 'Création en cours...' : 'Créer mon compte'}</span>
            </button>
          </form>

          {/* Lien connexion */}
          <div className="mt-8 text-center">
            <p className="text-white/80">
              Vous avez déjà un compte ?{' '}
              <Link to="/connexion" className="text-yellow-300 font-bold hover:text-yellow-200 transition-colors">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;