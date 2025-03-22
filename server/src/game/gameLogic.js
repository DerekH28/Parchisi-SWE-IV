import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";

//TODO: Final Stretch Needs to be exactly to home or it skips players turn.
//TODO: Final Stretch Needs to be exactly to home or it skips players turn.
//TODO: Implement create blockades (two pieces on the same tile) to prevent movement.
//TODO: Implement a way to capture pieces that are on the same tile.
//TODO: Implement Safety spaces to prevent capture. Two pieces of different colors on the same tile are not allowed. Unless you are bringing your piece outside of home.

/**
 * Checks if the destination tile is free of a blockade.
 * A blockade exists if there are already 2 pieces of the same color on that tile.
 *
 * @param {object} coord - The destination coordinate { row, col }.
 * @param {string} player - The player's color.
 * @returns {boolean} - True if the tile is not blocked, false otherwise.
 */
export const isValidDestination = (coord, player) => {
  const piecesOnTile = gameState[player].filter(
    (p) => p.coord.row === coord.row && p.coord.col === coord.col
  );
  return piecesOnTile.length < 2;
};

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
 * Ensures correct progression, prevents resetting, and handles duplicate tiles (blockades) properly.
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

  // Home exit logic: must roll exactly 5 to leave home.
  if (piece.inHome) {
    if (diceValue !== 5) {
      console.log(`🚫 ${pieceId} must roll a 5 to leave home.`);
      return { success: false, message: "Must roll exactly 5 to leave home" };
    }
    const startingTile = path[0];
    if (!isValidDestination(startingTile, player)) {
      console.log(
        `🚫 Blockade at starting tile (${startingTile.row}, ${startingTile.col}). Move blocked.`
      );
      return {
        success: false,
        message: "Blockade in place at the starting tile",
      };
    }
    console.log(`🚀 ${pieceId} is leaving home at index 0!`);
    gameState[player][pieceIndex] = {
      ...piece,
      coord: startingTile,
      inHome: false,
      lastKnownIndex: 0,
    };
    return { success: true };
  }

  // Find the last known position of the piece on its path.
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

  // Move forward based on the dice roll.
  let newIndex = currentIndex + diceValue;
  newIndex = Math.min(newIndex, path.length - 1);
  const newCoord = path[newIndex];

  // Check for a blockade on the new destination.
  if (!isValidDestination(newCoord, player)) {
    console.log(
      `🚫 Blockade: ${pieceId} cannot move to tile at row ${newCoord.row}, col ${newCoord.col}.`
    );
    return {
      success: false,
      message: "Blockade in place: Cannot move to tile",
    };
  }

  console.log(
    `✅ ${pieceId} moved from index ${currentIndex} to index ${newIndex}`
  );
  gameState[player][pieceIndex] = {
    ...piece,
    coord: newCoord,
    lastKnownIndex: newIndex,
  };

  return { success: true };
};
