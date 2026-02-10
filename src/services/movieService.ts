import type { Movie } from "../types/movie";
import axios from "axios";

const API_URL =
  "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}
export async function fetchMovies(
  query: string,
  page: number = 1,
): Promise<FetchMoviesResponse> {
  if (!query.trim()) {
    return {
      results: [],
      total_pages: 0,
    };
  }
  const response = await axios.get<FetchMoviesResponse>(API_URL, {
    params: {
      query: query,
      language: "en-US",
      page: page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });
  return response.data;
}
