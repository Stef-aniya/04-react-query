import React from "react";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export default function App() {
  const [selectedMovie, setSelectedMovie] = React.useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [topic, setTopic] = React.useState(" ");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", topic, currentPage],
    queryFn: () => fetchMovies(topic, currentPage),
    retry: 1,
    enabled: topic.trim().length > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  async function handleSearch(query: string) {
    setTopic(query);
    setCurrentPage(1);
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
      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data ? data.total_pages : 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        ></ReactPaginate>
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
