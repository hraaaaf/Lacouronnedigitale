import axios from 'axios';

// URL de base de l'API
const API_URL = 'http://localhost:5000/api';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const authAPI = {
  inscription: (data) => api.post('/auth/inscription', data),
  connexion: (data) => api.post('/auth/connexion', data),
  getProfil: () => api.get('/auth/profil'),
};

// ============ PRODUITS ============
export const produitsAPI = {
  getAll: (params) => api.get('/produits', { params }),
  getById: (id) => api.get(`/produits/${id}`),
  create: (data) => api.post('/produits', data),
  update: (id, data) => api.put(`/produits/${id}`, data),
  delete: (id) => api.delete(`/produits/${id}`),
  getMesProduits: () => api.get('/produits/fournisseur/mes-produits'),
};

// ============ COMMANDES ============
export const commandesAPI = {
  create: (data) => api.post('/commandes', data),
  getAll: () => api.get('/commandes'),
  getById: (id) => api.get(`/commandes/${id}`),
  updateStatut: (id, data) => api.put(`/commandes/${id}/statut`, data),
  evaluer: (id, data) => api.post(`/commandes/${id}/evaluation`, data),
  annuler: (id) => api.delete(`/commandes/${id}`),
};

// ============ MESSAGES ============
export const messagesAPI = {
  send: (data) => api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  getNonLus: () => api.get('/messages/non-lus'),
  marquerLu: (id) => api.put(`/messages/${id}/lire`),
  delete: (id) => api.delete(`/messages/${id}`),
};

// ============ USERS ============
export const usersAPI = {
  getProfil: () => api.get('/users/profil'),
  updateProfil: (data) => api.put('/users/profil', data),
  updateMotDePasse: (data) => api.put('/users/mot-de-passe', data),
  getDashboard: () => api.get('/users/dashboard'),
  activerAbonnement: (data) => api.post('/users/abonnement/activer', data),
  getFournisseur: (id) => api.get(`/users/fournisseur/${id}`),
  deleteCompte: () => api.delete('/users/compte'),
};

// ============ UPLOAD ============
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadImages: (formData) => api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;