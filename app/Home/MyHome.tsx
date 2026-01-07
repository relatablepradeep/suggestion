"use client";
import { useState } from "react";

export default function MyHome() {
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState<string[]>([]);

  async function handleSubmit() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recommend`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      }
    );

    const data = await res.json();
    setMovies(data.movies);
  }

  return (
    <div>
      <input
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Enter movie type..."
      />
      <button onClick={handleSubmit}>Recommend</button>

      <ul>
        {movies.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
    </div>
  );
}
