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

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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

  const [images, setImages] = useState([]); // File[]
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

  // UPLOAD CLOUDINARY (clé du fix)
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: data }
    );

    if (!res.ok) throw new Error('Erreur upload image');

    const result = await res.json();
    return {
      url: result.secure_url,
      public_id: result.public_id,
      altText: formData.nom || ''
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (images.length === 0) {
        setError('Au moins une image est requise.');
        setLoading(false);
        return;
      }

      // 1️⃣ Upload images vers Cloudinary
      const uploadedImages = await Promise.all(
        images.map(img => uploadToCloudinary(img))
      );

      // 2️⃣ Envoi au backend (JSON, plus de FormData)
      await produitsAPI.create({
        ...formData,
        prix: Number(formData.prix),
        stock: Number(formData.stock),
        images: uploadedImages
      });

      navigate('/mes-produits');
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors de la création du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <Link to="/mes-produits" className="flex items-center text-slate-500 font-bold">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'inventaire
          </Link>
          <h1 className="text-3xl font-black">
            Nouveau <span className="text-primary-600">Produit</span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-2 space-y-6">

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Informations générales</h2>

              <input name="nom" value={formData.nom} onChange={handleChange} required className="input-field" placeholder="Nom du produit" />
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="input-field mt-4" />

              <select name="categorie" value={formData.categorie} onChange={handleChange} required className="input-field mt-4">
                <option value="">Sélectionner...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <input name="marque" value={formData.marque} onChange={handleChange} className="input-field mt-4" placeholder="Marque" />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">Prix & Stock</h2>

              <input type="number" name="prix" value={formData.prix} onChange={handleChange} required className="input-field" placeholder="Prix" />
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="input-field mt-4" placeholder="Stock" />
              <input name="conditionnement" value={formData.conditionnement} onChange={handleChange} className="input-field mt-4" placeholder="Conditionnement" />
            </div>

          </div>

          {/* COLONNE DROITE */}
          <div className="space-y-6">

            <div className="card">
              <h2 className="text-lg font-bold mb-2">Images</h2>

              <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer">
                <Upload className="mx-auto mb-2" />
                <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                Ajouter des images
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {previews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} className="rounded-lg object-cover h-32 w-full" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white rounded-full p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4">
              {loading ? 'Publication…' : 'Publier le produit'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
