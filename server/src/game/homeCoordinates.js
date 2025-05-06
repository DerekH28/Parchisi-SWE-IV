/**
 * Initial home coordinates for each player's pieces.
 * Each player has 4 pieces arranged in a 2x2 grid in their corner:
 * - Red: top-left corner
 * - Blue: top-right corner
 * - Yellow: bottom-left corner
 * - Green: bottom-right corner
 * @type {Object.<string, Array<{row: number, col: number}>>}
 */
export const homeCoordinates = {
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

/**
 * Gets the home coordinate for a specific piece
 * @param {string} color - The player's color
 * @param {number} pieceIndex - The index of the piece (0-3)
 * @returns {{row: number, col: number}} The home coordinate for the piece
 */
export const getHomeCoordinate = (color, pieceIndex) =>
  homeCoordinates[color][pieceIndex];
