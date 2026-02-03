// utils/imageHelper.js

const API_BASE = import.meta.env.VITE_API_URL || 'https://lacouronnedigitale-production.up.railway.app/api';

// On extrait juste l'origine du backend (sans "/api" à la fin)
// Ex: https://lacouronnedigitale-production.up.railway.app
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

const PLACEHOLDER = 'https://placehold.co/400x400?text=Produit&font=inter';

/**
 * Retourne une URL d'image exploitable depuis ce que le backend envoie.
 * 
 * Gère ces cas :
 *  - URL absolue valide (http/https)  → retournée telle quelle
 *  - URL relative ("/uploads/img.jpg") → préfixée par l'origine du backend
 *  - undefined / null / chaîne vide   → retourne le placeholder
 * 
 * @param {string|undefined|null} url
 * @returns {string}
 */
export function getImageUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return PLACEHOLDER;
  }

  // Déjà une URL absolue → on la garde telle quelle
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // URL relative → on préfixe par l'origine du backend
  // Ex: "/uploads/abc.jpg" → "https://lacouronnedigitale-production.up.railway.app/uploads/abc.jpg"
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${BACKEND_ORIGIN}${path}`;
}

/**
 * Retourne l'URL de la première image d'un produit.
 * Accepte le format { images: [{ url: "..." }, ...] } que renvoie ton backend.
 * 
 * @param {object} produit
 * @param {number} [index=0] — index de l'image souhaitée
 * @returns {string}
 */
export function getProductImage(produit, index = 0) {
  const url = produit?.images?.[index]?.url;
  return getImageUrl(url);
}
