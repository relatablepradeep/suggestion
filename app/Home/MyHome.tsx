"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://brain-stomer-cc50.onrender.com/api/recommend",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await res.json();
      setMovies(data.movies || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>🎬 Movie Recommendation</h1>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter movie type..."
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Loading..." : "Recommend"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {movies.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </main>
  );
}
