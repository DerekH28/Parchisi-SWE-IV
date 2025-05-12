import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";
import { safeSpaces } from "../utils/safeSpaces.js";

/**
 * Validates if a piece can move to a destination, considering:
 * - Safe spaces (can't land on opponent's piece unless leaving home)
 * - Blockades (max 2 pieces of same color per tile)
 *
 * @param {object} coord - The destination coordinate { row, col }.
 * @param {string} player - The player's color.
 * @param {boolean} isLeavingHome - Whether the piece is leaving home.
 * @returns {boolean} - True if the destination is valid.
 */
export const isValidDestination = (coord, player, isLeavingHome = false) => {
  const isSafe = safeSpaces.some(
    (space) => space.row === coord.row && space.col === coord.col
  );

  if (isSafe && !isLeavingHome) {
    for (const opponent of Object.keys(gameState)) {
      if (opponent === player) continue;
      const opponentPieces = gameState[opponent];
      if (!Array.isArray(opponentPieces)) continue;
      if (
        opponentPieces.some(
          (p) => p.coord.row === coord.row && p.coord.col === coord.col
        )
      )
        return false;
    }
  }

  return (
    gameState[player].filter(
      (p) => p.coord.row === coord.row && p.coord.col === coord.col
    ).length < 2
  );
};

/**
 * Checks if a piece can leave home.
 * A piece can leave home if:
 * - It's in home
 * - Has a 5 on one die OR sum of both dice equals 5
 * - Starting tile is not blocked
 *
 * @param {object} piece - The piece object.
 * @param {number[]} dice - The array of dice values.
 * @param {string} player - The player's color.
 * @returns {boolean} - True if the piece can leave home.
 */
export const canLeaveHome = (piece, dice, player) => {
  if (!piece.inHome) return false;
  if (!(dice.includes(5) || (dice.length === 2 && dice[0] + dice[1] === 5)))
    return false;
  return isValidDestination(routes[player].path[0], player);
};

/**
 * Checks if a piece on the board can move further.
 * This function now also verifies that the destination tile is not blocked.
 *
 * @param {object} piece - The piece object.
 * @param {number} diceValue - The dice value intended for movement.
 * @param {object[]} path - The route/path array for the player.
 * @param {string} player - The player's color.
 * @returns {boolean} - True if the piece can move and the destination is valid.
 */
export const canMoveOnBoard = (piece, diceValue, path, player) => {
  let currentIndex =
    piece.lastKnownIndex ??
    path.findIndex(
      (tile) => tile.row === piece.coord.row && tile.col === piece.coord.col
    );
  if (currentIndex < 0 || currentIndex >= path.length) return false;
  const nextIndex = currentIndex + diceValue;
  if (nextIndex >= path.length) return false;
  if (!path[nextIndex]) return false;
  return isValidDestination(path[nextIndex], player);
};

/**
 * Determines whether the player has any valid moves.
 * This function checks every piece and factors in both home exit and movement
 * on the board including blockade restrictions.
 *
 * @param {string} player - The player's color.
 * @param {number[]} dice - The rolled dice values.
 * @returns {boolean} - True if at least one piece has a valid move.
 */
export const hasValidMoves = (player, dice) => {
  if (!gameState[player]) return false;
  const pieces = gameState[player];
  const path = routes[player].path;

  return pieces.some((piece) => {
    if (piece.inHome) {
      return canLeaveHome(piece, dice, player);
    }
    // Check if piece is at the end of the path
    const currentIndex =
      piece.lastKnownIndex ??
      path.findIndex(
        (tile) => tile.row === piece.coord.row && tile.col === piece.coord.col
      );
    if (currentIndex >= path.length - 1) return false;
    return dice.some((diceValue) =>
      canMoveOnBoard(piece, diceValue, path, player)
    );
  });
};
