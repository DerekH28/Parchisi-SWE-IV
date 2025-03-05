import { useState } from "react";

/**
 * Custom hook for handling game logic, including dice selection, piece movement, and hover effects.
 * @param {Object} socket - The socket instance for emitting events.
 */
const useGameLogic = (socket) => {
  const [selectedDice, setSelectedDice] = useState([]); // Supports multiple selections
  const [hoveredPiece, setHoveredPiece] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);

  /**
   * Handles selecting and deselecting a die by its unique index.
   */
  const handleDieSelect = (dieIndex) => {
    setSelectedDice((prev) =>
      prev.includes(dieIndex)
        ? prev.filter((id) => id !== dieIndex)
        : [...prev, dieIndex]
    );
  };

  /**
   * Handles hover effect on a piece, using the sum of selected dice values.
   */
  const handlePieceHover = (
    pieceId,
    piecePos,
    routes,
    player,
    lastKnownIndex,
    diceValues
  ) => {
    setHoveredPiece(pieceId);

    if (selectedDice.length === 0) {
      setHighlightedCells([]);
      return;
    }

    if (!diceValues || diceValues.length === 0) return;

    const path = routes[player]?.path;
    if (!path) return;

    // Ensure `lastKnownIndex` is a number, otherwise find piece position in path
    let currentIndex =
      typeof lastKnownIndex === "number"
        ? lastKnownIndex
        : path.findIndex(
            (tile) => tile.row === piecePos.row && tile.col === piecePos.col
          );

    if (typeof currentIndex !== "number" || currentIndex === -1) return;

    // Calculate total move distance based on selected dice
    const moveDistance = selectedDice.reduce(
      (sum, index) => sum + (diceValues[index] || 0),
      0
    );

    if (isNaN(moveDistance) || moveDistance <= 0) return;

    let newIndex = Math.min(currentIndex + moveDistance, path.length - 1);
    let newTile = path[newIndex];

    if (newTile) setHighlightedCells([newTile]);
    else setHighlightedCells([]);
  };

  /**
   * Clears the highlighted cells when the hover ends.
   */
  const handlePieceLeave = () => {
    setHoveredPiece(null);
    setHighlightedCells([]);
  };

  /**
   * Handles when a piece is clicked, sending total move request.
   */
  const handlePieceClick = (
    pieceId,
    player,
    currentTurn,
    setDiceValues,
    diceValues
  ) => {
    if (!player || selectedDice.length === 0 || player !== currentTurn) return;
    if (!diceValues || diceValues.length === 0) return;

    const moveDistance = selectedDice.reduce(
      (sum, index) => sum + (diceValues[index] || 0),
      0
    );

    if (isNaN(moveDistance) || moveDistance <= 0) return;

    // Send move request to the server
    socket.emit(
      "piece-clicked",
      { pieceId, player, diceValue: moveDistance },
      (response) => {
        if (response.success) {
          setDiceValues((prev) =>
            prev.filter((_, i) => !selectedDice.includes(i))
          );
          setSelectedDice([]); // Clear selected dice after move
          setHighlightedCells([]); // Clear highlights after moving
        }
      }
    );
  };

  /**
   * Resets dice selection when a new roll happens.
   */
  const resetDiceSelection = () => {
    setSelectedDice([]);
  };

  return {
    handleDieSelect,
    handlePieceClick,
    resetDiceSelection,
    selectedDice,
    hoveredPiece,
    setHoveredPiece,
    handlePieceHover,
    handlePieceLeave,
    highlightedCells,
  };
};

export default useGameLogic;
