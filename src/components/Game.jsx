import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import useGameLogic from "../hooks/useGameLogic";
import Board from "./Board";
import { routes } from "../util/routes";
import ParcheesiHeader from "../components/ParcheesiHeader.jsx";
import Dice from "./Dice";

const Game = () => {
  const [notification, setNotification] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const { socket, player, diceValues, currentTurn, positions, setDiceValues } =
    useSocket();

  // Add debugging useEffect
  useEffect(() => {
    console.log("Game component state:", {
      player,
      currentTurn,
      positions,
      diceValues,
    });
  }, [player, currentTurn, positions, diceValues]);

  // Listen for win events
  useEffect(() => {
    if (!socket) return;

    socket.on("game-won", (winningPlayer) => {
      setWinner(winningPlayer);
    });

    return () => {
      socket.off("game-won");
    };
  }, [socket]);

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
   * Shows a notification message that automatically disappears after 3 seconds
   */
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  /**
   * Handles rolling dice, ensuring only the current player can roll.
   */
  const rollDice = () => {
    if (!player) {
      showNotification("❌ You must be assigned a player color first!");
      return;
    }
    if (player !== currentTurn) {
      showNotification("❌ Not your turn to roll dice!");
      return;
    }
    console.log(`🎲 ${player} rolling dice...`);
    setIsRolling(true);
    socket.emit("roll-dice", player, (response) => {
      if (!response.success) {
        showNotification(`❌ Dice roll failed: ${response.message}`);
        setIsRolling(false);
      } else {
        setDiceValues(response.dice);
        resetDiceSelection();
        setTimeout(() => setIsRolling(false), 1000);

        // Check if player has any valid moves
        const hasValidMoves = checkForValidMoves(response.dice);
        if (!hasValidMoves) {
          showNotification("⚠️ No valid moves available with this roll!");
        }
      }
    });
  };

  /**
   * Checks if the player has any valid moves with the current dice roll
   */
  const checkForValidMoves = (dice) => {
    if (!player || !positions[player]) return false;

    const playerPieces = positions[player];
    const path = routes[player]?.path;

    if (!path) return false;

    // Check if any piece can leave home (requires a 5)
    const canLeaveHome = playerPieces.some((piece) => {
      if (!piece.inHome) return false;

      // Check if any die value is 5
      const canLeaveWithIndividualDice = dice.includes(5);

      // Check if sum of dice is 5
      const sumOfDice = dice.reduce((sum, die) => sum + die, 0);
      const canLeaveWithSum = sumOfDice === 5;

      return canLeaveWithIndividualDice || canLeaveWithSum;
    });

    // Check if any piece on the board can move
    const canMoveOnBoard = playerPieces.some((piece) => {
      if (piece.inHome) return false;

      const currentIndex = piece.lastKnownIndex;
      if (currentIndex === undefined || currentIndex === -1) return false;

      // Check individual die values
      const canMoveWithIndividualDice = dice.some((dieValue) => {
        const newIndex = currentIndex + dieValue;
        return newIndex < path.length && newIndex >= 0;
      });

      // Check sum of dice
      const sumOfDice = dice.reduce((sum, die) => sum + die, 0);
      const canMoveWithSum =
        currentIndex + sumOfDice < path.length && currentIndex + sumOfDice >= 0;

      return canMoveWithIndividualDice || canMoveWithSum;
    });

    const hasValidMoves = canLeaveHome || canMoveOnBoard;

    // Debug logging
    console.log("Move validation:", {
      player,
      dice,
      canLeaveHome,
      canMoveOnBoard,
      hasValidMoves,
    });

    return hasValidMoves;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mt-6 mb-2">
        <ParcheesiHeader />
      </div>
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out">
            <p className="text-lg font-semibold">{notification}</p>
          </div>
        </div>
      )}

      {winner && (
        <div       className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out">
            <h2 className="text-3xl text-black font-bold text-center mb-4">
              🎉 Game Over! 🎉
            </h2>
            <p className="text-xl text-black text-center mb-6">
              {winner.toUpperCase()} has won the game!
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Exit Game
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="mt-12 text-3xl font-bold text-white">
        {player
          ? `You are Player: ${String(player).toUpperCase()}`
          : "Waiting for player assignment..."}
      </h2>
      <p className="mb-2 text-white">
        {currentTurn
          ? `It is ${String(currentTurn).toUpperCase()}'s turn.`
          : "Waiting for turn information..."}
      </p>

      <Board
        piecePositions={positions}
        routes={routes}
        onPieceClick={(pieceId) => {
          const result = handlePieceClick(
            pieceId,
            String(player),
            currentTurn,
            setDiceValues,
            diceValues
          );
          if (result && !result.success) {
            showNotification(result.message);
          }
        }}
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
        currentPlayer={player}
      />

      <button
        onClick={rollDice}
        className={`px-4 py-2 mt-2 text-black font-bold rounded ${
          player === currentTurn ? "bg-[#A3DEE7]" : "bg-gray-500"
        }`}
      >
        Roll Dice
      </button>
      {diceValues.length > 0 && (
        <div className="mt-2 flex flex-col items-center">
          <div className="flex gap-4">
            {diceValues.map((die, index) => (
              <Dice
                key={index}
                value={die}
                isSelected={selectedDice.includes(index)}
                onClick={() => handleDieSelect(index)}
                isRolling={isRolling}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
