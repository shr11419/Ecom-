import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("signup");
  const [error, setError] = useState(null);
  const [step, setStep] = useState("auth"); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, login, saveName, user } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  if (user?.name) {
    navigate("/");
    return null;
  }

  async function onSubmit(data) {
    setError(null);
    setLoading(true);
    let result;
    if (mode === "signup") {
      result = signUp(data.email, data.password);
    } else {
      result = await login(data.email, data.password);
    }
    setLoading(false);

    if (result.success) {
      if (mode === "signup") {
        setStep("name"); // show name step after signup
      } else {
        navigate("/");
      }
    } else {
      setError(result.error);
    }
  }

  function handleNameSubmit(e) {
    e.preventDefault();
    const name = e.target.name.value.trim();
    if (!name) return;
    saveName(name);
    navigate("/");
  }

  if (step === "name") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">ShopHub 🛍️</div>
          <h2 className="auth-heading">What should we call you?</h2>
          <p className="auth-sub">We'll use this to personalise your experience</p>
          <form className="auth-form" onSubmit={handleNameSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                className="form-input"
                name="name"
                type="text"
                placeholder="e.g. Shritha"
                autoFocus
                required
              />
            </div>
            <button type="submit" className="auth-submit-btn">
              Let's Go →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">ShopHub 🛍️</div>
        <h2 className="auth-heading">
          {mode === "signup" ? "Create an account" : "Welcome back"}
        </h2>
        <p className="auth-sub">
          {mode === "signup"
            ? "Sign up to start shopping"
            : "Login to continue"}
        </p>

        <div className="auth-mode-tabs">
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

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Min 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
                maxLength: { value: 12, message: "Max 12 characters" },
              })}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
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