// src/game/movePiece.js
import { isBlockadeOnPath, captureOpponentAt, getHomeCoordinate, isOpponentOnSafeSpace, checkForWin } from "./gameLogic.js";
import { gameState } from "../utils/gameState.js";

/**
 * Moves a piece based on the selected dice value.
 */
export const movePiece = (player, pieceId, diceValue, routes) => {
    if (!gameState[player]) return { success: false, message: "Invalid player" };

    const pieceIndex = parseInt(pieceId.replace(player, "")) - 1;
    if (pieceIndex < 0 || pieceIndex >= gameState[player].length) {
        return { success: false, message: "Invalid piece selection" };
    }

    let piece = gameState[player][pieceIndex];
    if (!piece) return { success: false, message: "Piece not found" };

    const path = routes[player].path;

    if (piece.inHome) {
        if (diceValue !== 5) return { success: false, message: "Must roll exactly 5 to leave home" };

        const startingTile = path[0];
        const tileOccupied = gameState[player].filter(
            (p) => p.coord?.row === startingTile.row && p.coord?.col === startingTile.col
        ).length >= 2;

        if (tileOccupied) return { success: false, message: "Blockade at starting tile" };

        gameState[player][pieceIndex] = {
            ...piece,
            inHome: false,
            coord: startingTile,
            lastKnownIndex: 0,
        };
        return { success: true };
    }

    const currentIndex =
        piece.lastKnownIndex ??
        path.findIndex((tile) => tile.row === piece.coord.row && tile.col === piece.coord.col);

    if (currentIndex === -1) return { success: false, message: "Piece position invalid" };

    const finalStretchStart = path.length - 6;
    const remainingTiles = path.length - 1 - currentIndex;
    if (currentIndex >= finalStretchStart && diceValue > remainingTiles) {
        return { success: false, message: "Dice roll exceeds remaining spaces" };
    }

    const newIndex = Math.min(currentIndex + diceValue, path.length - 1);
    const newCoord = path[newIndex];

    if (isOpponentOnSafeSpace(newCoord, player)) {
        return { success: false, message: "Cannot move to safe space occupied by opponent" };
    }

    if (isBlockadeOnPath(path, currentIndex, newIndex, player, gameState)) {
        return { success: false, message: "Move blocked by a blockade ahead" };
    }

    if (!captureOpponentAt(newCoord, player, gameState)) {
        return { success: false, message: "Opponent blockade present" };
    }

    gameState[player][pieceIndex] = {
        ...piece,
        coord: newCoord,
        lastKnownIndex: newIndex,
    };

    // Check for win condition after successful move
    if (checkForWin(player)) {
        return { success: true, hasWon: true };
    }

    return { success: true };
};
