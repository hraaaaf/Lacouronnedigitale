import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { produitsAPI } from '../utils/api';
import { 
  Upload, 
  X, 
  ArrowLeft, 
  Save, 
  Package, 
  DollarSign, 
  Tag, 
  FileText, 
  Layers,
  AlertCircle 
} from 'lucide-react';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // États du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie: '',
    marque: '',
    stock: '',
    conditionnement: ''
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const categories = [
    'Instruments',
    'Consommables',
    'Équipements lourds',
    'Hygiène & Stérilisation',
    'Radiologie',
    'Prothèse',
    'Implantologie',
    'Orthodontie',
    'Endodontie',
    'Parodontologie',
    'Autres'
  ];

  // Gestion des champs textes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion des images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limite à 5 images
    if (images.length + files.length > 5) {
      setError('Vous ne pouvez ajouter que 5 images maximum.');
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Création des URLs de prévisualisation
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setError('');
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    // Libérer la mémoire de l'URL
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      // Ajout des champs textes
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      // Ajout des images
      images.forEach(image => {
        data.append('images', image);
      });

      // Appel API (Note: Assure-toi que ta route backend gère le multipart/form-data)
      await produitsAPI.create(data);
      
      // Succès
      navigate('/mes-produits');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la création du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* En-tête avec bouton retour */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Link 
            to="/mes-produits" 
            className="flex items-center text-slate-500 hover:text-primary-600 transition-colors font-bold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'inventaire
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Nouveau <span className="text-primary-600">Produit</span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center animate-shake">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : Informations principales */}
          <div className="lg:col-span-2 space-y-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="card bg-white/80 backdrop-blur-xl shadow-premium border-white/50">
              <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Informations générales</h2>
              </div>

              <div className="space-y-5">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nom du produit *</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Ex: Turbine dentaire haute vitesse"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description détaillée *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="input-field resize-none"
                    placeholder="Caractéristiques techniques, usage, avantages..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie *</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleChange}
                        required
                        className="input-field pl-12 appearance-none cursor-pointer"
                      >
                        <option value="">Sélectionner...</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Marque */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Marque</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="marque"
                        value={formData.marque}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="Ex: NSK, 3M..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Prix & Stock */}
            <div className="card bg-white/80 backdrop-blur-xl shadow-premium border-white/50">
              <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Offre & Inventaire</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Prix (MAD) *</label>
                  <input
                    type="number"
                    name="prix"
                    value={formData.prix}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="input-field font-mono"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock disponible *</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="input-field pl-12"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Conditionnement</label>
                  <input
                    type="text"
                    name="conditionnement"
                    value={formData.conditionnement}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ex: Boîte de 50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Images & Actions */}
          <div className="lg:col-span-1 space-y-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Upload Images */}
            <div className="card bg-white/80 backdrop-blur-xl shadow-premium border-white/50 h-fit">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">Visuels du produit</h2>
                <p className="text-xs text-gray-500 mt-1">Ajoutez jusqu'à 5 images de haute qualité.</p>
              </div>

              <div className="space-y-4">
                {/* Zone de drop */}
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary-300 rounded-2xl cursor-pointer bg-primary-50/50 hover:bg-primary-50 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform mb-3">
                      <Upload className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Cliquez pour ajouter</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5Mo)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageChange} 
                    multiple 
                    accept="image/*"
                  />
                </label>

                {/* Prévisualisation (Grille) */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {previews.map((src, index) => (
                      <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                        <img 
                          src={src} 
                          alt={`Aperçu ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bouton de soumission sticky */}
            <div className="sticky top-24">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 py-5 text-lg shadow-glow-purple disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-5 h-5 border-white border-t-transparent"></div>
                    <span>Publication...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Publier le produit</span>
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">
                En publiant, vous acceptez les CGV de Dental Maghket.
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;