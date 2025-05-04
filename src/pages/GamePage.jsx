import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";
import { signOut } from "../api/auth";
import Game from "../components/Game";
import backgroundImage from "../assets/parcheesi_background.jpg";

//TODO: create each of the 4 profiles in the 4 corners
//make each of them their own components, i.e. profile image components

/**
 * Renders the Game page.
 */
const GamePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect unauthorized users
    }
  }, [user, navigate]);

  if (!user) return null; // Prevents rendering before redirect

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      setUser(null); // Clear user state
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-screen min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Game Component */}
      <Game handleSignOut={handleSignOut} />

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="fixed top-4 right-6 px-4 py-2 bg-[#CFEDE8] text-black rounded hover:brightness-95 transition z-50"
      >
        Sign Out
      </button>
    </div>
  );
};

export default GamePage;
