import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";
import backgroundImage from "../assets/parcheesi_background.jpg";
import ParcheesiHeader from "../components/ParcheesiHeader.jsx";

/**
 * Menu Page - Main Navigation
 */
const MenuPage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const userEmail = user?.email || "Player";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Header */}
      <div className="mt-6">
        <ParcheesiHeader />
      </div>

      {/* Title */}
      <h1 className="text-white text-center text-shadow-lg text-3xl font-semibold absolute top-40 left-1/2 transform -translate-x-1/2 z-20">
        Welcome, {userEmail?.split("@")[0]}!
      </h1>

      {/* Menu box */}
      <div className="flex justify-center items-center flex-1 w-full">
        <div className="relative bg-[#d8f8f3] bg-opacity-90 rounded-2xl px-10 py-12 shadow-xl w-full max-w-md text-center border-2 border-[#42aaca]">
          {/* Floating tab-style label */}
          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#d8f8f3] px-8 py-2 min-w-[300px] rounded-xl border-2 border-[#42aaca] shadow text-xl font-bold text-gray-800">
            Choose An Option
          </div>

          {/* Menu options */}
          <div className="flex flex-col space-y-10 mt-8">
            <button
              onClick={() => navigate("/lobby")}
              className="w-full px-4 py-3 text-black bg-[#A3DEE7] rounded-full hover:brightness-95 transition font-bold border border-[#42aaca] shadow-sm"
            >
              Start New Game
            </button>

            <button
              onClick={() => navigate("/stats")}
              className="w-full px-4 py-3 bg-[#cfede8] text-black rounded-full hover:brightness-95 transition font-bold border border-[#42aaca] shadow-sm"
            >
              My Stats
            </button>

            <button
              onClick={() => navigate("/tutorial")}
              className="w-full px-4 py-3 bg-[#cfede8] text-black rounded-full hover:brightness-95 transition font-bold border border-[#42aaca] shadow-sm"
            >
              View Tutorial
            </button>

            <button
              onClick={() => navigate("/Settings")}
              className="w-full px-4 py-3 bg-[#cfede8] text-black rounded-full hover:brightness-95 transition font-bold border border-[#42aaca] shadow-sm"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
