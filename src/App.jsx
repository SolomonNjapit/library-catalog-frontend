import { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import BookDetailPage from "./pages/BookDetailPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ReadingListPage from "./pages/ReadingListPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminBooksPage from "./pages/admin/AdminBooksPage.jsx";
import AdminBorrowRequestsPage from "./pages/admin/AdminBorrowRequestsPage.jsx";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage.jsx";

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLogoutError("");
    try {
      await logout();
    } catch (error) {
      setLogoutError(error.message || "Could not sign out cleanly.");
    }
  }

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
        <nav className="main-nav" aria-label="Main navigation">
          <Link to="/">Catalog</Link>
          <Link to="/reading-list">Reading list</Link>
          {isAuthenticated ? (
            <>
              <Link to="/booking">Book a space</Link>
              {user?.role === "librarian" && (
                <div className="admin-nav">
                  <Link to="/admin/books">Books admin</Link>
                  <Link to="/admin/borrow-requests">Borrow requests</Link>
                  <Link to="/admin/bookings">Bookings</Link>
                </div>
              )}
              {(user?.username || user?.name) && <span className="nav-user">Hello, {user.username ?? user.name}</span>}
              <button type="button" className="nav-button" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <Link to="/login" state={{ from: location }}>Sign in</Link>
          )}
        </nav>
      </header>
      {logoutError && <p className="form-feedback form-error header-feedback" role="alert">{logoutError}</p>}
      <main>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/reading-list" element={<ReadingListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/books" element={<ProtectedRoute requiredRole="librarian"><AdminBooksPage /></ProtectedRoute>} />
          <Route path="/admin/borrow-requests" element={<ProtectedRoute requiredRole="librarian"><AdminBorrowRequestsPage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute requiredRole="librarian"><AdminBookingsPage /></ProtectedRoute>} />
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
