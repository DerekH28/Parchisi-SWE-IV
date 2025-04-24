/**
 * Returns true if the destination is valid.
 * A destination is valid if there are fewer than 2 of the player's own pieces at the coordinate,
 * and if it's not a safe space occupied by another player's piece (unless leaving home).
 */
export const isValidDestination = (coord, player, gameState, isLeavingHome = false) => {
    const isSafe = safeSpaces.some(
        (space) => space.row === coord.row && space.col === coord.col
    );

    if (isSafe && !isLeavingHome) {
        for (const opponent of Object.keys(gameState)) {
            if (opponent === player) continue;

            const opponentPieces = gameState[opponent];
            if (!Array.isArray(opponentPieces)) continue;

            const opponentOnSafeSpace = opponentPieces.some(
                (p) => p.coord.row === coord.row && p.coord.col === coord.col
            );

            if (opponentOnSafeSpace) return false;
        }
    }

    const playerPiecesAtCoord = gameState[player].filter(
        (p) => p.coord.row === coord.row && p.coord.col === coord.col
    );

    return playerPiecesAtCoord.length < 2;
};
