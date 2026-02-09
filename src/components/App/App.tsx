import React from "react";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { createPortal } from "react-dom";

export default function App() {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState<Movie | null>(null);
  async function handleSearch(query: string) {
    try {
      setMovies([]);
      setError(false);
      setIsLoading(true);
      const movies = await fetchMovies(query);
      if (movies.length === 0) {
        toast.error("No movies found");
      }
      setMovies(movies);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };
  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      {selectedMovie &&
        createPortal(
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />,
          document.body,
        )}
    </div>
  );
}
