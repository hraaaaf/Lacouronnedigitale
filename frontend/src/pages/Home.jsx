import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  Shield, 
  Zap, 
  TrendingUp, 
  Award, 
  CheckCircle,
  Search,
  Wrench,       // Pour Instruments
  Syringe,      // Pour Consommables
  Armchair,     // Pour Équipements (Fauteuil)
  TestTube,     // Pour Hygiène
  ArrowRight
} from 'lucide-react';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const navigate = useNavigate();

  // Redirection recherche
  const handleSearch = (recherche) => {
    navigate(`/produits?q=${recherche}`);
  };

  // Catégories avec icônes PRO (au lieu des emojis)
  const categories = [
    { nom: 'Instruments', icon: <Wrench size={24} />, count: '250+ refs', link: 'Instruments' },
    { nom: 'Consommables', icon: <Syringe size={24} />, count: '500+ refs', link: 'Consommables' },
    { nom: 'Équipement', icon: <Armchair size={24} />, count: '80+ refs', link: 'Équipements lourds' },
    { nom: 'Hygiène', icon: <TestTube size={24} />, count: '150+ refs', link: 'Hygiène & Stérilisation' },
  ];

  const avantages = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      titre: 'Large Catalogue',
      description: 'Plus de 1000 produits dentaires certifiés et conformes aux normes.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      titre: 'Réseau Pro',
      description: 'Mise en relation directe avec les distributeurs agréés au Maroc.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      titre: 'Confiance Totale',
      description: 'Fournisseurs vérifiés et transactions sécurisées garanties.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      titre: 'Rapidité',
      description: 'Interface optimisée pour commander en moins de 3 clics.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-white border-b border-slate-200">
        
        {/* Fond décoratif léger */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl" />
           <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-sky-50 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge "Nouveau" */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium border border-primary-100 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            La marketplace n°1 au Maroc
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
            La référence du matériel dentaire <br/>
            <span className="text-primary-600">pour les professionnels.</span>
          </h1>

          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Trouvez, comparez et commandez vos équipements au meilleur prix.
            Une plateforme simple, transparente et sécurisée.
          </p>

          {/* BARRE DE RECHERCHE */}
          <div className="max-w-2xl mx-auto mb-12 shadow-xl shadow-slate-200/50 rounded-2xl">
             {/* On passe une prop className si ton composant SearchBar l'accepte, sinon on l'entoure */}
             <div className="bg-white p-2 rounded-2xl border border-slate-200">
                <SearchBar onSearch={handleSearch} />
             </div>
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/inscription')}
              className="btn-primary shadow-lg shadow-primary-500/20"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Créer un compte pro
            </button>
            <button
              onClick={() => navigate('/produits')}
              className="btn-secondary"
            >
              Explorer le catalogue
            </button>
          </div>

          {/* Trust Badges (Style Pro) */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-slate-100">
             <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <Shield className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold">100% Sécurisé</span>
             </div>
             <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <Award className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold">Fournisseurs Certifiés</span>
             </div>
             <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold">500+ Clients</span>
             </div>
          </div>
        </div>
      </section>

      {/* --- CATÉGORIES --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Explorez par univers</h2>
              <p className="text-slate-500 mt-2">Tout le nécessaire pour votre cabinet.</p>
            </div>
            <button onClick={() => navigate('/produits')} className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
              Tout voir <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(`/produits?categorie=${cat.link}`)}
                className="group cursor-pointer bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{cat.nom}</h3>
                <p className="text-sm text-slate-400 mt-1">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- AVANTAGES --- */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pourquoi choisir La Couronne Digitale ?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Nous simplifions l'approvisionnement médical pour vous permettre de vous concentrer sur vos patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {avantages.map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:bg-white hover:shadow-card transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-primary-600 flex items-center justify-center mb-6 border border-slate-100">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.titre}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="bg-slate-900 rounded-3xl p-12 relative overflow-hidden text-white shadow-2xl">
            {/* Décoration d'arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à équiper votre cabinet ?</h2>
              <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
                Rejoignez des centaines de dentistes qui font confiance à notre marketplace pour leur matériel quotidien.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => navigate('/inscription')}
                  className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg"
                >
                  Commencer maintenant
                </button>
                <button 
                  onClick={() => navigate('/produits')}
                  className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Voir les offres
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;