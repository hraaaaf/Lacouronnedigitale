import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { produitsAPI } from '../utils/api';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Package, 
  AlertTriangle, 
  Filter,
  MoreVertical,
  ExternalLink
} from 'lucide-react';

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    chargerMesProduits();
  }, []);

  const chargerMesProduits = async () => {
    try {
      const res = await produitsAPI.getMesProduits();
      setProduits(res.data.produits);
    } catch (err) {
      console.error("Erreur chargement produits", err);
    } finally {
      setLoading(false);
    }
  };

  const supprimerProduit = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
      try {
        await produitsAPI.delete(id);
        setProduits(produits.filter(p => p._id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const filtrés = produits.filter(p => 
    p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    p.marque?.toLowerCase().includes(recherche.toLowerCase())
  );

  const getStockBadge = (stock) => {
    const qte = stock?.quantite || 0;
    if (qte === 0) return <span className="badge-danger">Rupture</span>;
    if (qte <= 5) return <span className="badge-warning">Stock Bas ({qte})</span>;
    return <span className="badge-success">En stock ({qte})</span>;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Mon <span className="text-primary-600">Inventaire</span></h1>
            <p className="text-slate-500 mt-1">Gérez vos références et vos niveaux de stock en temps réel.</p>
          </div>
          <Link to="/ajouter-produit" className="btn-primary flex items-center justify-center gap-2 px-6 py-3 shadow-glow-purple">
            <Plus className="w-5 h-5" />
            Nouveau Produit
          </Link>
        </div>

        {/* Barre de recherche et Filtres */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, marque..." 
              className="input-field pl-12 bg-slate-50 border-none"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
          <button className="btn-secondary flex items-center gap-2 px-5">
            <Filter className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {/* Liste des produits */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loading-spinner w-10 h-10 border-primary-600 border-t-transparent mb-4"></div>
            <p className="text-slate-500 font-medium">Chargement de vos produits...</p>
          </div>
        ) : filtrés.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-premium border border-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-sm font-black text-slate-600 uppercase tracking-wider">Produit</th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600 uppercase tracking-wider">Prix</th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtrés.map((produit) => (
                    <tr key={produit._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                            <img 
                              src={produit.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                              alt={produit.nom}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{produit.nom}</div>
                            <div className="text-xs text-slate-500">{produit.marque || 'Sans marque'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{produit.categorie}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-900">{produit.prix} MAD</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{produit.stock?.quantite || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStockBadge(produit.stock)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/produits/${produit._id}`}
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Voir la fiche"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          <button 
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => supprimerProduit(produit._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-dashed border-slate-300">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Aucun produit trouvé</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Commencez par ajouter votre premier produit pour le rendre visible auprès des acheteurs.</p>
            <Link to="/ajouter-produit" className="btn-primary inline-flex items-center gap-2 px-8">
              <Plus className="w-5 h-5" />
              Ajouter un produit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;