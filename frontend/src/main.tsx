import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { getStoredToken, removeStoredToken } from "./api/client";
import "./index.css";

type View = "login" | "signup" | "dashboard";

function getInitialView(hasToken: boolean): View {
  if (hasToken) return "dashboard";
  const path = window.location.pathname.toLowerCase();
  if (path === "/signup" || path === "/register") {
    return "signup";
  }
  return "login";
}

function App() {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [view, setView] = useState<View>(() => getInitialView(!!getStoredToken()));

  useEffect(() => {
    const handlePopState = () => {
      const currentToken = getStoredToken();
      setToken(currentToken);
      setView(getInitialView(!!currentToken));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigateTo(target: View) {
    setView(target);
    if (target === "signup") {
      if (window.location.pathname.toLowerCase() !== "/signup") {
        window.history.pushState({}, "", "/signup");
      }
    } else if (target === "login") {
      if (window.location.pathname.toLowerCase() !== "/login" && window.location.pathname !== "/") {
        window.history.pushState({}, "", "/login");
      }
    } else if (target === "dashboard") {
      if (window.location.pathname !== "/" && window.location.pathname.toLowerCase() !== "/dashboard") {
        window.history.pushState({}, "", "/");
      }
    }
  }

  if (token && view === "dashboard") {
    return (
      <DashboardPage
        onLogout={() => {
          removeStoredToken();
          setToken(null);
          navigateTo("login");
        }}
      />
    );
  }

  if (view === "signup") {
    return (
      <SignUpPage
        onSignUpSuccess={() => navigateTo("login")}
        onGoToLogin={() => navigateTo("login")}
      />
    );
  }

  // Default: login view
  return (
    <LoginPage
      onLogin={(newToken) => {
        setToken(newToken);
        navigateTo("dashboard");
      }}
      onGoToSignUp={() => navigateTo("signup")}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
