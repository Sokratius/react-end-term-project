import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { Star, Trash2 } from 'lucide-react';

const Favorites: React.FC = () => {
  const { t } = useTranslation();
  const { favorites, removeFromFavorites } = useStore();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-slate-900 p-6 rounded-full mb-4">
          <Star className="w-12 h-12 text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('no_fav_title')}</h2>
        <p className="text-slate-400 mb-6">{t('no_fav_desc')}</p>
        <Link to="/" className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition">
          {t('browse')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-brand-500 pl-4">
        {t('favorites')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((movie) => (
          <div key={movie.id} className="bg-slate-900 rounded-xl flex overflow-hidden border border-slate-800 hover:border-slate-700 transition">
            <Link to={`/movie/${movie.id}`} className="w-32 shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </Link>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <Link to={`/movie/${movie.id}`}>
                  <h3 className="text-lg font-bold text-white hover:text-brand-400 mb-1 line-clamp-1">{movie.title}</h3>
                </Link>
                <div className="flex items-center text-yellow-500 text-sm mb-2">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  {movie.vote_average.toFixed(1)}
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{movie.overview}</p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => removeFromFavorites(movie.id)}
                  className="flex items-center text-red-400 hover:text-red-300 text-sm transition"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t('remove')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;