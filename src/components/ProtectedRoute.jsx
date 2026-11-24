import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, requiredRole }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <section className="state-panel" role="status">
        <span className="loading-mark" aria-hidden="true" />
        <h1>Checking your account...</h1>
      </section>
    );
  }
  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <section className="state-panel error-panel" role="alert">
        <span className="eyebrow">Access restricted</span>
        <h1>This page is for {requiredRole}s.</h1>
      </section>
    );
  }
  return children;
}
