import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/parcheesi_background.jpg";
import ParcheesiHeader from "../components/ParcheesiHeader.jsx";

/**
 * Settings page for accessibility.
 */
const Settings = () => {
  const navigate = useNavigate();
  const [colorBlindMode, setColorBlindMode] = useState("None");

  const handleChange = (e) => {
    const mode = e.target.value;
    setColorBlindMode(mode);
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
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="mt-6 mb-4">
        <ParcheesiHeader />
      </div>

      <div className="flex flex-1 items-center justify-center w-full px-4 py-10">
        <div className="bg-[#D8F8F3] px-6 py-10 shadow-md w-full max-w-md">
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
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-[#50B4D4]"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => navigate("/menu")}
            className="mt-6 px-4 py-2 bg-gray-200 rounded-full shadow"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
