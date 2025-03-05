/**
 * The initial game state defining the starting positions of all pieces.
 * Each player (red, blue, yellow, green) has two pieces starting at their home positions.
 */
export const initialGameState = {
  red: [
    { inHome: true, index: 0, coord: { row: 2, col: 2 } },
    { inHome: true, index: 1, coord: { row: 2, col: 3 } },
    { inHome: true, index: 2, coord: { row: 3, col: 2 } },
    { inHome: true, index: 3, coord: { row: 3, col: 3 } },
  ],
  blue: [
    { inHome: true, index: 0, coord: { row: 1, col: 12 } },
    { inHome: true, index: 1, coord: { row: 1, col: 13 } },
  ],
  yellow: [
    { inHome: true, index: 0, coord: { row: 12, col: 1 } },
    { inHome: true, index: 1, coord: { row: 12, col: 2 } },
  ],
  green: [
    { inHome: true, index: 0, coord: { row: 12, col: 12 } },
    { inHome: true, index: 1, coord: { row: 12, col: 13 } },
  ],
};

/** Stores the current state of the game, modified as the game progresses. */
export let gameState = JSON.parse(JSON.stringify(initialGameState));

/**
 * Resets the game state to its initial configuration.
 * Useful for restarting the game.
 */
export const resetGameState = () => {
  gameState = JSON.parse(JSON.stringify(initialGameState));
};
