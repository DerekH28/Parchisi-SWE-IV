import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";

/**
 * Checks if the destination tile is free of a blockade.
 * A blockade exists if there are already 2 pieces of the same color on that tile.
 *
 * @param {object} coord - The destination coordinate { row, col }.
 * @param {string} player - The player's color.
 * @returns {boolean} - True if the tile is not blocked, false otherwise.
 */
export const isValidDestination = (coord, player) => {
  const playerPiecesAtCoord = gameState[player].filter(
    (p) => p.coord.row === coord.row && p.coord.col === coord.col
  );

  return playerPiecesAtCoord.length < 2;
};

/**
 * Checks if a piece at home can leave.
 * In addition to the dice condition (a 5 on one die or sum of 5),
 * the home exit tile must not be blocked.
 *
 * @param {object} piece - The piece object.
 * @param {number[]} dice - The array of dice values.
 * @param {string} player - The player's color.
 * @returns {boolean} - True if the piece can leave home.
 */
export const canLeaveHome = (piece, dice, player) => {
  if (!piece.inHome) return false;
  // Check if any die is 5 or if the sum of both dice equals 5.
  if (!(dice.includes(5) || (dice.length === 2 && dice[0] + dice[1] === 5))) {
    return false;
  }
  // The piece can leave home only if the starting tile is not blocked.
  const startingTile = routes[player].path[0];
  return isValidDestination(startingTile, player);
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
  // Determine the current index on the path.
  let currentIndex = piece.lastKnownIndex;
  if (currentIndex === undefined) {
    currentIndex = path.findIndex(
      (tile) => tile.row === piece.coord.row && tile.col === piece.coord.col
    );
  }
  // Cannot move if already at or beyond the final tile.
  if (currentIndex < 0 || currentIndex >= path.length - 1) return false;

  // Calculate the intended new index, preventing overshooting.
  const newIndex = Math.min(currentIndex + diceValue, path.length - 1);
  const newCoord = path[newIndex];

  // The move is valid only if the destination tile is not blocked.
  return isValidDestination(newCoord, player);
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

  // Check each piece for a valid move.
  for (let piece of pieces) {
    if (piece.inHome) {
      if (canLeaveHome(piece, dice, player)) return true;
    } else {
      // Loop through each die value to see if a move is possible.
      for (let diceValue of dice) {
        if (canMoveOnBoard(piece, diceValue, path, player)) return true;
      }
    }
  }
  return false;
};
