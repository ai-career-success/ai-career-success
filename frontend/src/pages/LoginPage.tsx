import { FormEvent, useState } from "react";
import { api } from "../api/client";

type Props = {
  onLogin: (token: string) => void;
};

export function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      onLogin(data.accessToken);
    } catch (err: unknown) {
      const message =
        axiosError(err) || "Login failed. Fill JWT secrets in backend/.env before auth will work.";
      setError(message);
    }
  }

  return (
    <main className="page">
      <div className="card">
        <h1>AI Career Success Platform</h1>
        <p>Sign in to continue.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit">Log in</button>
        </form>
      </div>
    </main>
  );
}

function axiosError(err: unknown): string | null {
  if (typeof err === "object" && err && "response" in err) {
    const response = (err as { response?: { data?: { error?: string } } }).response;
    return response?.data?.error ?? null;
  }
  return null;
}
