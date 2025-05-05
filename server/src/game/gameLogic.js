// src/game/gameLogic.js
import { safeSpaces } from "../utils/safeSpaces.js";
import { homeCoordinates } from "./homeCoordinates.js";
import { gameState } from "../utils/gameState.js";

/**
 * Returns the player's home tile based on their color and piece index.
 */
export const getHomeCoordinate = (color, pieceIndex) =>
  homeCoordinates[color][pieceIndex];

/**
 * Rolls two dice for the current player.
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
 * Checks if a path contains an opponent blockade between two indices.
 */
export const isBlockadeOnPath = (path, startIndex, endIndex, player) => {
  const checkedTiles = path.slice(startIndex + 1, endIndex + 1);

  for (const tile of checkedTiles) {
    const count = Object.keys(gameState)
      .filter((color) => color !== player && Array.isArray(gameState[color]))
      .reduce((acc, color) => {
        return acc + gameState[color].filter(
          (p) => p.coord?.row === tile.row && p.coord?.col === tile.col
        ).length;
      }, 0);

    if (count >= 2) return true;
  }

  return false;
};

/**
 * Checks for an opponent piece at the destination.
 * Captures if only one is present, blocks if a blockade exists.
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
 * Checks if a tile is a safe space.
 */
export const isSafeSpace = (row, col) => {
  return safeSpaces.some((spot) => spot.row === row && spot.col === col);
};

/**
 * Checks if a coordinate is a safe space occupied by an opponent
 */
export const isOpponentOnSafeSpace = (coord, player) => {
  if (!isSafeSpace(coord.row, coord.col)) return false;

  const opponentColors = Object.keys(gameState).filter(
    (color) => color !== player && Array.isArray(gameState[color])
  );

  for (const color of opponentColors) {
    const piecesAtCoord = gameState[color].filter(
      (p) =>
        p.coord &&
        p.coord.row === coord.row &&
        p.coord.col === coord.col
    );

    if (piecesAtCoord.length > 0) return true;
  }

  return false;
};
