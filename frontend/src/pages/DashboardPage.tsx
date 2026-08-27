import { useEffect, useState } from "react";
import { api } from "../api/client";

type Props = {
  onLogout: () => void;
};

export function DashboardPage({ onLogout }: Props) {
  const [health, setHealth] = useState<string>("checking…");

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setHealth(res.data.status === "ok" ? "API is healthy" : "Unexpected health response"))
      .catch(() => setHealth("API is unreachable"));
  }, []);

  return (
    <main className="page">
      <div className="card">
        <h1>Dashboard</h1>
        <p>{health}</p>
        <button type="button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </main>
  );
}
