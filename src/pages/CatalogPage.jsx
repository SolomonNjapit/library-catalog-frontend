import { useEffect, useState } from "react";
import BookCard from "../components/BookCard.jsx";
import GenreFilter from "../components/GenreFilter.jsx";
import SearchBar from "../components/SearchBar.jsx";
import useBooks from "../hooks/useBooks.js";

export default function CatalogPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const { books, loading, error, pagination } = useBooks({ search, genre, page });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  function handleGenreChange(nextGenre) {
    setGenre(nextGenre);
    setPage(1);
  }

  const totalPages =
    pagination?.totalPages ??
    pagination?.pages ??
    (pagination?.total && pagination?.limit
      ? Math.ceil(pagination.total / pagination.limit)
      : null);

  return (
    <section className="catalog-page">
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">The collection</span>
          <h1>Find a story worth keeping.</h1>
        </div>
        <p>Browse familiar favorites and new voices from the neighborhood shelf.</p>
      </div>

      <div className="catalog-controls">
        <SearchBar value={searchInput} onChange={setSearchInput} />
        <GenreFilter value={genre} onChange={handleGenreChange} />
      </div>

      {loading && (
        <section className="state-panel" role="status" aria-live="polite">
          <span className="loading-mark" aria-hidden="true" />
          <h2>Pulling books from the shelf...</h2>
        </section>
      )}

      {!loading && error && (
        <section className="state-panel error-panel" role="alert">
          <span className="eyebrow">Connection trouble</span>
          <h2>We couldn't reach the catalog.</h2>
          <p>{error}</p>
        </section>
      )}

      {!loading && !error && books.length === 0 && (
        <section className="state-panel">
          <span className="eyebrow">No matches</span>
          <h2>Nothing on this shelf yet.</h2>
          <p>Try another search or clear the genre filter.</p>
          {(search || genre) && (
            <button
              type="button"
              className="clear-button"
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setGenre("");
                setPage(1);
              }}
            >
              Clear filters
            </button>
          )}
        </section>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <div className="catalog-results">
            <span>{books.length} {books.length === 1 ? "book" : "books"} found</span>
            {(search || genre) && <span className="active-filters">Filtered catalog</span>}
          </div>
          <div className="book-grid">
            {books.map((book) => (
              <BookCard key={book.id ?? book._id ?? book.title} book={book} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Catalog pages">
              <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
