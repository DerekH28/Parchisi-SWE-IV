import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";
import { safeSpaces } from "../../../src/models/safeSpaces.js";

//BUG: After every move, whether the user has any valid moves should be checked.
//BUG: If a player clicks on a piece that is not theirs, the game will crash.

// Home coordinates for each player
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
 * Returns true if the destination is valid.
 * A destination is valid if there are fewer than 2 of the player's own pieces at the coordinate,
 * and if it's not a safe space occupied by another player's piece (unless leaving home).
 */
export const isValidDestination = (coord, player, isLeavingHome = false) => {
  const isSafe = safeSpaces.some(
    (space) => space.row === coord.row && space.col === coord.col
  );

  if (isSafe && !isLeavingHome) {
    for (const opponent of Object.keys(gameState)) {
      if (opponent === player) continue;

      const opponentPieces = gameState[opponent];

      if (!Array.isArray(opponentPieces)) {
        continue;
      }

      const opponentOnSafeSpace = opponentPieces.some(
        (p) => p.coord.row === coord.row && p.coord.col === coord.col
      );

      if (opponentOnSafeSpace) {
        return false;
      }
    }
  }

  const playerPiecesAtCoord = gameState[player].filter(
    (p) => p.coord.row === coord.row && p.coord.col === coord.col
  );

  return playerPiecesAtCoord.length < 2;
};

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
 * Returns the indices for the final stretch.
 * Here, we assume the final stretch is the last 6 tiles of the route.
 */
const getFinalStretchIndices = (path) => {
  const finalStretchCount = 6;
  return {
    start: path.length - finalStretchCount,
    end: path.length - 1,
  };
};

/**
 * Checks whether the dice roll would overshoot the final destination.
 * If the piece is in the final stretch, the move is allowed as long as the dice value
 * does not exceed the remaining tiles. Otherwise, the move is allowed.
 *
 * @returns {boolean} - True if the move is allowed, false if it overshoots.
 */
const allowFinalStretchMove = (currentIndex, diceValue, path) => {
  const { start, end } = getFinalStretchIndices(path);
  if (currentIndex >= start) {
    const remaining = end - currentIndex;
    return diceValue <= remaining;
  }
  return true;
};

/**
 * Checks for an opponent piece at the destination.
 * If a single opponent piece is present, it is captured.
 * If multiple opponent pieces are present (an opponent blockade), the move is blocked.
 *
 * @returns {boolean} - True if capture is successful (or nothing to capture), false if blocked.
 */
const captureOpponentAt = (coord, player) => {
  const opponentColors = Object.keys(gameState).filter(
    (color) => color !== player && Array.isArray(gameState[color])
  );

  for (const opp of opponentColors) {
    const oppPieces = gameState[opp].filter(
      (p) => p.coord.row === coord.row && p.coord.col === coord.col
    );

    if (oppPieces.length === 1) {
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
      return false;
    }
  }

  return true;
};


/**
 * Moves a piece based on the selected dice value.
 * Implements home exit logic, blockades, capturing, and prevents overshooting in the final stretch.
 */
export const movePiece = (player, pieceId, diceValue) => {
  if (!gameState[player]) return { success: false, message: "Invalid player" };

  const pieceIndex = parseInt(pieceId.replace(player, "")) - 1;
  if (pieceIndex < 0 || pieceIndex >= gameState[player].length) {
    return { success: false, message: "Invalid piece selection" };
  }

  let piece = gameState[player][pieceIndex];

  if (!piece) {
    return { success: false, message: "Piece not found" };
  }

  const path = routes[player].path;

  // Home exit logic: require a 5 to leave home.
  if (piece.inHome) {
    if (diceValue !== 5)
      return { success: false, message: "Must roll exactly 5 to leave home" };
    const startingTile = path[0];
    if (!isValidDestination(startingTile, player, true))
      return { success: false, message: "Blockade at starting tile" };
    piece = { ...piece, inHome: false, coord: startingTile, lastKnownIndex: 0 };
    gameState[player][pieceIndex] = piece;
    return { success: true };
  }

  // Determine current index in the route.
  let currentIndex =
    piece.lastKnownIndex !== undefined
      ? piece.lastKnownIndex
      : path.findIndex(
        (tile) => tile.row === piece.coord.row && tile.col === piece.coord.col
      );
  if (currentIndex === -1)
    return { success: false, message: "Piece position invalid" };

  // Final stretch overshoot check.
  if (!allowFinalStretchMove(currentIndex, diceValue, path)) {
    return { success: false, message: "Dice roll exceeds remaining spaces" };
  }

  // Calculate new index and coordinate.
  let newIndex = currentIndex + diceValue;
  newIndex = Math.min(newIndex, path.length - 1);
  const newCoord = path[newIndex];

  // Check for blockades before attempting to move
  if (isBlockadeOnPath(path, currentIndex, newIndex, player)) {
    return { success: false, message: "Move blocked by a blockade ahead" };
  }

  if (!captureOpponentAt(newCoord, player)) {
    return { success: false, message: "Opponent blockade present" };
  }

  // Update piece state only if all checks pass
  gameState[player][pieceIndex] = {
    ...piece,
    coord: newCoord,
    lastKnownIndex: newIndex,
  };

  return { success: true };
};

//BUG: When the player first clicks on the piece's move that is blocked by a blockade, it doesn't allow them to move but it doesn't show a message
//then if you try to click again it allows the piece to move pass and it moves twice the length of the dice roll selected
const isBlockadeOnPath = (path, currentIndex, newIndex, player) => {
  for (let i = currentIndex + 1; i < newIndex; i++) {
    const coord = path[i];
    const playerPieces = gameState[player].filter(
      (p) => p.coord.row === coord.row && p.coord.col === coord.col
    );

    if (playerPieces.length === 2) {
      return true; // Own blockade
    }

    // Check if another player has a blockade there
    for (const color of Object.keys(gameState)) {
      if (color === player || !Array.isArray(gameState[color])) continue;

      const opponentPieces = gameState[color].filter(
        (p) => p.coord.row === coord.row && p.coord.col === coord.col
      );

      if (opponentPieces.length >= 2) {
        return true; // Blockade by another player
      }
    }
  }
  return false;
};

export { captureOpponentAt };
