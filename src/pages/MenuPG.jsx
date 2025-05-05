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
      <h1 className="text-white text-center text-3xl font-semibold absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
        Welcome, {userEmail}!
      </h1>

      {/* Menu box */}
      <div className="flex justify-center mt-45 w-full">
        <div className="relative bg-[#d8f8f3] bg-opacity-90 rounded-none px-8 py-20 shadow-md w-96 text-center border-[3px] border-[#42aaca]">
          {/* Floating tab-style label */}
          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#d8f8f3] px-6 py-1 min-w-[300px] rounded-none border-[3px] border-[#42aaca] shadow text-xl font-bold text-gray-800">
            Choose An Option
          </div>

          {/* Menu options */}
          <div className="flex flex-col space-y-10">
            <button
              onClick={() => navigate("/lobby")}
              className="w-68 mx-auto px-4 py-3 text-black bg-[#A3DEE7] rounded-full hover:brightness-95 transition font-semibold"
            >
              Start New Game
            </button>

            <button
              onClick={() => navigate("/stats")}
              className="w-68 mx-auto px-4 py-3 bg-[#cfede8] text-black rounded-full hover:brightness-95 transition font-semibold"
            >
              My Stats
            </button>

            <button
              onClick={() => navigate("/tutorial")}
              className="w-68 mx-auto px-4 py-3 bg-[#cfede8] text-black rounded-full hover:brightness-95 transition font-semibold"
            >
              View Tutorial
            </button>

            <button
              onClick={() => navigate("/Settings")}
              className="w-68 mx-auto px-4 py-3 bg-[#cfede8] text-black rounded-full hover:brightness-95 transition font-semibold"
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
