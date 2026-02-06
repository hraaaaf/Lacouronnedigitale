import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  User, 
  LogOut, 
  LayoutDashboard,
  Stethoscope 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => {
    return location.pathname === path ? "text-primary-600 font-semibold bg-primary-50" : "text-slate-600 hover:text-primary-600 hover:bg-slate-50";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Stethoscope size={24} />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                La Couronne <span className="text-primary-600">Digitale</span>
              </span>
            </Link>
          </div>

          {/* MENU BUREAU (Desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-4 py-2 rounded-lg text-sm transition-all ${isActive('/')}`}>
              Accueil
            </Link>
            <Link to="/produits" className={`px-4 py-2 rounded-lg text-sm transition-all ${isActive('/produits')}`}>
              Catalogue
            </Link>
            <Link to="/a-propos" className={`px-4 py-2 rounded-lg text-sm transition-all ${isActive('/a-propos')}`}>
              À propos
            </Link>
          </div>

          {/* ACTIONS DROITE */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Panier (Toujours visible) */}
            <Link to="/panier" className="relative p-2 text-slate-500 hover:text-primary-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {/* Badge optionnel si tu as le count du panier */}
              {/* <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span> */}
            </Link>

            {user ? (
              // MENU CONNECTÉ
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <Link 
                  to={user.role === 'fournisseur' ? '/mes-produits' : '/dashboard'} 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {user.role === 'fournisseur' ? 'Espace Pro' : 'Mon Compte'}
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // MENU VISITEUR
              <div className="flex items-center gap-3">
                <Link to="/connexion" className="text-sm font-medium text-slate-600 hover:text-primary-600 px-3 py-2">
                  Se connecter
                </Link>
                <Link to="/inscription" className="btn-primary text-sm px-5 py-2">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* BOUTON MOBILE */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-primary-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE (Responsive) */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Accueil</Link>
            <Link to="/produits" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Catalogue</Link>
            <Link to="/a-propos" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">À propos</Link>
            
            <div className="border-t border-slate-100 my-2 pt-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">
                    <User className="w-4 h-4" /> Mon Espace
                  </Link>
                  <button onClick={logout} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/connexion" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Se connecter</Link>
                  <Link to="/inscription" className="block px-3 py-2 mt-2 text-center rounded-lg text-base font-medium bg-primary-600 text-white">S'inscrire</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;