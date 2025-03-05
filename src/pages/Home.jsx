import React from "react";
import { Link } from "react-router-dom";

/**
 * Simple home page with navigation to the game.
 */
const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold">Welcome to the Game</h1>
      <Link to="/game" className="px-6 py-3 text-white bg-blue-600 rounded">
        Start Game
      </Link>
    </div>
  );
};

export default Home;
