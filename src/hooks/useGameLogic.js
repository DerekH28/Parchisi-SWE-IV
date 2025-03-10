import { useState } from "react";
import { handleDieSelect, resetDiceSelection } from "../util/diceLogic";
import {
  handlePieceHover,
  handlePieceLeave,
  handlePieceClick,
} from "../util/pieceLogic";

/**
 * Custom hook for handling game logic, including dice selection, piece movement, and hover effects.
 * Manages UI interactions for dice selection, piece hover effects, and piece movement.
 *
 * @param {Object} socket - The socket instance for emitting game-related events.
 * @returns {Object} - Object containing game state and handler functions.
 */
const useGameLogic = (socket) => {
  const [selectedDice, setSelectedDice] = useState([]); // Array of selected dice indices
  const [hoveredPiece, setHoveredPiece] = useState(null); // Currently hovered piece
  const [highlightedCells, setHighlightedCells] = useState([]); // Highlighted board cells for movement preview

  /**
   * Wrapper for handling die selection, ensuring the state is updated correctly.
   * @param {number} dieIndex - Index of the die being selected/deselected.
   */
  const handleDieSelectWrapper = (dieIndex) => {
    handleDieSelect(dieIndex, selectedDice, setSelectedDice);
  };

  /**
   * Wrapper for handling piece hover, calculating movement preview based on selected dice.
   * @param {string} pieceId - Unique identifier for the piece.
   * @param {Object} piecePos - Current position of the piece (row, col).
   * @param {Object} routes - Object containing movement paths for each player.
   * @param {string} player - The current player.
   * @param {number} lastKnownIndex - The last known index of the piece in its movement path.
   * @param {number[]} diceValues - Array of rolled dice values.
   */
  const handlePieceHoverWrapper = (
    pieceId,
    piecePos,
    routes,
    player,
    lastKnownIndex,
    diceValues
  ) => {
    handlePieceHover(
      pieceId,
      piecePos,
      routes,
      player,
      lastKnownIndex,
      diceValues,
      selectedDice,
      setHoveredPiece,
      setHighlightedCells
    );
  };

  /**
   * Wrapper to clear hover effects when the cursor leaves a piece.
   */
  const handlePieceLeaveWrapper = () => {
    handlePieceLeave(setHoveredPiece, setHighlightedCells);
  };

  /**
   * Wrapper for handling piece selection and movement when clicked.
   * Validates movement and emits the move request to the server.
   *
   * @param {string} pieceId - Unique identifier for the piece being moved.
   * @param {string} player - The player who owns the piece.
   * @param {string} currentTurn - The player whose turn it is.
   * @param {Function} setDiceValues - Setter function for updating dice values.
   * @param {number[]} diceValues - Array of rolled dice values.
   */
  const handlePieceClickWrapper = (
    pieceId,
    player,
    currentTurn,
    setDiceValues,
    diceValues
  ) => {
    handlePieceClick(
      pieceId,
      player,
      currentTurn,
      setDiceValues,
      diceValues,
      selectedDice,
      socket,
      setSelectedDice,
      setHighlightedCells
    );
  };

  /**
   * Wrapper to reset the selected dice when a new roll occurs.
   */
  const resetDiceSelectionWrapper = () => {
    resetDiceSelection(setSelectedDice);
  };

  return {
    handleDieSelect: handleDieSelectWrapper,
    handlePieceClick: handlePieceClickWrapper,
    resetDiceSelection: resetDiceSelectionWrapper,
    selectedDice,
    hoveredPiece,
    setHoveredPiece,
    handlePieceHover: handlePieceHoverWrapper,
    handlePieceLeave: handlePieceLeaveWrapper,
    highlightedCells,
  };
};

export default useGameLogic;
