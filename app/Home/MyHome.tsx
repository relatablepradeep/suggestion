"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.style.background = dark
      ? "radial-gradient(circle at top left, #1e1b4b, #020617)"
      : "radial-gradient(circle at top left, #e0e7ff, #ffffff)";
  }, [dark]);

  async function handleSubmit() {
    try {
      setLoading(true);
      setError("");
      setMovies([]);

      const res = await fetch(
        "https://brain-stomer-lv5q.onrender.com/api/recommend",
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
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: dark ? "#e5e7eb" : "#111827",
      }}
    >
      {/* ORBS */}
      <div className="orb orb1" />
      <div className="orb orb2" />

      <div
        style={{
          zIndex: 1,
          width: 360,
          padding: 24,
          borderRadius: 16,
          background: dark
            ? "rgba(15,23,42,0.85)"
            : "rgba(255,255,255,0.9)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>🎬 Movie AI</h1>
          <button onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Romantic, Sci-Fi, Thriller..."
          style={{
            width: "100%",
            padding: 10,
            marginTop: 12,
            borderRadius: 8,
            border: "1px solid #c7d2fe",
            background: dark ? "#020617" : "#fff",
            color: dark ? "#fff" : "#000",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 12,
            padding: 10,
            borderRadius: 8,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Finding movies..." : "Recommend"}
        </button>

        {error && (
          <p style={{ color: "#ef4444", marginTop: 10 }}>{error}</p>
        )}

        <ul style={{ marginTop: 16 }}>
          {movies.map((m, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              🍿 {m}
            </li>
          ))}
        </ul>
      </div>

      {/* STYLES */}
      <style>{`
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.6;
          animation: float 10s infinite ease-in-out;
        }
        .orb1 {
          width: 300px;
          height: 300px;
          background: #6366f1;
          top: 10%;
          left: 10%;
        }
        .orb2 {
          width: 260px;
          height: 260px;
          background: #22d3ee;
          bottom: 10%;
          right: 10%;
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
    </main>
  );
}
