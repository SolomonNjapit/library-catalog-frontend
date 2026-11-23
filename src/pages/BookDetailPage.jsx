import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("This book link is missing an id.");
      setLoading(false);
      return;
    }
    const controller = new AbortController();

    async function loadBook() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE_URL}/books/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        if (response.status === 404) throw new Error("This book could not be found.");
        if (!response.ok) throw new Error(`Book request failed (${response.status})`);
        const payload = await response.json();
        setBook(payload.book ?? payload.data ?? payload);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "This book could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBook();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <section className="state-panel detail-state" role="status">
        <span className="loading-mark" aria-hidden="true" />
        <h1>Opening the book...</h1>
      </section>
    );
  }
  if (error || !book) {
    return (
      <section className="state-panel error-panel detail-state" role="alert">
        <span className="eyebrow">Unable to open</span>
        <h1>{error || "This book is unavailable."}</h1>
        <Link className="text-link" to="/">Return to the catalog <span aria-hidden="true">→</span></Link>
      </section>
    );
  }

  const cover = book.coverImageUrl ?? book.coverImage ?? book.coverUrl ?? book.cover ?? book.imageUrl;
  const genre = Array.isArray(book.genres)
    ? book.genres.join(", ")
    : book.genre?.name ?? book.genre ?? "Uncategorized";

  return (
    <article className="detail-page">
      <Link className="back-link" to="/">← Back to the catalog</Link>
      <div className="detail-layout">
        <div className="detail-cover-frame">
          {cover ? (
            <img className="detail-cover" src={cover} alt={`Cover of ${book.title}`} />
          ) : (
            <div className="detail-placeholder"><span>{book.title}</span></div>
          )}
        </div>
        <div className="detail-copy">
          <span className="book-genre">{genre}</span>
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>
          {book.description && <p className="detail-description">{book.description}</p>}
          <dl className="book-facts">
            {book.isbn && <div><dt>ISBN</dt><dd>{book.isbn}</dd></div>}
            {book.publishedYear && <div><dt>Published</dt><dd>{book.publishedYear}</dd></div>}
            {book.publisher && <div><dt>Publisher</dt><dd>{book.publisher}</dd></div>}
            {book.pages && <div><dt>Length</dt><dd>{book.pages} pages</dd></div>}
          </dl>
        </div>
      </div>
    </article>
  );
}
