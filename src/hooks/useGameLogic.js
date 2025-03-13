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
   * Wrapper for handling die selection.
   * @param {number} dieIndex - Index of the die being selected/deselected.
   */
  const handleDieSelectWrapper = (dieIndex) => {
    handleDieSelect(dieIndex, selectedDice, setSelectedDice);
  };

  /**
   * Wrapper for handling piece hover, calculating movement preview based on selected dice.
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
   * Clears hover effects.
   */
  const handlePieceLeaveWrapper = () => {
    handlePieceLeave(setHoveredPiece, setHighlightedCells);
  };

  /**
   * Wrapper for handling piece click.
   * Sends the move request to the server using the sum of selected dice values.
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
   * Resets the selected dice when a new roll occurs.
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
