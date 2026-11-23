import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(location.state?.from?.pathname ?? "/booking", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "We couldn't sign you in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <span className="eyebrow">Welcome back</span>
      <h1>Come on in.</h1>
      <p className="auth-intro">Sign in to plan your next visit to the reading room.</p>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="form-feedback form-error" role="alert">{error}</p>}
        <label htmlFor="login-email">Email</label>
        <input id="login-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="auth-switch">New to Fieldnotes? <Link to="/register">Create an account</Link></p>
    </section>
  );
}
