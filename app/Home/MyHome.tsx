"use client";

import { useState } from "react";
import { Moon, Sun, Film } from "lucide-react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  async function handleSubmit() {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError("");
      setMovies([]);

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
      setActiveIndex(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % movies.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-4 right-4 p-2 rounded-lg ${
          darkMode ? "bg-gray-800 text-yellow-400" : "bg-white text-gray-700"
        } shadow-lg`}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            🎬 Movie Finder
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Get AI-powered movie recommendations
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className={`rounded-lg shadow-lg p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="What kind of movie do you want?"
              className={`w-full px-4 py-3 rounded-lg mb-3 ${
                darkMode 
                  ? "bg-gray-700 text-white placeholder-gray-400" 
                  : "bg-gray-100 text-gray-800 placeholder-gray-500"
              } outline-none`}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className={`w-full py-3 rounded-lg font-semibold ${
                loading || !prompt.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-500 hover:bg-purple-600"
              } text-white`}
            >
              {loading ? "Loading..." : "Get Recommendations"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-100 text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Carousel */}
        {movies.length > 0 && (
          <div>
            <div className="relative h-80 mb-6">
              {movies.map((movie, index) => {
                const isActive = index === activeIndex;
                const offset = index - activeIndex;
                
                return (
                  <div
                    key={index}
                    style={{
                      transform: `translateX(${offset * 100}%) scale(${isActive ? 1 : 0.8})`,
                      opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.3,
                      zIndex: isActive ? 10 : 1,
                    }}
                    className={`absolute inset-0 transition-all duration-500 rounded-xl p-8 ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } shadow-xl`}
                  >
                    <div className="flex flex-col h-full justify-center items-center text-center">
                      <div className="text-5xl mb-4">🎬</div>
                      <h3 className={`text-2xl font-bold mb-4 ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}>
                        {movie}
                      </h3>
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                        {index + 1} of {movies.length}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePrev}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                } shadow-lg`}
              >
                ← Prev
              </button>
              <button
                onClick={handleNext}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                } shadow-lg`}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && !error && (
          <div className="text-center py-16">
            <Film className={`mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} size={48} />
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Enter your movie preference above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}