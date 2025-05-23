import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";
import { signOut } from "../api/auth";
import Game from "../components/Game";
import backgroundImage from "../assets/parcheesi_background.jpg";
import TutorialModal from "../components/TutorialModal";

/**
 * Renders the Game page.
 */
const GamePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);

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
      {/* Tutorial Button */}
      <button
        onClick={() => setShowTutorial(true)}
        className="fixed top-4 right-36 px-4 py-2 bg-[#A3DEE7] text-black rounded hover:brightness-95 transition z-50"
      >
        Tutorial
      </button>
      {/* Tutorial Modal */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </div>
  );
};

export default GamePage;
