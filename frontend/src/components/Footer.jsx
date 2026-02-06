import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Award, 
  Lock 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- PARTIE HAUTE : LIENS & NEWSLETTER --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Marque & Intro */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Stethoscope size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                La Couronne <span className="text-primary-600">Digitale</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              La première marketplace marocaine dédiée aux professionnels dentaires. 
              Équipements certifiés et service premium depuis 2024.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Twitter, href: '#' }
              ].map((Social, idx) => (
                <a 
                  key={idx} 
                  href={Social.href} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all"
                >
                  <Social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm">
              {['Accueil', 'Catalogue', 'À propos', 'Blog', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-slate-600 hover:text-primary-600 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-primary-600 transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-slate-600">
                <MapPin size={18} className="text-primary-600 mt-0.5 shrink-0" />
                <span>Technopark, Casablanca<br/>Maroc</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Phone size={18} className="text-primary-600 shrink-0" />
                <span>+212 5 22 00 00 00</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Mail size={18} className="text-primary-600 shrink-0" />
                <span>contact@couronne-digitale.ma</span>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter (Réintégrée style Pro) */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Restez informé</h4>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 mb-3">
                Recevez nos offres exclusives et actualités dentaires.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- PARTIE MÉDIANE : TRUST BADGES (Réintégrés style Pro) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-slate-200">
          {[
            { icon: Lock, text: 'Paiement Sécurisé' },
            { icon: ShieldCheck, text: 'Fournisseurs Vérifiés' },
            { icon: Truck, text: 'Livraison Rapide' },
            { icon: Award, text: 'Qualité Premium' }
          ].map((badge, idx) => (
            <div key={idx} className="flex items-center justify-center gap-3 p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
              <badge.icon className="text-primary-600 w-5 h-5" />
              <span className="text-sm font-semibold text-slate-700">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* --- PARTIE BASSE : COPYRIGHT --- */}
        <div className="border-t border-slate-200 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} La Couronne Digitale. Tous droits réservés.</p>
          
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="hover:text-slate-900">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-slate-900">Confidentialité</Link>
            <Link to="/cgv" className="hover:text-slate-900">CGV</Link>
          </div>

          <div className="flex items-center gap-1">
             <span>Fait avec</span>
             <Heart className="w-3 h-3 text-red-500 fill-red-500" />
             <span>au Maroc</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;