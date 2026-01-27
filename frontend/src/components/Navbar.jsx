import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, MessageCircle, Menu, X, Bell, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-premium shadow-premium' 
        : 'bg-white/95 backdrop-blur-xl shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Premium */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-primary-600 to-purple-600 p-3 rounded-2xl shadow-glow group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl">🦷</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-black gradient-text">
                DentalMarket
              </span>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-500 rounded-full"></div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/produits" isActive={isActive('/produits')}>
              Catalogue
            </NavLink>
            {user?.role === 'fournisseur' && (
              <NavLink to="/mes-produits" isActive={isActive('/mes-produits')}>
                Mes Produits
              </NavLink>
            )}
            <NavLink to="/a-propos" isActive={isActive('/a-propos')}>
              À propos
            </NavLink>
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 group">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-glow"></span>
                  <span className="absolute inset-0 rounded-xl bg-primary-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </button>

                {/* Messages */}
                <Link
                  to="/messages"
                  className="relative p-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 group"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute inset-0 rounded-xl bg-primary-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                </Link>

                {/* Panier (acheteurs) */}
                {user.role === 'acheteur' && (
                  <Link
                    to="/panier"
                    className="relative p-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 group"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-glow animate-pulse">
                      0
                    </span>
                    <span className="absolute inset-0 rounded-xl bg-primary-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                  </Link>
                )}

                {/* Dashboard (fournisseurs) */}
                {user.role === 'fournisseur' && (
                  <Link
                    to="/dashboard"
                    className="relative p-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 group"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="absolute inset-0 rounded-xl bg-primary-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                  </Link>
                )}

                {/* Menu utilisateur */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full blur group-hover:blur-lg transition-all"></div>
                      <div className="relative w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-glow">
                        {user.prenom?.[0]}{user.nom?.[0]}
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 group-hover:gradient-text transition-all">
                      {user.prenom}
                    </span>
                  </button>

                  {/* Dropdown Premium */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-64 glass-morphism rounded-3xl shadow-premium py-3 z-20 animate-scale-in border border-white/30">
                        <div className="px-4 py-3 border-b border-white/20">
                          <p className="font-bold text-gray-900">{user.prenom} {user.nom}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Link
                          to="/profil"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <User className="w-5 h-5" />
                          <span className="font-medium">Mon Profil</span>
                        </Link>
                        <Link
                          to="/commandes"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span className="font-medium">Mes Commandes</span>
                        </Link>
                        <div className="h-px bg-white/20 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Déconnexion</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/connexion" className="btn-outline px-6 py-2.5 text-sm">
                  Connexion
                </Link>
                <Link to="/inscription" className="btn-primary px-6 py-2.5 text-sm">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-morphism border-t border-white/20 animate-slide-in-up">
          <div className="px-4 py-6 space-y-3 max-w-7xl mx-auto">
            {user && (
              <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-2xl mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-glow">
                  {user.prenom?.[0]}{user.nom?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.prenom} {user.nom}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            )}

            <MobileNavLink to="/produits" isActive={isActive('/produits')}>
              Catalogue
            </MobileNavLink>
            {user?.role === 'fournisseur' && (
              <>
                <MobileNavLink to="/dashboard" isActive={isActive('/dashboard')}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/mes-produits" isActive={isActive('/mes-produits')}>
                  Mes Produits
                </MobileNavLink>
              </>
            )}
            {user?.role === 'acheteur' && (
              <MobileNavLink to="/panier" isActive={isActive('/panier')}>
                Panier
              </MobileNavLink>
            )}
            {user && (
              <>
                <MobileNavLink to="/commandes" isActive={isActive('/commandes')}>
                  Commandes
                </MobileNavLink>
                <MobileNavLink to="/messages" isActive={isActive('/messages')}>
                  Messages
                </MobileNavLink>
                <MobileNavLink to="/profil" isActive={isActive('/profil')}>
                  Profil
                </MobileNavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors font-bold"
                >
                  Déconnexion
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/connexion" className="block btn-outline w-full text-center">
                  Connexion
                </Link>
                <Link to="/inscription" className="block btn-primary w-full text-center">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Alerte essai gratuit */}
      {user?.role === 'fournisseur' && user?.abonnement?.type === 'essai_gratuit' && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 px-4 py-3 animate-slide-in-up">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <p className="text-sm text-white text-center font-bold drop-shadow-lg">
              ⏰ Profitez de votre essai gratuit ! 
              <Link to="/abonnement" className="underline ml-2 hover:text-yellow-100">
                Voir les offres →
              </Link>
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`relative px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
      isActive
        ? 'text-primary-600'
        : 'text-gray-700 hover:text-primary-600'
    }`}
  >
    {children}
    {isActive && (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full"></div>
    )}
  </Link>
);

const MobileNavLink = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`block px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
      isActive
        ? 'bg-white text-primary-600 shadow-lg'
        : 'text-gray-700 hover:bg-white/50'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;