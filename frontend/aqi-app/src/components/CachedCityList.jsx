import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export default function CachedCityList() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCachedCities = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/aqi/list?page=1&limit=20`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setCities(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-[#111827] text-white rounded-xl shadow">
      <button
        onClick={fetchCachedCities}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
      >
        Show Recent Cities
      </button>

      {loading && <p className="mt-3 text-gray-300">Loading...</p>}
      {error && <p className="mt-3 text-red-400">{error}</p>}

      {cities.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Recently Checked Cities</h3>
          <ul className="space-y-1">
            {cities.map((c, index) => (
              <li
                key={index}
                className="bg-[#1f2937] px-3 py-2 rounded-md flex justify-between"
              >
                <span className="capitalize">{c.city}</span>
                <span className="text-gray-400">AQI: {c.data.aqi}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
