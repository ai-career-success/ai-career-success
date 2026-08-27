import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import "./index.css";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return (
    <DashboardPage
      onLogout={() => {
        localStorage.removeItem("accessToken");
        setToken(null);
      }}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
