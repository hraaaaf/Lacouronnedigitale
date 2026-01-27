import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.motDePasse);

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-500 to-purple-600">
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center mb-6 group">
            <div className="bg-white p-4 rounded-3xl shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-5xl">🦷</span>
            </div>
          </Link>
          <h2 className="heading-2 text-white text-shadow-premium mb-3">
            Bon retour !
          </h2>
          <p className="text-xl text-white/80">
            Connectez-vous à votre compte DentalMarket
          </p>
        </div>

        {/* Formulaire */}
        <div className="card-glass p-8 backdrop-blur-premium">
          {error && (
            <div className="mb-6 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 flex items-start space-x-3 animate-scale-in">
              <AlertCircle className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-100 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                Adresse Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field pl-12 text-gray-900"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  required
                  className="input-field pl-12 text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Mot de passe oublié */}
            <div className="flex items-center justify-end">
              <Link
                to="/mot-de-passe-oublie"
                className="text-sm text-white hover:text-yellow-300 font-semibold transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
              <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Séparateur */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/60 font-medium">
                Nouveau sur DentalMarket ?
              </span>
            </div>
          </div>

          {/* Lien inscription */}
          <Link
            to="/inscription"
            className="block text-center btn-outline text-white hover:text-white"
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Créer un compte gratuitement
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-white/60">
          En vous connectant, vous acceptez nos{' '}
          <Link to="/cgv" className="text-white hover:text-yellow-300 font-semibold">
            Conditions Générales
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;