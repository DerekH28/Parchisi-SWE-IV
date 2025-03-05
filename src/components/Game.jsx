import React from "react";
import useSocket from "../hooks/useSocket";
import useGameLogic from "../hooks/useGameLogic";
import Board from "./Board";

const Game = () => {
  const { socket, player, diceValues, currentTurn, positions, setDiceValues } =
    useSocket();
  const { handleDieSelect, handlePieceClick, selectedDie } =
    useGameLogic(socket);

  /**
   * Handles rolling dice, ensuring only the current player can roll.
   */
  const rollDice = () => {
    if (!player) return;
    if (player !== currentTurn) {
      console.error("❌ Not your turn to roll dice!");
      return;
    }
    console.log(`🎲 ${player} rolling dice...`);
    socket.emit("roll-dice", player, (response) => {
      if (!response.success) {
        console.error("❌ Dice roll failed:", response.message);
      } else {
        setDiceValues(response.dice);
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-xl font-bold">
        {player
          ? `You are Player: ${player.toUpperCase()}`
          : "Waiting for player assignment..."}
      </h2>
      <p className="mb-2">
        {currentTurn
          ? `It is ${currentTurn.toUpperCase()}'s turn.`
          : "Waiting for turn information..."}
      </p>
      <Board
        piecePositions={positions}
        onPieceClick={(pieceId) =>
          handlePieceClick(pieceId, player, currentTurn, setDiceValues)
        }
      />
      <button
        onClick={rollDice}
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
      >
        Roll Dice
      </button>
      {diceValues.length > 0 && (
        <div className="mt-2">
          <p>🎲 Dice Rolled: {diceValues.join(" and ")}</p>
          <div className="flex gap-2">
            {diceValues.map((die, index) => (
              <button
                key={index}
                onClick={() => handleDieSelect(die)}
                className={`px-3 py-1 border rounded ${
                  selectedDie === die
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Use {die}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
