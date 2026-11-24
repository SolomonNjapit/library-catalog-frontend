import { Link } from "react-router-dom";
import BookCard from "../components/BookCard.jsx";
import useReadingList from "../hooks/useReadingList.js";
import { api } from "../lib/api.js";
import { useState } from "react";

export default function ReadingListPage() {
  const { readingList, clearList, storageError, ready } = useReadingList();
  const [requestStates, setRequestStates] = useState({});

  async function requestBorrow(book) {
    const id = book.id ?? book._id;
    setRequestStates((current) => ({ ...current, [id]: { loading: true, message: "" } }));
    try {
      await api.post("/borrow-requests", { bookId: id });
      setRequestStates((current) => ({ ...current, [id]: { loading: false, message: "Borrow request sent." } }));
    } catch (error) {
      setRequestStates((current) => ({ ...current, [id]: { loading: false, message: error.message } }));
    }
  }

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
            {readingList.map((book) => {
              const id = book.id ?? book._id;
              const requestState = requestStates[id];
              return (
                <article className="book-card" key={id}>
                  <BookCard book={book} />
                  <button type="button" className="primary-button" disabled={requestState?.loading} onClick={() => requestBorrow(book)}>
                    {requestState?.loading ? "Sending..." : "Request to borrow"}
                  </button>
                  {requestState?.message && (
                    <p className={`form-feedback ${requestState.message === "Borrow request sent." ? "form-success" : "form-error"}`} role={requestState.message === "Borrow request sent." ? "status" : "alert"}>
                      {requestState.message}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
