import { FormEvent, useState } from "react";
import { registerUser, getApiErrorMessage } from "../api/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  onSignUpSuccess: () => void;
  onGoToLogin: () => void;
};

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignUpPage({ onSignUpSuccess, onGoToLogin }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
      errors.password = "Password must contain at least one special character";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (isLoading) return;

    setServerError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      await registerUser({ firstName, lastName, email, password, confirmPassword });

      setSuccessMessage(
        "Account created successfully! Redirecting you to sign in…"
      );

      // Brief delay so the user sees the success message, then navigate to login
      setTimeout(() => {
        onSignUpSuccess();
      }, 1800);
    } catch (err: unknown) {
      const message = getApiErrorMessage(err);
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function clearServerMessages() {
    if (serverError) setServerError(null);
    if (successMessage) setSuccessMessage(null);
  }

  function handleFieldChange<T extends keyof FieldErrors>(
    field: T,
    value: string,
    setter: (v: string) => void
  ) {
    setter(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    clearServerMessages();
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Hero & Branding Section — identical to LoginPage */}
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
            Start your journey to <span>your dream role.</span>
          </h1>

          <p className="brand-description">
            Join thousands of professionals who use CareerAI to analyze their resumes,
            boost ATS compatibility, and land more interviews with tailored, actionable insights.
          </p>

          {/* Feature Highlights Card */}
          <div className="brand-preview-card" aria-label="Platform features">
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

        {/* Right Sign-up Card Section */}
        <div className="signin-card">
          <div className="signin-header">
            <h2 className="signin-title">Create your account</h2>
            <p className="signin-subtitle">Fill in the details below to get started for free.</p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="alert-success" role="status">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
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
            {/* First Name + Last Name row */}
            <div className="form-row-two">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  className={`form-input ${fieldErrors.firstName ? "has-error" : ""}`}
                  value={firstName}
                  onChange={(e) => handleFieldChange("firstName", e.target.value, setFirstName)}
                  disabled={isLoading || !!successMessage}
                  placeholder="Abebe"
                  autoComplete="given-name"
                  aria-invalid={!!fieldErrors.firstName}
                  aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                />
                {fieldErrors.firstName && (
                  <div id="firstName-error" className="field-error-text">
                    {fieldErrors.firstName}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  className={`form-input ${fieldErrors.lastName ? "has-error" : ""}`}
                  value={lastName}
                  onChange={(e) => handleFieldChange("lastName", e.target.value, setLastName)}
                  disabled={isLoading || !!successMessage}
                  placeholder="Kebede"
                  autoComplete="family-name"
                  aria-invalid={!!fieldErrors.lastName}
                  aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                />
                {fieldErrors.lastName && (
                  <div id="lastName-error" className="field-error-text">
                    {fieldErrors.lastName}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-input ${fieldErrors.email ? "has-error" : ""}`}
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value, setEmail)}
                disabled={isLoading || !!successMessage}
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

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-input ${fieldErrors.password ? "has-error" : ""}`}
                  value={password}
                  onChange={(e) => handleFieldChange("password", e.target.value, setPassword)}
                  disabled={isLoading || !!successMessage}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading || !!successMessage}
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

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className={`form-input ${fieldErrors.confirmPassword ? "has-error" : ""}`}
                  value={confirmPassword}
                  onChange={(e) => handleFieldChange("confirmPassword", e.target.value, setConfirmPassword)}
                  disabled={isLoading || !!successMessage}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={isLoading || !!successMessage}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
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
              {fieldErrors.confirmPassword && (
                <div id="confirmPassword-error" className="field-error-text">
                  {fieldErrors.confirmPassword}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !!successMessage}
            >
              {isLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Signing up…
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Navigate to Login */}
            <p className="auth-switch-text">
              Already have an account?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={onGoToLogin}
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

