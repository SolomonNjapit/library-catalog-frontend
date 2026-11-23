import { Link, Route, Routes } from "react-router-dom";
import BookDetailPage from "./pages/BookDetailPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Fieldnotes Library home">
          <span className="brand-mark" aria-hidden="true">
            f.
          </span>
          <span className="brand-name">
            fieldnotes<span>library</span>
          </span>
        </Link>
        <span className="header-note">
          <span className="status-dot" aria-hidden="true" />
          Your neighborhood reading room
        </span>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <Link className="footer-brand" to="/">
          fieldnotes library
        </Link>
        <span>A little room for a lot of stories.</span>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <section className="message-panel">
      <span className="eyebrow">Page not found</span>
      <h1>This page has wandered off.</h1>
      <Link className="text-link" to="/">
        Return to the catalog <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
