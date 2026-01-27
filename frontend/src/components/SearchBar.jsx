import { useState } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [recherche, setRecherche] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = [
    'Instruments dentaires',
    'Gants latex',
    'Seringues',
    'Autoclave',
    'Fauteuil dentaire'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && recherche.trim()) {
      onSearch(recherche);
    }
  };

  const handleClear = () => {
    setRecherche('');
  };

  const handleSuggestionClick = (suggestion) => {
    setRecherche(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-30 group-focus-within:opacity-40 blur-xl transition-all duration-500"></div>

        {/* Input container */}
        <div className="relative">
          <div className={`absolute inset-0 bg-white/90 backdrop-blur-xl rounded-3xl shadow-premium transition-all duration-300 ${
            isFocused ? 'scale-105' : ''
          }`}></div>

          <div className="relative flex items-center">
            {/* Icon search */}
            <div className="absolute left-6 pointer-events-none">
              <Search className={`w-6 h-6 transition-all duration-300 ${
                isFocused ? 'text-primary-600 scale-110' : 'text-gray-400'
              }`} />
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Rechercher un produit, une marque, une catégorie..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full pl-16 pr-32 py-5 bg-transparent text-gray-900 placeholder-gray-500 text-lg font-medium outline-none rounded-3xl"
            />

            {/* Clear button */}
            {recherche && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-28 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300 group/clear"
              >
                <X className="w-5 h-5 group-hover/clear:rotate-90 transition-transform" />
              </button>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="absolute right-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-2xl shadow-glow hover:scale-105 hover:shadow-glow-lg active:scale-95 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-premium rounded-3xl shadow-premium border border-gray-100 overflow-hidden animate-scale-in z-50">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-bold text-gray-900">Recherches populaires</span>
            </div>
            
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 transition-all duration-300 group/item"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Search className="w-4 h-4 text-gray-400 group-hover/item:text-primary-600 transition-colors" />
                      <span className="text-gray-700 group-hover/item:text-primary-600 group-hover/item:font-semibold transition-all">
                        {suggestion}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 group-hover/item:text-primary-500 transition-colors">
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick filters */}
          <div className="border-t border-gray-100 p-4 bg-gray-50/50">
            <p className="text-xs font-bold text-gray-500 mb-3">FILTRES RAPIDES</p>
            <div className="flex flex-wrap gap-2">
              {['Nouveau', 'En promo', 'Top ventes', 'Prix bas'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcut hint */}
      <div className="flex justify-center mt-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-xl rounded-full border border-white/30 text-sm text-gray-600">
          <kbd className="px-2 py-1 bg-white rounded text-xs font-bold shadow-sm">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-white rounded text-xs font-bold shadow-sm">K</kbd>
          <span className="text-gray-500">pour rechercher</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;