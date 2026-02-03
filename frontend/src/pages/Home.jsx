import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, Shield, Zap, Sparkles, TrendingUp, Award, CheckCircle } from 'lucide-react';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (recherche) => {
    navigate(`/produits?q=${recherche}`);
  };

  const categories = [
    { nom: 'Instruments', icon: '🔧', count: '250+', gradient: 'from-blue-500 to-cyan-500' },
    { nom: 'Consommables', icon: '💉', count: '500+', gradient: 'from-purple-500 to-pink-500' },
    { nom: 'Équipements lourds', icon: '🪑', count: '80+', gradient: 'from-orange-500 to-red-500' },
    { nom: 'Hygiène & Stérilisation', icon: '🧪', count: '150+', gradient: 'from-green-500 to-teal-500' },
  ];

  const avantages = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      titre: 'Large Catalogue',
      description: 'Plus de 1000 produits dentaires certifiés et conformes aux normes internationales.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      titre: 'Fournisseurs Vérifiés',
      description: 'Un processus KYC rigoureux pour garantir votre sécurité à chaque commande.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      titre: 'Paiement Sécurisé',
      description: 'Des options de paiement adaptées spécifiquement au marché B2B marocain.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      titre: 'Livraison Rapide',
      description: 'Livraison dans tout le Maroc avec un suivi en temps réel de votre colis.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Amina Bennani',
      role: 'Dentiste — Casablanca',
      text: 'DentalMarket a révolutionné ma façon de commander. Un gain de temps incroyable au quotidien !',
      avatar: '👩‍⚕️'
    },
    {
      name: 'Dr. Youssef Alami',
      role: 'Propriétaire Clinique — Rabat',
      text: 'Prix très compétitifs et livraison rapide. Je recommande vivement cette plateforme.',
      avatar: '👨‍⚕️'
    },
    {
      name: 'Dental Supply Pro',
      role: 'Fournisseur Officiel',
      text: 'Une excellente plateforme pour développer notre activité de distribution au Maroc.',
      avatar: '🏢'
    }
  ];

  return (
    <div className="overflow-hidden">

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* BG gradient + orbes flottants */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700">
          <div className="absolute inset-0 bg-dots opacity-15"></div>
          <div className="absolute top-16 left-16 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-24 right-16 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl border border-white/25 rounded-full px-5 py-2.5 mb-10 animate-scale-in">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-semibold">Révolutionnez votre approvisionnement dentaire</span>
          </div>

          {/* Titre */}
          <h1 className="heading-1 text-white mb-5 animate-slide-in-up text-shadow-premium">
            La Marketplace
          </h1>
          <h1 className="heading-1 text-white animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="inline-block px-6 py-2 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20">
              Dentaire du Maroc
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl text-white/85 mt-8 mb-12 max-w-2xl mx-auto font-light animate-fade-in" style={{ animationDelay: '0.25s' }}>
            Trouvez tout le matériel dentaire dont vous avez besoin,{' '}
            <span className="font-bold text-yellow-300">livré partout au Maroc</span>
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-10 animate-slide-in-up" style={{ animationDelay: '0.35s' }}>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => navigate('/produits')}
              className="btn-primary text-base shadow-glow-lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Parcourir le Catalogue
            </button>
            <button
              onClick={() => navigate('/inscription')}
              className="btn-outline text-base text-white hover:text-white"
            >
              <Award className="w-5 h-5 mr-2" />
              Devenir Fournisseur
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-16 animate-slide-in-up" style={{ animationDelay: '0.65s' }}>
            {[
              { value: '1000+', label: 'Produits Certifiés', icon: '📦' },
              { value: '50+',   label: 'Fournisseurs Vérifiés', icon: '✅' },
              { value: '500+',  label: 'Clients Satisfaits', icon: '😊' }
            ].map((stat, idx) => (
              <div key={idx} className="card-glass p-5 text-center">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-white/75 text-sm font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CATEGORIES
          ============================================================ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-white/55 backdrop-blur-xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="heading-2 gradient-text">Catégories Populaires</h2>
            <p className="text-lg text-gray-500 mt-3">Trouvez exactement ce dont vous avez besoin</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => navigate(`/produits?categorie=${cat.nom}`)}
                className="group relative card hover-lift p-7 text-center overflow-hidden"
              >
                {/* Gradient overlay au hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-500 rounded-[2rem]`}></div>

                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:gradient-text transition-all">
                  {cat.nom}
                </h3>
                <p className="text-sm text-gray-500 font-semibold mt-1">{cat.count} produits</p>

                {/* Ligne animée */}
                <div className="mt-4 h-0.5 w-0 group-hover:w-3/4 bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-500 mx-auto rounded-full"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          AVANTAGES
          ============================================================ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/40 to-transparent"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="heading-2 gradient-text">Pourquoi DentalMarket ?</h2>
            <p className="text-lg text-gray-500 mt-3">Une expérience d'achat pensée pour les professionnels</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {avantages.map((avantage, index) => (
              <div
                key={index}
                className="card-gradient hover-lift text-center group p-8"
              >
                {/* Icone avec gradient */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${avantage.gradient} text-white mb-5 group-hover:scale-110 transition-transform duration-500 shadow-glow`}>
                  {avantage.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{avantage.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{avantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700"></div>
        <div className="absolute inset-0 bg-dots opacity-10"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="heading-2 text-white text-shadow-premium">Ce que disent nos clients</h2>
            <p className="text-lg text-white/70 mt-3">Rejoignez des centaines de professionnels satisfaits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-glass hover-lift p-7">
                <div className="text-4xl mb-3">{testimonial.avatar}</div>
                <p className="text-white/85 text-base mb-5 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="border-t border-white/15 pt-4">
                  <p className="text-white font-bold text-sm">{testimonial.name}</p>
                  <p className="text-white/55 text-xs mt-0.5">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA FINAL
          ============================================================ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-grid opacity-8"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <div className="card-gradient p-12">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h2 className="heading-2 gradient-text mb-4">
              Prêt à transformer votre pratique ?
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
              Inscrivez-vous gratuitement et découvrez une nouvelle façon de gérer votre approvisionnement dentaire.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/inscription')}
                className="btn-primary shadow-glow-lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Créer un compte gratuitement
              </button>
              <button
                onClick={() => navigate('/produits')}
                className="btn-outline"
              >
                Explorer le catalogue
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex justify-center items-center gap-8 mt-10 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-gray-600">100% Sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-semibold text-gray-600">Certifié</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-gray-600">500+ Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;