/**
 * Initial game state configuration.
 * Contains:
 * - Current turn (redundant with turnManager)
 * - Dice state (values and played status)
 * - Player pieces (4 pieces per player, each with position and movement history)
 *   - inHome: whether piece is in starting area
 *   - index: piece identifier
 *   - coord: current position {row, col}
 *   - traveledTiles: array of previously visited positions
 */
export const initialGameState = {
  currentTurn: "red", // this is now redundant if using turnManager.currentTurn
  dice: {
    die1: { value: null, played: false },
    die2: { value: null, played: false },
  },
  red: [
    { inHome: true, index: 0, coord: { row: 2, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 2, col: 3 }, traveledTiles: [] },
    { inHome: true, index: 2, coord: { row: 3, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 3, coord: { row: 3, col: 3 }, traveledTiles: [] },
  ],
  blue: [
    { inHome: true, index: 0, coord: { row: 2, col: 11 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 2, col: 12 }, traveledTiles: [] },
    { inHome: true, index: 2, coord: { row: 3, col: 11 }, traveledTiles: [] },
    { inHome: true, index: 3, coord: { row: 3, col: 12 }, traveledTiles: [] },
  ],
  yellow: [
    { inHome: true, index: 0, coord: { row: 11, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 11, col: 3 }, traveledTiles: [] },
    { inHome: true, index: 2, coord: { row: 12, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 3, coord: { row: 12, col: 3 }, traveledTiles: [] },
  ],
  green: [
    { inHome: true, index: 0, coord: { row: 11, col: 11 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 11, col: 12 }, traveledTiles: [] },
    { inHome: true, index: 0, coord: { row: 12, col: 11 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 12, col: 12 }, traveledTiles: [] },
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
