import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Settings page for accessibility.
 */
const Settings = () => {
  const navigate = useNavigate();
  const [colorBlindMode, setColorBlindMode] = useState("None");

  const handleChange = (e) => {
    const mode = e.target.value;
    setColorBlindMode(mode);
    // Later: Apply color-blind-friendly theme here
    alert(`Color blindness mode selected: ${mode}`);
  };

  const options = [
    { label: "None (Default Colors)", value: "None" },
    { label: "Protanopia (Red-Weak)", value: "Protanopia" },
    { label: "Deuteranopia (Green-Weak)", value: "Deuteranopia" },
    { label: "Tritanopia (Blue-Weak)", value: "Tritanopia" },
    { label: "Achromatopsia (Total Color Blindness)", value: "Achromatopsia" },
  ];

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-auto">
      {/* Exit button */}
      <button
        onClick={() => navigate("/menu")}
        className="absolute top-4 left-4 px-3 py-1 bg-white border border-gray-400 rounded shadow"
      >
        EXIT
      </button>

      {/* Centered content wrapper */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Accessibility Settings
          </h1>
          <div className="w-full">
            <label
              htmlFor="color-mode"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Color Blindness Mode
            </label>
            <select
              id="color-mode"
              value={colorBlindMode}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
