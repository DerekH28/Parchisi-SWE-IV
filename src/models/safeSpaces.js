/**
 * Array of coordinates representing safe spaces on the game board
 * Safe spaces are locations where pieces cannot be captured
 *
 * Coordinates are organized by player sections:
 * - Red player safe spaces: (3,6), (3,8), (0,7)
 * - Yellow player safe spaces: (8,3), (7,0), (6,3)
 * - Green player safe spaces: (11,6), (11,8), (14,7)
 * - Blue player safe spaces: (6,11), (8,11), (7,14)
 *
 * @type {Array<{row: number, col: number}>} Array of safe space coordinates
 */
export const safeSpaces = [
  { row: 3, col: 6 },
  { row: 3, col: 8 },
  { row: 0, col: 7 },
  { row: 8, col: 3 },
  { row: 7, col: 0 },
  { row: 6, col: 3 },
  { row: 11, col: 6 },
  { row: 11, col: 8 },
  { row: 14, col: 7 },
  { row: 6, col: 11 },
  { row: 8, col: 11 },
  { row: 7, col: 14 },
];
