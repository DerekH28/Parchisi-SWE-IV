import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

/**
 * Home page with authentication-based navigation.
 */
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users to the game page
  useEffect(() => {
    if (user) {
      navigate("/game");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-w-screen min-h-screen bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold">Welcome to the Game</h1>

      {!user ? (
        <Link
          to="/login"
          className="px-6 py-3 text-white bg-black rounded inline-block"
        >
          Sign Up / Login
        </Link>
      ) : (
        <Link to="/game" className="px-6 py-3 text-white bg-blue-600 rounded">
          Start Game
        </Link>
      )}
    </div>
  );
};

export default Home;
