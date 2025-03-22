import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";

//TODO: Final Stretch Needs to be exactly to home or it skips players turn.
//TODO: Final Stretch Needs to be exactly to home or it skips players turn.
//TODO: Implement Safety spaces to prevent capture. Two pieces of different colors on the same tile are not allowed. Unless you are bringing your piece outside of home.

// Home coordinates for each player.
const homeCoordinates = {
  red: [
    { row: 2, col: 2 },
    { row: 2, col: 3 },
    { row: 3, col: 2 },
    { row: 3, col: 3 },
  ],
  blue: [
    { row: 2, col: 11 },
    { row: 2, col: 12 },
    { row: 3, col: 11 },
    { row: 3, col: 12 },
  ],
  yellow: [
    { row: 11, col: 2 },
    { row: 11, col: 3 },
    { row: 12, col: 2 },
    { row: 12, col: 3 },
  ],
  green: [
    { row: 11, col: 11 },
    { row: 11, col: 12 },
    { row: 12, col: 11 },
    { row: 12, col: 12 },
  ],
};

const getHomeCoordinate = (color, pieceIndex) =>
  homeCoordinates[color][pieceIndex];

/**
 * Returns true if there are fewer than 2 of the player's own pieces at the coordinate.
 */
export const isValidDestination = (coord, player) =>
  gameState[player].filter(
    (p) => p.coord.row === coord.row && p.coord.col === coord.col
  ).length < 2;

/**
 * Rolls two dice for the current player.
 */
export const rollDice = (player, currentTurn) => {
  if (!player || !gameState[player] || player !== currentTurn) {
    return { success: false, message: "Invalid player or not your turn" };
  }
  const dice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
  return { success: true, dice };
};

/**
 * Checks for an opponent piece at the destination.
 * If an opponent piece is found and is alone, it is captured.
 * If an opponent blockade exists, the move is blocked.
 *
 * @returns {boolean} - True if capture is successful (or nothing to capture), false if blocked.
 */
const captureOpponentAt = (coord, player) => {
  // Only iterate over keys that are arrays (player pieces).
  const opponentColors = Object.keys(gameState).filter(
    (color) => color !== player && Array.isArray(gameState[color])
  );
  for (const opp of opponentColors) {
    const oppPieces = gameState[opp].filter(
      (p) => p.coord.row === coord.row && p.coord.col === coord.col
    );
    if (oppPieces.length === 1) {
      // Capture the opponent piece.
      const idx = gameState[opp].findIndex(
        (p) => p.coord.row === coord.row && p.coord.col === coord.col
      );
      if (idx !== -1) {
        const captured = gameState[opp][idx];
        captured.inHome = true;
        captured.coord = getHomeCoordinate(opp, captured.index);
        captured.lastKnownIndex = null;
      }
    } else if (oppPieces.length > 1) {
      // Opponent blockade exists.
      return false;
    }
  }
  return true;
};

/**
 * Moves a piece based on the selected dice value.
 * Implements home exit logic, blockades, and capturing of opponent pieces.
 */
export const movePiece = (player, pieceId, diceValue) => {
  if (!gameState[player]) return { success: false, message: "Invalid player" };

  const pieceIndex = parseInt(pieceId.replace(player, "")) - 1;
  if (pieceIndex < 0 || pieceIndex >= gameState[player].length) {
    return { success: false, message: "Invalid piece selection" };
  }

  let piece = gameState[player][pieceIndex];
  const path = routes[player].path;

  // Home exit logic: require a 5 to leave home.
  if (piece.inHome) {
    if (diceValue !== 5)
      return { success: false, message: "Must roll exactly 5 to leave home" };
    const startingTile = path[0];
    if (!isValidDestination(startingTile, player))
      return { success: false, message: "Blockade at starting tile" };
    piece = { ...piece, inHome: false, coord: startingTile, lastKnownIndex: 0 };
    gameState[player][pieceIndex] = piece;
    return { success: true };
  }

  // Get current position index.
  let currentIndex =
    piece.lastKnownIndex !== undefined
      ? piece.lastKnownIndex
      : path.findIndex(
          (tile) => tile.row === piece.coord.row && tile.col === piece.coord.col
        );
  if (currentIndex === -1)
    return { success: false, message: "Piece position invalid" };

  // Calculate new index and coordinate.
  let newIndex = Math.min(currentIndex + diceValue, path.length - 1);
  const newCoord = path[newIndex];

  if (!isValidDestination(newCoord, player))
    return { success: false, message: "Blockade in place" };

  if (!captureOpponentAt(newCoord, player)) {
    return { success: false, message: "Opponent blockade present" };
  }

  gameState[player][pieceIndex] = {
    ...piece,
    coord: newCoord,
    lastKnownIndex: newIndex,
  };
  return { success: true };
};

export { captureOpponentAt };
