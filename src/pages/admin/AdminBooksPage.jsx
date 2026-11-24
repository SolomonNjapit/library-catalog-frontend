import { useState } from "react";
import { api } from "../../lib/api.js";
import useApiResource from "../../hooks/useApiResource.js";

const blankBook = {
  title: "",
  author: "",
  isbn: "",
  description: "",
  coverImage: "",
  totalCopies: 1,
  availableCopies: 1,
  genre: "",
};

function getId(value) {
  return value?._id ?? value?.id;
}

export default function AdminBooksPage() {
  const { data: books, loading, error, refresh } = useApiResource("/books?limit=100");
  const { data: genres, loading: genresLoading, error: genresError } = useApiResource("/genres");
  const [form, setForm] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function startEdit(book) {
    setFeedback("");
    setForm({
      ...blankBook,
      ...book,
      genre: getId(book.genre) ?? book.genre ?? "",
    });
  }

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setFeedback("");
    setSubmitting(true);
    const body = {
      ...form,
      totalCopies: Number(form.totalCopies),
      availableCopies: Number(form.availableCopies),
    };
    try {
      if (form._id || form.id) {
        await api.put(`/books/${encodeURIComponent(getId(form))}`, body);
        setFeedback("Book updated.");
      } else {
        await api.post("/books", body);
        setFeedback("Book added.");
      }
      setForm(null);
      refresh();
    } catch (requestError) {
      setFeedback(requestError.message || "The book could not be saved.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeBook(book) {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    setFeedback("");
    try {
      await api.delete(`/books/${encodeURIComponent(getId(book))}`);
      setFeedback("Book deleted.");
      refresh();
    } catch (requestError) {
      setFeedback(requestError.message || "The book could not be deleted.");
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-heading">
        <div><span className="eyebrow">Librarian tools</span><h1>Books</h1></div>
        <button type="button" className="primary-button" onClick={() => { setFeedback(""); setForm({ ...blankBook }); }}>Add book</button>
      </header>
      {feedback && <p className="form-feedback" role="status">{feedback}</p>}
      {genresError && <p className="form-feedback form-error" role="alert">{genresError}</p>}
      {form && (
        <form className="form-card admin-form" onSubmit={submit}>
          <h2>{form._id || form.id ? "Edit book" : "Add a book"}</h2>
          <label htmlFor="book-title">Title</label>
          <input id="book-title" required value={form.title} onChange={(event) => change("title", event.target.value)} />
          <label htmlFor="book-author">Author</label>
          <input id="book-author" required value={form.author} onChange={(event) => change("author", event.target.value)} />
          <label htmlFor="book-isbn">ISBN</label>
          <input id="book-isbn" required value={form.isbn} onChange={(event) => change("isbn", event.target.value)} />
          <label htmlFor="book-genre">Genre</label>
          <select id="book-genre" required disabled={genresLoading} value={form.genre} onChange={(event) => change("genre", event.target.value)}>
            <option value="">Choose genre</option>
            {genres.map((genre) => <option key={getId(genre)} value={getId(genre)}>{genre.name}</option>)}
          </select>
          <label htmlFor="book-description">Description</label>
          <textarea id="book-description" rows="3" value={form.description ?? ""} onChange={(event) => change("description", event.target.value)} />
          <label htmlFor="book-cover">Cover image URL</label>
          <input id="book-cover" type="url" value={form.coverImage ?? ""} onChange={(event) => change("coverImage", event.target.value)} />
          <div className="admin-number-fields">
            <div><label htmlFor="book-total">Total copies</label><input id="book-total" type="number" min="0" step="1" required value={form.totalCopies} onChange={(event) => change("totalCopies", event.target.value)} /></div>
            <div><label htmlFor="book-available">Available copies</label><input id="book-available" type="number" min="0" step="1" required value={form.availableCopies} onChange={(event) => change("availableCopies", event.target.value)} /></div>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={submitting}>{submitting ? "Saving..." : "Save book"}</button>
            <button type="button" className="secondary-button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}
      {loading ? (
        <section className="state-panel" role="status"><span className="loading-mark" aria-hidden="true" /><h2>Loading books...</h2></section>
      ) : error ? (
        <section className="state-panel error-panel" role="alert"><h2>Books could not be loaded.</h2><p>{error}</p></section>
      ) : books.length === 0 ? (
        <section className="state-panel"><h2>No books in the catalog.</h2><p>Add a book to get started.</p></section>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Available</th><th>Actions</th></tr></thead>
            <tbody>{books.map((book) => (
              <tr key={getId(book)}>
                <td>{book.title}</td><td>{book.author}</td><td>{book.isbn}</td>
                <td>{book.availableCopies} / {book.totalCopies}</td>
                <td className="table-actions"><button type="button" className="secondary-button" onClick={() => startEdit(book)}>Edit</button><button type="button" className="danger-button" onClick={() => removeBook(book)}>Delete</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
