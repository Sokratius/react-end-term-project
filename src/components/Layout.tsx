import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Film, Heart, User, LogOut, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { user } = useStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  const navLinks = [
    { to: '/', label: t('popular'), icon: Film },
    { to: '/favorites', label: t('favorites'), icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-brand-500 hover:text-brand-400 transition">
              <Film className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-indigo-500 bg-clip-text text-transparent">
                CineStream
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                    location.pathname === link.to
                      ? 'bg-slate-800 text-brand-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="h-6 w-px bg-slate-700 mx-2" />

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => i18n.changeLanguage('ru')}
                  className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'ru' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                >
                  RU
                </button>
                <button
                  onClick={() => i18n.changeLanguage('kz')}
                  className={`text-xs font-bold px-2 py-1 rounded ${i18n.language === 'kz' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                >
                  KZ
                </button>
              </div>

              {user ? (
                <div className="flex items-center space-x-4 ml-4">
                  <Link to="/profile" className="flex items-center space-x-2 text-slate-300 hover:text-white">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-400">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">
                    {t('login')}
                  </Link>
                  <Link to="/signup" className="text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-full transition">
                    {t('signup')}
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block text-slate-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
             <>
              <Link to="/login" className="block text-slate-300 py-2" onClick={() => setIsMenuOpen(false)}>{t('login')}</Link>
              <Link to="/signup" className="block text-brand-400 py-2" onClick={() => setIsMenuOpen(false)}>{t('signup')}</Link>
             </>
          )}
          {user && (
            <>
              <Link to="/profile" className="block text-slate-300 py-2" onClick={() => setIsMenuOpen(false)}>{t('profile')}</Link>
              <button onClick={handleLogout} className="block text-red-400 py-2">{t('logout')}</button>
            </>
          )}
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CineStream Pro. All rights reserved.</p>
        <p className="mt-2 text-xs">Powered by TMDB API</p>
      </footer>
    </div>
  );
};

export default Layout;