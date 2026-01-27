import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Composants
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import MyProducts from './pages/MyProducts'; // AJOUTÉ : Importation de la page inventaire

// Composant de protection des routes
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-mesh">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/produits/:id" element={<ProductDetail />} />

            {/* Routes protégées - Acheteur */}
            <Route
              path="/panier"
              element={
                <ProtectedRoute roleRequired="acheteur">
                  <Cart />
                </ProtectedRoute>
              }
            />

            {/* Routes protégées - Fournisseur */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roleRequired="fournisseur">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* AJOUTÉ : Route vers l'inventaire du fournisseur */}
            <Route
              path="/mes-produits"
              element={
                <ProtectedRoute roleRequired="fournisseur">
                  <MyProducts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ajouter-produit"
              element={
                <ProtectedRoute roleRequired="fournisseur">
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            {/* Routes protégées - Tous utilisateurs authentifiés */}
            <Route
              path="/commandes"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profil"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Page 404
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-9xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page introuvable</h2>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <a href="/" className="btn-primary inline-flex items-center space-x-2">
          <span>Retour à l'accueil</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;