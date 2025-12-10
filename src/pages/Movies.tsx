import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Search, Filter, WifiOff } from 'lucide-react';
import { fetchMovies } from '../services/tmdbService';
import { useDebounce } from '../hooks/useDebounce';
import { Movie } from '../types';

const Movies: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // фильтр
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sortBy = searchParams.get('sort_by') || 'popularity.desc';

  const debouncedQuery = useDebounce(query, 500);

  const loadMovies = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchMovies(debouncedQuery, page, sortBy, i18n.language);
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [debouncedQuery, page, sortBy, i18n.language]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ query: e.target.value, page: '1', sort_by: sortBy });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ query, page: '1', sort_by: e.target.value });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ query, page: newPage.toString(), sort_by: sortBy });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={query}
            onChange={handleSearch}
            className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="text-slate-500 w-5 h-5" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-slate-950 border border-slate-700 text-slate-200 py-2 px-3 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 w-full"
          >
            <option value="popularity.desc">{t('sort_popularity')}</option>
            <option value="vote_average.desc">{t('sort_rating')}</option>
            <option value="release_date.desc">{t('sort_release')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <WifiOff className="w-16 h-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Connection Error</h3>
          <p className="text-slate-400 mb-6">Could not load movies. You might be offline.</p>
          <button 
            onClick={loadMovies}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-brand-500 transition duration-300">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://picsum.photos/300/450'}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold truncate">{movie.title}</h3>
                <div className="flex items-center justify-between mt-2 text-sm text-slate-400">
                  <span className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* пагинация */}
      {!error && !loading && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 hover:bg-slate-700 transition"
          >
            {t('prev')}
          </button>
          <span className="px-4 py-2 text-slate-400">
            {t('page_of', { current: page, total: totalPages > 500 ? 500 : totalPages })}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 hover:bg-slate-700 transition"
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Movies;