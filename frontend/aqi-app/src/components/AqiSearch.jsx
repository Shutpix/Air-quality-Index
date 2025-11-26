import React, { useState, useEffect } from "react";

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

  // 🔥 Auto hide error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/aqi?city=${city}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          "Oops! City not found, we are working on it…"
        );
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 p-4 text-white">

      {/* Search Bar */}
      <div className="flex items-center bg-[#1f2937] rounded-xl px-4 py-3 shadow-md">
        <span className="mr-3 text-gray-400 text-xl">🔍</span>
        <input
          type="text"
          placeholder="Search any City...."
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

      {/* 🌟 BEAUTIFUL AUTO-FADE ERROR MESSAGE */}
      {error && (
        <div className="mt-4 text-red-300 bg-red-900/20 border border-red-600 px-4 py-2 rounded-lg animate-fade">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <p className="mt-4 text-gray-300">Loading...</p>}

      {/* ---------- AQI RESULT CARD ---------- */}
      {result && (
        <div className="mt-10 bg-gradient-to-b from-[#3c225f] to-[#6f2d8e] p-8 rounded-3xl shadow-xl">

          {/* Title */}
          <h2 className="text-2xl font-bold">{result.query}</h2>
          <p className="text-gray-300 text-sm italic mt-1">
            {result.cached ? "(From Cache)" : "(Live Data)"}
          </p>

          <div className="flex justify-between items-start mt-6">

            {/* Left AQI Value */}
            <div>
              <p className="text-orange-400 font-medium flex items-center">
                <span className="mr-2 text-lg">●</span> Live AQI
              </p>

              <h2 className="text-8xl font-bold text-pink-300 mt-2">
                {result.data.aqi}
              </h2>

              <p className="text-sm text-gray-300 mt-1">(AQI-US)</p>
            </div>

            {/* Category Box */}
            <div className="bg-purple-700/40 px-10 py-4 rounded-xl text-center">
              <p className="text-gray-300 text-sm">Air Quality is</p>
              <p className="text-3xl font-semibold text-pink-200">
                {healthCategoryFromAqi(result.data.aqi).label}
              </p>
            </div>

          </div>

          {/* PM Values */}
          <div className="flex justify-between text-lg font-semibold text-gray-200 mt-8">
            <p>
              PM10 : <span className="text-white">{result.data.pm10} µg/m³</span>
            </p>
            <p>
              PM2.5 : <span className="text-white">{result.data.pm25} µg/m³</span>
            </p>
          </div>

          {/* Scale */}
          <div className="mt-10">
            <div className="flex justify-between text-sm text-gray-200 mb-1 px-1">
              <span>Good</span>
              <span>Moderate</span>
              <span>Poor</span>
              <span>Unhealthy</span>
              <span>Severe</span>
              <span>Hazardous</span>
            </div>

            <div className="w-full h-2 rounded-full bg-gradient-to-r
              from-green-500 via-yellow-400 via-orange-400 via-red-500 via-pink-600 to-purple-900">
            </div>

            {/* Marker */}
            <div
              className="h-5 w-5 bg-pink-300 rounded-full border-2 border-white shadow-md mt-2"
              style={{
                marginLeft: `${Math.min((result.data.aqi / 350) * 100, 100)}%`
              }}
            ></div>

            <div className="flex justify-between text-sm text-gray-300 mt-1 px-1">
              <span>0</span><span>50</span><span>100</span><span>150</span>
              <span>200</span><span>300</span><span>301+</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
