import React from "react";

export default function AqiHeader() {
  return (
    <header
      className="w-full py-1 shadow-md flex justify-center items-center"
      style={{
        background: "linear-gradient(180deg, #2e1b55, #552a7a)",
      }}
    >
      <div className="flex items-center space-x-2">
        <img
          src="https://www.aqi.in/media/misc/aqi-logo.svg"
          alt="AQI Logo"
          className="w-10 h-10"
        />
        <h1 className="text-white text-2xl font-bold">Air Quality Index</h1>
      </div>
    </header>
  );
}
