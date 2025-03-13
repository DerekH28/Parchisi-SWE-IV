// validMoves.js
import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";

/**
 * Checks if a piece at home can leave.
 * A home piece can leave if one die shows exactly 5 or if the sum of both dice equals 5.
 *
 * @param {object} piece - The piece object.
 * @param {number[]} dice - The array of dice values.
 * @returns {boolean} - True if the piece can leave home.
 */
export const canLeaveHome = (piece, dice) => {
  if (!piece.inHome) return false;
  // Check if any die is 5.
  if (dice.includes(5)) return true;
  // Check if the sum of both dice equals 5.
  if (dice.length === 2 && dice[0] + dice[1] === 5) return true;
  return false;
};

/**
 * Checks if a piece on the board can move further.
 * A piece can move if it is not already at the final tile.
 *
 * @param {object} piece - The piece object.
 * @param {number[]} dice - The array of dice values. (Not used directly in this check, but can be extended for further rules.)
 * @param {object[]} path - The route/path array for the player.
 * @returns {boolean} - True if the piece can move on the board.
 */
export const canMoveOnBoard = (piece, dice, path) => {
  let currentIndex = piece.lastKnownIndex;
  if (currentIndex === undefined) {
    currentIndex = path.findIndex(
      (tile) => tile.row === piece.coord.row && tile.col === piece.coord.col
    );
  }
  // The piece can move if it is not at the final tile.
  return currentIndex < path.length - 1;
};

/**
 * Determines whether the player has any valid moves.
 *
 * @param {string} player - The player's color.
 * @param {number[]} dice - The rolled dice values.
 * @returns {boolean} - True if at least one piece has a valid move.
 */
export const hasValidMoves = (player, dice) => {
  if (!gameState[player]) return false;
  const pieces = gameState[player];
  const path = routes[player].path;

  for (let piece of pieces) {
    if (piece.inHome) {
      if (canLeaveHome(piece, dice)) return true;
    } else {
      if (canMoveOnBoard(piece, dice, path)) return true;
    }
  }
  return false;
};
