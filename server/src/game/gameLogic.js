import { safeSpaces } from "../utils/safeSpaces.js";
import { homeCoordinates } from "./homeCoordinates.js";
import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";

/**
 * Returns the home tile coordinate for a player's piece
 * @param {string} color - The player's color
 * @param {number} pieceIndex - The index of the piece
 * @returns {Object} The home coordinate {row, col}
 */
export const getHomeCoordinate = (color, pieceIndex) =>
  homeCoordinates[color][pieceIndex];

/**
 * Rolls two dice for the current player
 * @param {string} player - The player's color
 * @param {string} currentTurn - The current turn's player color
 * @param {Object} gameState - The current game state
 * @returns {Object} Object containing success status and dice values
 */
export const rollDice = (player, currentTurn, gameState) => {
  if (!player || !gameState || !gameState[player] || player !== currentTurn) {
    return { success: false, message: "Invalid player or not your turn" };
  }

  const dice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
  return { success: true, dice };
};

/**
 * Checks for opponent blockade between two path indices
 * @param {Array} path - The path array to check
 * @param {number} startIndex - Starting index to check from
 * @param {number} endIndex - Ending index to check to
 * @param {string} player - The current player's color
 * @returns {boolean} True if a blockade exists
 */
export const isBlockadeOnPath = (path, startIndex, endIndex, player) => {
  const checkedTiles = path.slice(startIndex + 1, endIndex + 1);

  for (const tile of checkedTiles) {
    const count = Object.keys(gameState)
      .filter((color) => color !== player && Array.isArray(gameState[color]))
      .reduce((acc, color) => {
        return (
          acc +
          gameState[color].filter(
            (p) => p.coord?.row === tile.row && p.coord?.col === tile.col
          ).length
        );
      }, 0);

    if (count >= 2) return true;
  }

  return false;
};

/**
 * Captures single opponent piece or blocks if multiple pieces present
 * @param {Object} coord - The coordinate to check {row, col}
 * @param {string} player - The current player's color
 * @returns {boolean} True if capture successful or no capture needed
 */
export const captureOpponentAt = (coord, player) => {
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
 * Checks if a tile is a safe space
 * @param {number} row - The row coordinate
 * @param {number} col - The column coordinate
 * @returns {boolean} True if the tile is a safe space
 */
export const isSafeSpace = (row, col) => {
  return safeSpaces.some((spot) => spot.row === row && spot.col === col);
};

/**
 * Checks if opponent piece occupies a safe space
 * @param {Object} coord - The coordinate to check {row, col}
 * @param {string} player - The current player's color
 * @returns {boolean} True if an opponent piece is on the safe space
 */
export const isOpponentOnSafeSpace = (coord, player) => {
  if (!isSafeSpace(coord.row, coord.col)) return false;

  const opponentColors = Object.keys(gameState).filter(
    (color) => color !== player && Array.isArray(gameState[color])
  );

  for (const color of opponentColors) {
    const piecesAtCoord = gameState[color].filter(
      (p) => p.coord && p.coord.row === coord.row && p.coord.col === coord.col
    );

    if (piecesAtCoord.length > 0) return true;
  }

  return false;
};

/**
 * Checks if all player pieces have reached the end of their path
 * @param {string} player - The player's color to check
 * @returns {boolean} True if all pieces have reached the end
 */
export const checkForWin = (player) => {
  if (!player || !gameState[player]) return false;

  const playerPieces = gameState[player];
  const path = routes[player]?.path;
  if (!path) return false;

  return playerPieces.every((piece) => {
    if (piece.inHome) return false;
    return piece.lastKnownIndex === path.length - 1;
  });
};
