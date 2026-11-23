import { Link } from "react-router-dom";
import BookCard from "../components/BookCard.jsx";
import useReadingList from "../hooks/useReadingList.js";

export default function ReadingListPage() {
  const { readingList, clearList, storageError, ready } = useReadingList();

  return (
    <section className="catalog-page">
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">Saved for later</span>
          <h1>Your reading list.</h1>
        </div>
        {readingList.length > 0 && (
          <button type="button" className="clear-button" onClick={clearList}>Clear list</button>
        )}
      </div>
      {storageError && <p className="form-feedback form-error" role="alert">{storageError}</p>}
      {!ready ? (
        <section className="state-panel" role="status"><span className="loading-mark" aria-hidden="true" /><h2>Loading your saved books...</h2></section>
      ) : readingList.length === 0 ? (
        <section className="state-panel">
          <span className="eyebrow">A fresh page</span>
          <h2>Your reading list is empty.</h2>
          <p>Save a book from the catalog to keep it close.</p>
          <Link className="text-link" to="/">Explore the catalog <span aria-hidden="true">→</span></Link>
        </section>
      ) : (
        <>
          <p className="list-count">{readingList.length} {readingList.length === 1 ? "book" : "books"} saved on this device</p>
          <div className="book-grid">
            {readingList.map((book) => <BookCard key={book.id ?? book._id} book={book} />)}
          </div>
        </>
      )}
    </section>
  );
}
