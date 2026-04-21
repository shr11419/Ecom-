import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function AuthPrompt() {
    const { signUp, login, saveName, showAuthPrompt, setShowAuthPrompt } = useAuth();
    const [mode, setMode ] = useState("signup");
    const [step, setStep ] = useState("auth");
    const [error, setError ] = useState(null);
    const [loading, setLoading ] = useState(false);
    const { loginWithGoogle } = useAuth();

    const { register, handleSubmit, formState: {errors} , reset } = useForm();

    if(!showAuthPrompt) return null;

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
                setStep("name");
            }
        } else {
            setError(result.error);
        }
    }

    async function handleGoogle() {
  const result = await loginWithGoogle();
  if (!result.success) setError(result.error);
  // onAuthStateChanged handles the rest automatically
}

    function handleNameSubmit(e) {
        e.preventDefault();
        const name = e.target.username.value.trim();
        if (!name) return;
        saveName(name);
    }

    if(step == "name") {
        return ( 
            <div className="auth-overlay">
                <div className="auth-prompt-card">
                    <div className="auth-prompt-brand">ShopHub 🛍️</div>
                     <div className="auth-prompt-emoji">👋</div>
                     <h2 className="auth-prompt-title">What's your name?</h2>
                     <p className="auth-prompt-sub">So we can personalise your experience</p>
                    <form onSubmit={handleNameSubmit} className="auth-prompt-form">
                        <input className="auth-prompt-input"
                        name="username"
                        type="text"
                        placeholder="Enter your name"
                        authFocus
                        required 
                        />
                    <button type="submit" className="auth-prompt-btn">
                        Start Shopping →
                    </button> 
                    </form> 
                    </div> 
                </div>
        );
    }

    return( 
        <div className="auth-overlay">
            <div className="auth-prompt-card">
                <button className="auth-prompt-skip" onClick={() => setShowAuthPrompt(false)}>Skip for now</button>
                <div className="auth-prompt-brand"> ShopHub 🛍️</div>
        <div className="auth-prompt-emoji">🛒</div>
        <h2 className="auth-prompt-title">
          {mode === "signup" ? "Create account" : "Welcome back"}
        </h2>
        <p className="auth-prompt-sub">
          {mode === "signup"
            ? "Sign up for a better shopping experience"
            : "Login to access your cart & wishlist"}
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

        <form className="auth-prompt-form" onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="auth-prompt-error">{error}</div>}
          <input
            className="auth-prompt-input"
            type="email"
            placeholder="Email address"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <span className="auth-prompt-field-error">{errors.email.message}</span>}

          <input
            className="auth-prompt-input"
            type="password"
            placeholder="Password (6-12 chars)"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
              maxLength: { value: 12, message: "Max 12 characters" },
            })}
          />
          {errors.password && <span className="auth-prompt-field-error">{errors.password.message}</span>}

          <button type="submit" className="auth-prompt-btn" disabled={loading}>
            {loading ? "Please wait..." : mode === "signup" ? "Sign Up" : "Login"}
          </button>

          <div className="auth-divider">
  <span>or</span>
</div>

<button
  type="button"
  className="google-btn"
  onClick={handleGoogle}
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    width="18"
    alt="Google"
  />
  Continue with Google
</button>
        </form>

        <p className="auth-prompt-switch">
          {mode === "signup" ? "Already have an account? " : "New here? "}
          <span
            className="auth-prompt-link"
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(null); reset(); }}
          >
            {mode === "signup" ? "Login" : "Sign Up"}
          </span>
        </p>
        </div>
            </div>
    );
}