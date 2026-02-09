import type { Movie } from "../types/movie";
import axios from "axios";

const API_URL =
  "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";

interface FetchMoviesResponse {
  results: Movie[];
}
export async function fetchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) {
    return [];
  }
  const response = await axios.get<FetchMoviesResponse>(API_URL, {
    params: {
      query: query,
      language: "en-US",
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });
  return response.data.results;
}
