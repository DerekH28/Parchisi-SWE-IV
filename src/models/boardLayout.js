import { safeSpaces } from "./safeSpaces";

/**
 * Generates the game board layout as a 15x15 grid
 * Defines different types of spaces:
 * - Player homes (red, blue, yellow, green)
 * - Track spaces
 * - Safe spaces
 * - Center area
 * - Color-specific slots
 *
 * @type {string[][]} 15x15 grid representing the game board
 */
export const boardLayout = (() => {
  const size = 15;
  // Create a 15x15 grid filled with "unused"
  const board = Array.from({ length: size }, () => Array(size).fill("unused"));

  // Fill red-home: rows 0-5, cols 0-5
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      board[r][c] = "red-home";
    }
  }

  // Fill blue-home: rows 0-5, cols 9-14
  for (let r = 0; r < 6; r++) {
    for (let c = 9; c < size; c++) {
      board[r][c] = "blue-home";
    }
  }

  // Fill yellow-home: rows 9-14, cols 0-5
  for (let r = 9; r < size; r++) {
    for (let c = 0; c < 6; c++) {
      board[r][c] = "yellow-home";
    }
  }

  // Fill green-home: rows 9-14, cols 9-14
  for (let r = 9; r < size; r++) {
    for (let c = 9; c < size; c++) {
      board[r][c] = "green-home";
    }
  }

  // Fill center: rows 6-8, cols 6-8
  for (let r = 6; r <= 8; r++) {
    for (let c = 6; c <= 8; c++) {
      board[r][c] = "center";
    }
  }

  /**
   * Fills the top track section
   * Creates a track with red player's slot
   * @param {number} r - Row index
   * @param {number} c - Column index
   */
  for (let r = 0; r < 6; r++) {
    for (let c = 6; c <= 8; c++) {
      board[r][c] = c === 7 && r !== 0 ? "slot-red" : "track";
    }
  }

  /**
   * Fills the bottom track section
   * Creates a track with green player's slot
   * @param {number} r - Row index
   * @param {number} c - Column index
   */
  for (let r = 9; r < size; r++) {
    for (let c = 6; c <= 8; c++) {
      board[r][c] = c === 7 && r !== size - 1 ? "slot-green" : "track";
    }
  }

  /**
   * Fills the left track section
   * Creates a track with yellow player's slot
   * @param {number} r - Row index
   * @param {number} c - Column index
   */
  for (let r = 6; r <= 8; r++) {
    for (let c = 0; c < 6; c++) {
      board[r][c] = r === 7 && c !== 0 ? "slot-yellow" : "track";
    }
  }

  /**
   * Fills the right track section
   * Creates a track with blue player's slot
   * @param {number} r - Row index
   * @param {number} c - Column index
   */
  for (let r = 6; r <= 8; r++) {
    for (let c = 9; c < size; c++) {
      board[r][c] = r === 7 && c !== size - 1 ? "slot-blue" : "track";
    }
  }

  /**
   * Applies safe spaces to the board
   * Colors the safe spaces based on their location:
   * - Player exit spaces are colored with a darker version of their color
   * - Other safe spaces are marked as gray
   */
  safeSpaces.forEach((space) => {
    const { row, col } = space;
    if (row === 3 && col === 6) {
      board[row][col] = "dark-red-gray";
    } else if (row === 8 && col === 3) {
      board[row][col] = "dark-yellow-gray";
    } else if (row === 11 && col === 8) {
      board[row][col] = "dark-green-gray";
    } else if (row === 6 && col === 11) {
      board[row][col] = "dark-blue-gray";
    } else {
      board[row][col] = "gray";
    }
  });

  return board;
})();
