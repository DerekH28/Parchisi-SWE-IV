// src/game/homeCoordinates.js
export const homeCoordinates = {
    red: [
        { row: 2, col: 2 }, { row: 2, col: 3 },
        { row: 3, col: 2 }, { row: 3, col: 3 },
    ],
    blue: [
        { row: 2, col: 11 }, { row: 2, col: 12 },
        { row: 3, col: 11 }, { row: 3, col: 12 },
    ],
    yellow: [
        { row: 11, col: 2 }, { row: 11, col: 3 },
        { row: 12, col: 2 }, { row: 12, col: 3 },
    ],
    green: [
        { row: 11, col: 11 }, { row: 11, col: 12 },
        { row: 12, col: 11 }, { row: 12, col: 12 },
    ],
};

export const getHomeCoordinate = (color, pieceIndex) =>
    homeCoordinates[color][pieceIndex];
