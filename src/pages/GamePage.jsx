import React from "react";
import Game from "../components/Game";

/**
 * Renders the Game page.
 */
const GamePage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Parcheesi Board</h1>
      <Game />
    </div>
  );
};

export default GamePage;
