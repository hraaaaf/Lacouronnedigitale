import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { produitsAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { Filter, X, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtres, setFiltres] = useState({
    categorie: searchParams.get('categorie') || '',
    prixMin: searchParams.get('prixMin') || '',
    prixMax: searchParams.get('prixMax') || '',
    recherche: searchParams.get('q') || '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    { nom: 'Instruments', icon: '🔧', gradient: 'from-blue-500 to-cyan-500' },
    { nom: 'Consommables', icon: '💉', gradient: 'from-purple-500 to-pink-500' },
    { nom: 'Équipements lourds', icon: '🪑', gradient: 'from-orange-500 to-red-500' },
    { nom: 'Hygiène & Stérilisation', icon: '🧪', gradient: 'from-green-500 to-teal-500' },
    { nom: 'Radiologie', icon: '📡', gradient: 'from-indigo-500 to-blue-500' },
    { nom: 'Prothèse', icon: '🦷', gradient: 'from-pink-500 to-rose-500' },
    { nom: 'Implantologie', icon: '⚙️', gradient: 'from-gray-500 to-slate-500' },
    { nom: 'Orthodontie', icon: '🔗', gradient: 'from-yellow-500 to-amber-500' },
  ];

  const prixRanges = [
    { label: 'Moins de 100 MAD', min: 0, max: 100 },
    { label: '100 - 500 MAD', min: 100, max: 500 },
    { label: '500 - 1000 MAD', min: 500, max: 1000 },
    { label: '1000 - 5000 MAD', min: 1000, max: 5000 },
    { label: 'Plus de 5000 MAD', min: 5000, max: null },
  ];

  useEffect(() => {
    chargerProduits();
  }, [filtres]);

  const chargerProduits = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtres.categorie) params.categorie = filtres.categorie;
      if (filtres.prixMin) params.prixMin = filtres.prixMin;
      if (filtres.prixMax) params.prixMax = filtres.prixMax;
      if (filtres.recherche) params.recherche = filtres.recherche;

      const response = await produitsAPI.getAll(params);
      setProduits(response.data.produits);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
    setLoading(false);
  };

  const handleSearch = (recherche) => {
    setFiltres({ ...filtres, recherche });
    setSearchParams({ ...filtres, q: recherche });
  };

  const handleFilterChange = (key, value) => {
    const newFiltres = { ...filtres, [key]: value };
    setFiltres(newFiltres);
    setSearchParams(newFiltres);
  };

  const handlePriceRangeClick = (min, max) => {
    const newFiltres = { ...filtres, prixMin: min || '', prixMax: max || '' };
    setFiltres(newFiltres);
    setSearchParams(newFiltres);
  };

  const reinitialiserFiltres = () => {
    setFiltres({ categorie: '', prixMin: '', prixMax: '', recherche: '' });
    setSearchParams({});
  };

  const filtresActifs = Object.values(filtres).filter(f => f !== '').length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-dots opacity-20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="heading-1 text-white mb-4 text-shadow-premium">
              Catalogue Premium
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Découvrez notre sélection de {produits.length}+ produits dentaires certifiés
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres rapides - Catégories */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              Catégories populaires
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterChange('categorie', filtres.categorie === cat.nom ? '' : cat.nom)}
                className={`group relative p-4 rounded-2xl transition-all duration-300 ${
                  filtres.categorie === cat.nom
                    ? 'bg-white shadow-glow scale-105'
                    : 'bg-white/80 hover:bg-white hover:shadow-lg'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <p className={`text-xs font-bold transition-all ${
                  filtres.categorie === cat.nom ? 'gradient-text' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {cat.nom}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline px-6 py-3 flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filtres avancés</span>
              {filtresActifs > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {filtresActifs}
                </span>
              )}
            </button>

            {filtresActifs > 0 && (
              <button
                onClick={reinitialiserFiltres}
                className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 font-medium">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:border-primary-500 focus:outline-none transition-all"
            >
              <option value="recent">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="popular">Populaires</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="card mb-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-primary-600" />
                Filtres avancés
              </h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Prix ranges */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-4">Gamme de prix</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {prixRanges.map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePriceRangeClick(range.min, range.max)}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      filtres.prixMin == range.min && (filtres.prixMax == range.max || (!range.max && !filtres.prixMax))
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-glow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prix personnalisé */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Prix personnalisé (MAD)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min</label>
                  <input
                    type="number"
                    value={filtres.prixMin}
                    onChange={(e) => handleFilterChange('prixMin', e.target.value)}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max</label>
                  <input
                    type="number"
                    value={filtres.prixMax}
                    onChange={(e) => handleFilterChange('prixMax', e.target.value)}
                    className="input-field"
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Résultats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-700 font-semibold flex items-center">
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="loading-spinner w-5 h-5"></div>
                <span>Chargement...</span>
              </span>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                <span className="gradient-text">{produits.length}</span>
                <span className="ml-1">produit(s) trouvé(s)</span>
              </>
            )}
          </p>
          {filtres.recherche && (
            <p className="text-sm text-gray-500">
              Résultats pour "<span className="font-bold text-primary-600">{filtres.recherche}</span>"
            </p>
          )}
        </div>

        {/* Grille de produits */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="skeleton h-96 rounded-3xl"></div>
            ))}
          </div>
        ) : produits.length === 0 ? (
          <div className="card text-center py-20">
            <div className="text-8xl mb-6">😔</div>
            <h3 className="heading-3 text-gray-900 mb-4">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Essayez d'ajuster vos filtres ou votre recherche pour trouver ce que vous cherchez
            </p>
            <button onClick={reinitialiserFiltres} className="btn-primary">
              <Sparkles className="w-5 h-5 inline mr-2" />
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produits.map((produit, idx) => (
              <div key={produit._id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                <ProductCard produit={produit} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;