import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await authAPI.getProfil();
          setUser(response.data.utilisateur);
        } catch (error) {
          console.error('Erreur chargement utilisateur:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Connexion
  const login = async (email, motDePasse) => {
    try {
      const response = await authAPI.connexion({ email, motDePasse });
      const { token, utilisateur } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(utilisateur);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      const response = await authAPI.inscription(userData);
      const { token, utilisateur } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(utilisateur);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur d\'inscription'
      };
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Vérifier si l'utilisateur est fournisseur
  const isFournisseur = () => user?.role === 'fournisseur';

  // Vérifier si l'utilisateur est acheteur
  const isAcheteur = () => user?.role === 'acheteur';

  // Vérifier si l'essai gratuit est expiré
  const essaiExpire = () => {
    if (!user || user.role !== 'fournisseur') return false;
    if (user.abonnement?.type !== 'essai_gratuit') return false;

    const dateFin = new Date(user.abonnement.dateFin);
    return new Date() > dateFin;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isFournisseur,
    isAcheteur,
    essaiExpire,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};