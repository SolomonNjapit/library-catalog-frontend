import { Link } from "react-router-dom";
import useReadingList from "../hooks/useReadingList.js";

export default function BookCard({ book }) {
  const id = book.id ?? book._id;
  const cover = book.coverImageUrl ?? book.coverImage ?? book.coverUrl ?? book.cover ?? book.imageUrl;
  const genre = Array.isArray(book.genres)
    ? book.genres.join(", ")
    : book.genre?.name ?? book.genre ?? "Uncategorized";
  const { readingList, addBook, removeBook } = useReadingList();
  const isSaved = readingList.some(
    (item) => String(item.id ?? item._id) === String(id),
  );

  return (
    <article className="book-card">
      <Link className="book-card-link" to={`/books/${encodeURIComponent(id)}`}>
        <div className="cover-frame">
          {cover ? (
            <img className="book-cover" src={cover} alt={`Cover of ${book.title}`} />
          ) : (
            <div className="cover-placeholder" aria-label="No cover image available">
              <span>{book.title}</span>
            </div>
          )}
        </div>
        <div className="book-card-copy">
          <span className="book-genre">{genre}</span>
          <h2>{book.title}</h2>
          <p>{book.author}</p>
        </div>
      </Link>
      <button
        type="button"
        className="save-book-button"
        aria-pressed={isSaved}
        onClick={() => (isSaved ? removeBook(book) : addBook(book))}
      >
        {isSaved ? "Remove from list" : "Save for later"}
      </button>
    </article>
  );
}
