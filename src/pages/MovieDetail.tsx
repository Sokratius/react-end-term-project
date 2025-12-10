import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails } from '../services/tmdbService';
import { MovieDetails } from '../types';
import { useStore } from '../store/useStore';
import { Heart, Calendar, Clock, DollarSign, BarChart2, WifiOff, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { favorites, addToFavorites, removeFromFavorites } = useStore();
  
  const isFavorite = favorites.some(f => f.id === Number(id));

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(false);
      fetchMovieDetails(Number(id), i18n.language)
        .then((data) => {
          setMovie(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(true);
          setLoading(false);
        });
    }
  }, [id, i18n.language]);

  if (loading) return <div className="text-center text-white p-10">Loading details...</div>;

  if (error || !movie) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <WifiOff className="w-16 h-16 text-slate-600 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Failed to load movie</h2>
      <p className="text-slate-400 mb-6">Check your connection and try again.</p>
      <Link to="/" className="flex items-center text-brand-400 hover:text-brand-300">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Movies
      </Link>
    </div>
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
      {/* Backdrop */}
      <div className="relative h-96 w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 -mt-32 px-6 pb-8 flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="shrink-0 w-48 md:w-64 rounded-xl shadow-2xl overflow-hidden border-4 border-slate-800">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-grow pt-4 md:pt-32">
          <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
          <p className="text-xl text-slate-400 italic mb-6">{movie.tagline}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres.map(g => (
              <span key={g.id} className="px-3 py-1 bg-slate-800 text-brand-400 rounded-full text-sm font-medium border border-slate-700">
                {g.name}
              </span>
            ))}
          </div>

          <p className="text-slate-300 leading-relaxed mb-8 max-w-3xl">
            {movie.overview}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center text-slate-300">
              <Calendar className="w-5 h-5 mr-2 text-brand-500" />
              <div>
                <p className="text-xs text-slate-500">{t('release_date')}</p>
                <p className="font-medium">{movie.release_date}</p>
              </div>
            </div>
            <div className="flex items-center text-slate-300">
              <Clock className="w-5 h-5 mr-2 text-brand-500" />
              <div>
                <p className="text-xs text-slate-500">{t('runtime')}</p>
                <p className="font-medium">{movie.runtime} {t('min')}</p>
              </div>
            </div>
            <div className="flex items-center text-slate-300">
              <DollarSign className="w-5 h-5 mr-2 text-brand-500" />
              <div>
                <p className="text-xs text-slate-500">{t('revenue')}</p>
                <p className="font-medium">${(movie.revenue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
             <div className="flex items-center text-slate-300">
              <BarChart2 className="w-5 h-5 mr-2 text-brand-500" />
              <div>
                <p className="text-xs text-slate-500">{t('rating')}</p>
                <p className="font-medium">{movie.vote_average.toFixed(1)} ({movie.vote_count})</p>
              </div>
            </div>
          </div>

          <button
            onClick={toggleFavorite}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition transform active:scale-95 ${
              isFavorite
                ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20'
                : 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/20'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? t('remove_fav') : t('add_fav')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;