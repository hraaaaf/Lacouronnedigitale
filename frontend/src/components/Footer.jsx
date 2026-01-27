import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden mt-20">
      {/* Background Premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-dots opacity-10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* À propos */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-primary-600 to-purple-600 p-3 rounded-2xl shadow-glow">
                  <span className="text-white text-3xl">🦷</span>
                </div>
                <span className="text-2xl font-black text-white">
                  DentalMarket
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                La première marketplace spécialisée en matériel dentaire au Maroc. 
                Connectant professionnels et fournisseurs de confiance depuis 2024.
              </p>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, color: 'hover:text-blue-400' },
                  { icon: Instagram, color: 'hover:text-pink-400' },
                  { icon: Linkedin, color: 'hover:text-blue-500' },
                  { icon: Twitter, color: 'hover:text-sky-400' }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className={`p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-400 ${social.color} hover:scale-110`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                Liens rapides
              </h3>
              <ul className="space-y-3">
                {['Catalogue', 'À propos', 'Contact', 'FAQ', 'Blog'].map((link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                    >
                      <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pour les fournisseurs */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                Fournisseurs
              </h3>
              <ul className="space-y-3">
                {[
                  'Devenir fournisseur',
                  'Tarifs',
                  'Dashboard',
                  'Documentation',
                  'Support'
                ].map((link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase().replace(/ /g, '-')}`}
                      className="text-gray-400 hover:text-white hover:translate-x-2 inline-block transition-all duration-300 group"
                    >
                      <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                Contactez-nous
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-gray-400 hover:text-white transition-colors group">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-400 group-hover:scale-110 transition-transform" />
                  <span>contact@dentalmarket.ma</span>
                </li>
                <li className="flex items-start space-x-3 text-gray-400 hover:text-white transition-colors group">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-400 group-hover:scale-110 transition-transform" />
                  <span>+212 5XX-XXXXXX</span>
                </li>
                <li className="flex items-start space-x-3 text-gray-400 hover:text-white transition-colors group">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-400 group-hover:scale-110 transition-transform" />
                  <span>Casablanca, Maroc</span>
                </li>
              </ul>

              {/* Newsletter */}
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <p className="text-sm text-gray-400 mb-3">Restez informé des nouveautés</p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl text-white font-bold text-sm hover:scale-105 transition-transform shadow-glow">
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider Premium */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="w-2 h-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full shadow-glow"></div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 DentalMarket. Tous droits réservés.
            </p>

            <div className="flex items-center space-x-6">
              <Link to="/mentions-legales" className="text-sm text-gray-400 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link to="/confidentialite" className="text-sm text-gray-400 hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link to="/cgv" className="text-sm text-gray-400 hover:text-white transition-colors">
                CGV
              </Link>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>au Maroc</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🔒', text: '100% Sécurisé' },
              { icon: '✅', text: 'Fournisseurs Vérifiés' },
              { icon: '🚚', text: 'Livraison Rapide' },
              { icon: '💎', text: 'Qualité Premium' }
            ].map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center space-x-2 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{badge.icon}</span>
                <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;