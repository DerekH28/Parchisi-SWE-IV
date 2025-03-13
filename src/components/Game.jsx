import React from "react";
import useSocket from "../hooks/useSocket";
import useGameLogic from "../hooks/useGameLogic";
import Board from "./Board";
import { routes } from "../util/routes";

const Game = () => {
  const { socket, player, diceValues, currentTurn, positions, setDiceValues } =
    useSocket();
  const {
    handleDieSelect,
    handlePieceClick,
    selectedDice,
    hoveredPiece,
    handlePieceHover,
    handlePieceLeave,
    highlightedCells,
    resetDiceSelection,
  } = useGameLogic(socket);

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
        resetDiceSelection();
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-xl font-bold">
        {player
          ? `You are Player: ${String(player).toUpperCase()}`
          : "Waiting for player assignment..."}
      </h2>
      <p className="mb-2">
        {currentTurn
          ? `It is ${String(currentTurn).toUpperCase()}'s turn.`
          : "Waiting for turn information..."}
      </p>

      <Board
        piecePositions={positions}
        routes={routes}
        onPieceClick={(pieceId) =>
          handlePieceClick(
            pieceId,
            String(player),
            currentTurn,
            setDiceValues,
            diceValues
          )
        }
        handlePieceHover={(pieceId, piecePos, lastKnownIndex) =>
          handlePieceHover(
            pieceId,
            piecePos,
            routes,
            String(player),
            lastKnownIndex,
            diceValues
          )
        }
        handlePieceLeave={handlePieceLeave}
        highlightedCells={highlightedCells}
        hoveredPiece={hoveredPiece}
      />

      <button
        onClick={rollDice}
        className={`px-4 py-2 mt-4 text-white rounded ${
          player === currentTurn ? "bg-blue-500" : "bg-gray-500"
        }`}
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
                onClick={() => handleDieSelect(index)}
                className={`px-3 py-1 border rounded ${
                  selectedDice.includes(index)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Use {die}
              </button>
            ))}
          </div>
          {selectedDice.length > 0 && (
            <p className="mt-2">
              ✅ Selected Move:{" "}
              {selectedDice.reduce((sum, idx) => sum + diceValues[idx], 0)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
