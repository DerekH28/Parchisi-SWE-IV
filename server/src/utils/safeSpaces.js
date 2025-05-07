/**
 * Safe spaces on the game board where pieces cannot be captured.
 * These are the colored squares at the start of each player's path
 * and the home stretch squares.
 */
export const safeSpaces = [
  // Red player's safe spaces
  { row: 3, col: 6 },
  { row: 3, col: 8 },
  { row: 0, col: 7 },

  // Blue player's safe spaces
  { row: 8, col: 3 },
  { row: 7, col: 0 },
  { row: 6, col: 3 },

  // Yellow player's safe spaces
  { row: 11, col: 6 },
  { row: 11, col: 8 },
  { row: 14, col: 7 },

  // Green player's safe spaces
  { row: 6, col: 11 },
  { row: 8, col: 11 },
  { row: 7, col: 14 },
];
