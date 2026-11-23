import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { status } = useAuth();
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
  return children;
}
