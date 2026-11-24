import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({ username, email, password });
      navigate(location.state?.from?.pathname ?? "/booking", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "We couldn't create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <span className="eyebrow">Join the reading room</span>
      <h1>Make yourself at home.</h1>
      <p className="auth-intro">Create an account to save your reading list and plan a visit.</p>
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="form-feedback form-error" role="alert">{error}</p>}
        <label htmlFor="register-username">Username</label>
        <input id="register-username" name="username" autoComplete="username" minLength={3} required value={username} onChange={(event) => setUsername(event.target.value)} />
        <label htmlFor="register-email">Email</label>
        <input id="register-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="register-password">Password</label>
        <input id="register-password" name="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p>
    </section>
  );
}
