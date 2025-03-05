import { useState } from "react";

/**
 * Custom hook for handling game logic, including dice selection, piece movement, and hover effects.
 * @param {Object} socket - The socket instance for emitting events.
 */
const useGameLogic = (socket) => {
  const [selectedDie, setSelectedDie] = useState(null);
  const [hoveredPiece, setHoveredPiece] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);

  /**
   * Handles selecting and deselecting a die.
   */
  const handleDieSelect = (dieValue) => {
    console.log(
      `🎲 Selecting die: ${dieValue}, Previous selection: ${selectedDie}`
    );
    setSelectedDie((prev) => (prev === dieValue ? null : dieValue)); // Toggle selection
  };

  /**
   * Handles hover effect on a piece.
   * Uses lastKnownIndex to ensure accurate movement previews.
   */
  const handlePieceHover = (
    pieceId,
    piecePos,
    routes,
    player,
    lastKnownIndex
  ) => {
    setHoveredPiece(pieceId);

    if (!selectedDie) {
      console.log(`🔍 Hovering over ${pieceId}, but no die selected.`);
      setHighlightedCells([]);
      return;
    }

    console.log(`🔍 Hovering over ${pieceId}, checking movement...`);

    const path = routes[player]?.path;
    if (!path) {
      console.error(`❌ No path found for player ${player}`);
      return;
    }

    // ✅ Use lastKnownIndex if available, otherwise find piece position in path
    let currentIndex =
      lastKnownIndex ??
      path.findIndex(
        (tile) => tile.row === piecePos.row && tile.col === piecePos.col
      );

    if (currentIndex === -1) {
      console.error(`❌ ${pieceId} not found in path`);
      return;
    }

    let newIndex = currentIndex + selectedDie;
    newIndex = Math.min(newIndex, path.length - 1); // Ensure it doesn't exceed bounds

    let newTile = path[newIndex];
    if (newTile) {
      console.log(
        `✨ Hovering over ${pieceId}: Moving to ${newTile.row}, ${newTile.col}`
      );
      setHighlightedCells([newTile]);
    }
  };

  /**
   * Clears the highlighted cells when the hover ends.
   */
  const handlePieceLeave = () => {
    setHoveredPiece(null);
    setHighlightedCells([]);
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

    // ✅ Send move request to the server (server handles movement logic)
    socket.emit(
      "piece-clicked",
      { pieceId, player, diceValue: selectedDie },
      (response) => {
        if (!response.success) {
          console.error("❌ Move rejected:", response.message);
        } else {
          setDiceValues((prev) => prev.filter((d) => d !== selectedDie));
          setSelectedDie(null);
          setHighlightedCells([]); // Clear highlights after moving
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
    handlePieceHover,
    handlePieceLeave,
    highlightedCells,
  };
};

export default useGameLogic;
