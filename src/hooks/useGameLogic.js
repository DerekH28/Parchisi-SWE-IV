import { useState } from "react";

/**
 * Custom hook for handling game logic, including dice selection and piece movement.
 * @param {Object} socket - The socket instance for emitting events.
 */
const useGameLogic = (socket) => {
  const [selectedDie, setSelectedDie] = useState(null);
  const [hoveredPiece, setHoveredPiece] = useState(null);

  /**
   * Handles selecting and deselecting a die.
   * Clicking the same die twice will deselect it.
   */
  const handleDieSelect = (dieValue) => {
    console.log(
      `🎲 Selecting die: ${dieValue}, Previous selection: ${selectedDie}`
    );
    setSelectedDie((prev) => (prev === dieValue ? null : dieValue)); // Toggle selection
  };

  /**
   * Handles when a piece is clicked.
   * Ensures a die is selected and it's the player's turn before making a move.
   */
  const handlePieceClick = (pieceId, player, currentTurn, setDiceValues) => {
    if (!player) return;
    if (selectedDie == null) {
      console.error("❌ You must select a die value first!");
      return;
    }
    if (player !== currentTurn) {
      console.error("❌ Not your turn!");
      return;
    }

    console.log(
      `🔹 Sending piece-clicked for ${pieceId} with selected die ${selectedDie}`
    );

    socket.emit(
      "piece-clicked",
      { pieceId, player, diceValue: selectedDie },
      (response) => {
        if (!response.success) {
          console.error("❌ Move rejected:", response.message);
        } else {
          setDiceValues((prev) => prev.filter((d) => d !== selectedDie));
          setSelectedDie(null);
        }
      }
    );
  };

  return {
    handleDieSelect,
    handlePieceClick,
    selectedDie,
    hoveredPiece,
    setHoveredPiece,
  };
};

export default useGameLogic;
