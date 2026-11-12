import { FormEvent, useEffect, useState } from "react";
import { loginUser, getApiErrorMessage } from "../api/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REMEMBERED_EMAIL_KEY = "careerai_remembered_email";

type Props = {
  onLogin: (token: string) => void;
  onGoToSignUp?: () => void;
};

interface FieldErrors {
  email?: string;
  password?: string;
}

export function LoginPage({ onLogin, onGoToSignUp }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Restore remembered email on mount if previously saved
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // Storage access gracefully handled if restricted
    }
  }, []);

  function validate(): boolean {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // Prevent duplicate submissions while in flight
    if (isLoading) return;

    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });

      // Handle Remember Me preference
      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim().toLowerCase());
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      } catch {
        // Safe storage fallback
      }

      onLogin(response.accessToken);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err);
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Hero & Branding Section */}
        <div className="brand-section">
          <div className="brand-header">
            <div className="brand-logo-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="brand-name">CareerAI</span>
          </div>

          <div className="brand-tagline-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            AI-Powered Career Intelligence
          </div>

          <h1 className="brand-headline">
            Land your dream role with <span>intelligent AI insights.</span>
          </h1>

          <p className="brand-description">
            Analyze your resume against target job descriptions, boost your ATS compatibility,
            and identify key skill gaps with tailored, actionable feedback.
          </p>

          {/* Dashboard-inspired Preview Widget */}
          <div className="brand-preview-card" aria-label="Platform preview">
            <div className="preview-metric-row">
              <span className="preview-metric-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#625cf6" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Resume ATS Compatibility
              </span>
              <span className="preview-badge-high">94% Match</span>
            </div>

            <div className="preview-progress-bar" role="progressbar" aria-valuenow={94} aria-valuemin={0} aria-valuemax={100}>
              <div className="preview-progress-fill" />
            </div>

            <div className="preview-features-grid">
              <div className="preview-feature-pill">
                <div className="preview-feature-label">Role Alignment</div>
                <div className="preview-feature-val">Senior Backend</div>
              </div>
              <div className="preview-feature-pill">
                <div className="preview-feature-label">Keyword Coverage</div>
                <div className="preview-feature-val">18 / 20 Matched</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sign-in Card Section */}
        <div className="signin-card">
          <div className="signin-header">
            <h2 className="signin-title">Welcome back</h2>
            <p className="signin-subtitle">Enter your email and password to access your dashboard.</p>
          </div>

          {serverError && (
            <div className="alert-error" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="signin-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-input ${fieldErrors.email ? "has-error" : ""}`}
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={isLoading}
                placeholder="name@company.com"
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <div id="email-error" className="field-error-text">
                  {fieldErrors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-input ${fieldErrors.password ? "has-error" : ""}`}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <div id="password-error" className="field-error-text">
                  {fieldErrors.password}
                </div>
              )}
            </div>

            <div className="options-row">
              <label className="checkbox-label" htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="checkbox-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                Remember me
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {onGoToSignUp && (
              <p className="auth-switch-text">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={onGoToSignUp}
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
