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
    'Instruments', 'Consommables', 'Équipements lourds',
    'Hygiène & Stérilisation', 'Radiologie', 'Prothèse',
    'Implantologie', 'Orthodontie', 'Endodontie',
    'Parodontologie', 'Autres'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('Vous ne pouvez ajouter que 5 images maximum.');
      return;
    }

    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setError('');
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      
      // --- CORRECTIF ICI ---
      // On envoie des champs simples pour que multer et le backend les lisent facilement
      data.append('nom', formData.nom);
      data.append('description', formData.description);
      data.append('prix', formData.prix);
      data.append('categorie', formData.categorie);
      data.append('marque', formData.marque);
      data.append('conditionnement', formData.conditionnement);
      
      // IMPORTANT : On envoie 'stock' comme un simple nombre (string)
      // Le backend fera : parseInt(req.body.stock)
      data.append('stock', formData.stock);

      if (images.length === 0) {
        throw new Error("Veuillez ajouter au moins une image.");
      }

      images.forEach((imageFile) => {
        data.append('images', imageFile);
      });

      await produitsAPI.create(data);
      
      navigate('/mes-produits');
    } catch (err) {
      console.error("Erreur complète:", err);
      // Afficher le message précis renvoyé par le serveur s'il existe
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      setError(serverMessage || err.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
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
          
          <div className="lg:col-span-2 space-y-6">
            {/* Infos Générales */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6 border-b border-gray-50 pb-4">
                <FileText className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Informations détaillées</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nom du produit *</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    placeholder="Ex: Turbine dentaire"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                    placeholder="Spécifications..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie *</label>
                    <select
                      name="categorie"
                      value={formData.categorie}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Sélectionner...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Marque</label>
                    <input
                      type="text"
                      name="marque"
                      value={formData.marque}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4"
                      placeholder="Ex: NSK"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Prix & Stock */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6 border-b border-gray-50 pb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Prix & Inventaire</h2>
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4"
                    placeholder="Quantité"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Conditionnement</label>
                  <input
                    type="text"
                    name="conditionnement"
                    value={formData.conditionnement}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4"
                    placeholder="Ex: Boîte de 50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Photos du produit</h2>
              
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary-200 rounded-2xl cursor-pointer bg-primary-50/30 hover:bg-primary-50 transition-colors group">
                  <Upload className="w-8 h-8 text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-bold text-gray-600">Ajouter des photos</p>
                  <input type="file" className="hidden" onChange={handleImageChange} multiple accept="image/*" />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {previews.map((src, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                      <img src={src} className="w-full h-full object-cover" alt="Preview" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white rounded-2xl py-4 font-bold shadow-lg hover:bg-primary-700 transition-all disabled:bg-gray-300"
                >
                  {loading ? 'Publication...' : 'Publier le produit'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;