import { Movie, MovieDetails } from '../types';

const API_KEY = 'a70153d9cb49e9872a771ccad18e57d3';
const BASE_URL = 'https://api.themoviedb.org/3';

// Helper to map app languages to TMDB locales
const getTmdbLanguage = (lang: string) => {
  switch (lang) {
    case 'ru': return 'ru-RU';
    case 'kz': return 'kk'; // Use ISO 639-1 code for better coverage
    default: return 'en-US';
  }
};

export const fetchMovies = async (
  query: string = '', 
  page: number = 1,
  sortBy: string = 'popularity.desc',
  language: string = 'en'
): Promise<{ results: Movie[]; total_pages: number }> => {
  const langParam = getTmdbLanguage(language);
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}&language=${langParam}`;
  
  if (query) {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=${langParam}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
};

export const fetchMovieDetails = async (id: number, language: string = 'en'): Promise<MovieDetails> => {
  const langParam = getTmdbLanguage(language);
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${langParam}`);
  if (!res.ok) throw new Error('Failed to fetch details');
  return res.json();
};