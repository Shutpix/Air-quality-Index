import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

function healthCategoryFromAqi(aqi) {
  if (aqi == null) return { label: "Unknown", color: "#777" };
  if (aqi <= 50) return { label: "Good", color: "#009966" };
  if (aqi <= 100) return { label: "Moderate", color: "#ffde33" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "#ff9933" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#cc0033" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#660099" };
  return { label: "Hazardous", color: "#7e0023" };
}

export default function AqiSearch() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");

    try {
      //const res = await fetch(`${API_BASE}/aqi?city=${city}`);
      const res = await fetch(`${API_BASE}/api/aqi?city=${city}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-4 text-white">

      {/* Search Bar */}
      <div className="flex items-center bg-[#1f2937] rounded-xl px-4 py-3 shadow-md">
        <span className="mr-3 text-gray-400 text-xl">🔍</span>
        <input
          type="text"
          placeholder="Search any Location, City, State or Country"
          className="bg-transparent outline-none flex-grow text-gray-300"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Error */}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {/* Loading */}
      {loading && <p className="mt-4 text-gray-300">Loading...</p>}

      {/* Result */}
      {result && (
        <div className="mt-6 p-5 bg-[#111827] rounded-xl shadow">
          <h2 className="text-lg font-bold mb-2">{result.query}</h2>

          <div className="text-4xl font-semibold">{result.data.aqi}</div>

          <div
            className="mt-2 text-lg font-medium"
            style={{ color: healthCategoryFromAqi(result.data.aqi).color }}
          >
            {healthCategoryFromAqi(result.data.aqi).label}
          </div>

          <p className="mt-1 text-gray-400">
            {result.cached ? "(From cache)" : "(Live data)"}
          </p>
        </div>
      )}
    </div>
  );
}
