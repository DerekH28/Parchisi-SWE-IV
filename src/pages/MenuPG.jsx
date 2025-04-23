import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Menu Page - Main Navigation
 */
const MenuPage = () => {
const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      {/* Center wrapper with fixed width */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-8">Main Menu</h1>

        <button
          onClick={() => navigate("/GameOptions")}
          className="w-full px-6 py-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
        >
          Create / Join Game
        </button>

        <button
          onClick={() => navigate("/Settings")}
          className="w-full px-6 py-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition mt-4"
        >
          Settings
        </button>

        <button
          onClick={() => navigate("/tutorial")}
          className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition mt-4"
        >
          Tutorial
        </button>

        <button
          onClick={() => navigate("/stats")}
          className="w-full px-6 py-4 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition mt-4"
        >
          Stats
        </button>
      </div>
    </div>
  );
};

export default MenuPage;
