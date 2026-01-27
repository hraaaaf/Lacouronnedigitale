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
      icon: <ShoppingBag className="w-12 h-12" />,
      titre: 'Large Catalogue',
      description: 'Plus de 1000 produits dentaires certifiés et conformes',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Users className="w-12 h-12" />,
      titre: 'Fournisseurs Vérifiés',
      description: 'KYC complet pour garantir votre sécurité',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      titre: 'Paiement Sécurisé',
      description: 'Options adaptées au marché B2B marocain',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: <Zap className="w-12 h-12" />,
      titre: 'Livraison Rapide',
      description: 'Dans tout le Maroc avec suivi en temps réel',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Amina Bennani',
      role: 'Dentiste - Casablanca',
      text: 'DentalMarket a révolutionné ma façon de commander. Gain de temps incroyable !',
      avatar: '👩‍⚕️'
    },
    {
      name: 'Dr. Youssef Alami',
      role: 'Propriétaire Clinique - Rabat',
      text: 'Prix compétitifs et livraison rapide. Je recommande vivement !',
      avatar: '👨‍⚕️'
    },
    {
      name: 'Dental Supply Pro',
      role: 'Fournisseur Officiel',
      text: 'Excellente plateforme pour développer notre activité au Maroc.',
      avatar: '🏢'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section Ultra Premium */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-500 to-purple-600">
          <div className="absolute inset-0 bg-dots opacity-20"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge Premium */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-6 py-3 mb-8 animate-scale-in">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold">Révolutionnez votre approvisionnement dentaire</span>
          </div>

          {/* Titre Principal */}
          <h1 className="heading-1 text-white mb-6 animate-slide-in-up text-shadow-premium">
            La Marketplace
            <br />
            <span className="inline-block mt-2 px-6 py-2 bg-white/20 backdrop-blur-xl rounded-3xl">
              Dentaire du Maroc
            </span>
          </h1>

          <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light animate-fade-in">
            Trouvez tout le matériel dentaire dont vous avez besoin, 
            <span className="font-bold text-yellow-300"> livré partout au Maroc</span>
          </p>

          {/* Barre de recherche premium */}
          <div className="mb-12 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => navigate('/produits')}
              className="btn-primary text-lg shadow-glow-lg"
            >
              <ShoppingBag className="w-6 h-6 inline mr-2" />
              Parcourir le Catalogue
            </button>
            <button
              onClick={() => navigate('/inscription')}
              className="btn-outline text-lg text-white hover:text-white"
            >
              <Award className="w-6 h-6 inline mr-2" />
              Devenir Fournisseur
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            {[
              { value: '1000+', label: 'Produits Certifiés', icon: '📦' },
              { value: '50+', label: 'Fournisseurs Vérifiés', icon: '✅' },
              { value: '500+', label: 'Clients Satisfaits', icon: '😊' }
            ].map((stat, idx) => (
              <div key={idx} className="card-glass hover-lift p-6">
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Catégories Premium */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 gradient-text mb-4">Catégories Populaires</h2>
            <p className="text-xl text-gray-600">Trouvez exactement ce dont vous avez besoin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => navigate(`/produits?categorie=${cat.nom}`)}
                className="group relative card hover-lift p-8 text-center overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:gradient-text transition-all">
                  {cat.nom}
                </h3>
                <p className="text-sm text-gray-600 font-semibold">{cat.count} produits</p>
                
                <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 mx-auto rounded-full"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages Premium */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/50 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 gradient-text mb-4">Pourquoi DentalMarket ?</h2>
            <p className="text-xl text-gray-600">Une expérience d'achat révolutionnaire</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {avantages.map((avantage, index) => (
              <div
                key={index}
                className="card-gradient hover-lift text-center group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${avantage.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-500 shadow-glow`}>
                  {avantage.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{avantage.titre}</h3>
                <p className="text-gray-600 leading-relaxed">{avantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Premium */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-500 to-purple-600"></div>
        <div className="absolute inset-0 bg-dots opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-white mb-4 text-shadow-premium">Ce que disent nos clients</h2>
            <p className="text-xl text-white/80">Rejoignez des centaines de professionnels satisfaits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-glass hover-lift p-8" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-6xl mb-4">{testimonial.avatar}</div>
                <p className="text-white/90 text-lg mb-6 italic">"{testimonial.text}"</p>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-white font-bold">{testimonial.name}</p>
                  <p className="text-white/70 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Premium */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="card-gradient p-12 hover-lift">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary-600 animate-pulse" />
            <h2 className="heading-2 gradient-text mb-6">
              Prêt à transformer votre pratique ?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Inscrivez-vous gratuitement et découvrez une nouvelle façon de commander votre matériel dentaire
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/inscription')}
                className="btn-primary text-lg shadow-glow-lg"
              >
                <CheckCircle className="w-6 h-6 inline mr-2" />
                Créer un compte gratuitement
              </button>
              <button
                onClick={() => navigate('/produits')}
                className="btn-outline text-lg"
              >
                Explorer le catalogue
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center items-center space-x-8 mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-700">100% Sécurisé</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-semibold text-gray-700">Certifié</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">500+ Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;