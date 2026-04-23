import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Auth() {
  const [mode, setMode] = useState("signup");
  const [step, setStep] = useState("auth"); // "auth" | "name"
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, login, loginWithGoogle, saveName, user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // already logged in with a name — go home
  if (user?.name) {
    navigate("/");
    return null;
  }

  async function onSubmit(data) {
    setError(null);
    setLoading(true);
    let result;
    if (mode === "signup") {
      result = await signUp(data.email, data.password);
    } else {
      result = await login(data.email, data.password);
    }
    setLoading(false);
    if (result.success) {
      if (mode === "signup") {
        setStep("name");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  }

  async function handleNameSubmit(e) {
    e.preventDefault();
    const name = e.target.username.value.trim();
    if (!name) return;
    await saveName(name);
    navigate("/");
  }

  // ===== NAME STEP =====
  if (step === "name") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">ShopHub 🛍️</div>
          <div className="auth-emoji">👋</div>
          <h2 className="auth-heading">What's your name?</h2>
          <p className="auth-sub">We'll use this to personalise your experience</p>
          <form className="auth-form-col" onSubmit={handleNameSubmit}>
            <input
              className="auth-input"
              name="username"
              type="text"
              placeholder="Enter your name"
              autoFocus
              required
            />
            <button type="submit" className="auth-submit-btn">
              Start Shopping →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===== AUTH STEP =====
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">ShopHub 🛍️</div>
        <div className="auth-emoji">🛒</div>
        <h2 className="auth-heading">
          {mode === "signup" ? "Create account" : "Welcome back"}
        </h2>
        <p className="auth-sub">
          {mode === "signup"
            ? "Sign up for a better shopping experience"
            : "Login to access your cart & wishlist"}
        </p>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => { setMode("signup"); setError(null); reset(); }}
          >
            Sign Up
          </button>
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(null); reset(); }}
          >
            Login
          </button>
        </div>

        <form className="auth-form-col" onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Min 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="google-btn" onClick={handleGoogle} disabled={loading}>
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <p className="auth-switch">
          {mode === "signup" ? "Already have an account? " : "New here? "}
          <span
            className="auth-link"
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(null); reset(); }}
          >
            {mode === "signup" ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}