import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";

/**
 * Rolls two dice for the current player if it's their turn.
 * @param {string} player - The player rolling the dice.
 * @param {string} currentTurn - The player whose turn it is.
 * @returns {object} - Success status and dice values.
 */
export const rollDice = (player, currentTurn) => {
  if (!player || !gameState[player]) {
    return { success: false, message: "Invalid player" };
  }
  if (player !== currentTurn) {
    return { success: false, message: "Not your turn" };
  }

  const dice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
  console.log(`🎲 ${player} rolled: ${dice[0]} and ${dice[1]}`);

  return { success: true, dice };
};

/**
 * Moves a piece based on the selected dice value.
 * Ensures correct progression, prevents resetting, and handles duplicate tiles properly.
 *
 * @param {string} player - The player making the move.
 * @param {string} pieceId - The piece being moved (e.g., "red1").
 * @param {number} diceValue - The dice value used for movement.
 * @returns {object} - Success status.
 */
export const movePiece = (player, pieceId, diceValue) => {
  if (!gameState[player]) {
    return { success: false, message: "Invalid player" };
  }

  const pieceIndex = parseInt(pieceId.replace(player, "")) - 1;
  if (pieceIndex < 0 || pieceIndex >= gameState[player].length) {
    return { success: false, message: "Invalid piece selection" };
  }

  let piece = gameState[player][pieceIndex];
  const path = routes[player].path;

  // 🎲 Rule 1: Home Exit Logic - Must roll exactly 5 to leave home
  if (piece.inHome) {
    if (diceValue !== 5) {
      console.log(`🚫 ${pieceId} must roll a sum of 5 to leave home.`);
      return { success: false, message: "Must roll exactly 5 to leave home" };
    }
    console.log(`🚀 ${pieceId} is leaving home at index 0!`);
    gameState[player][pieceIndex] = {
      ...piece,
      coord: path[0], // Start at first board position
      inHome: false,
      lastKnownIndex: 0, // Track correct movement history
    };
    return { success: true };
  }

  // 🔍 Find the last known position of the piece
  let currentIndex =
    piece.lastKnownIndex ??
    path.findIndex(
      (tile) => tile.row === piece.coord.row && tile.col === piece.coord.col
    );

  if (currentIndex === -1) {
    console.warn(
      `⚠️ ${pieceId} not found in route! Keeping last known position.`
    );
    return {
      success: false,
      message: "Piece position invalid. Movement blocked.",
    };
  }

  // ➡️ Move forward based on the dice roll
  let newIndex = currentIndex + diceValue;

  // 🛑 Prevent moving beyond the final tile
  newIndex = Math.min(newIndex, path.length - 1);

  console.log(
    `✅ ${pieceId} moved from index ${currentIndex} to index ${newIndex}`
  );

  // ✅ Update game state to reflect the new position
  gameState[player][pieceIndex] = {
    ...piece,
    coord: path[newIndex], // Always update to the correct row & col
    lastKnownIndex: newIndex, // Store last known index to prevent resetting
  };

  return { success: true };
};
