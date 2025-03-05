export const initialGameState = {
  red: [
    { inHome: true, index: 0, coord: { row: 2, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 2, col: 3 }, traveledTiles: [] },
    { inHome: true, index: 2, coord: { row: 3, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 3, coord: { row: 3, col: 3 }, traveledTiles: [] },
  ],
  blue: [
    { inHome: true, index: 0, coord: { row: 1, col: 12 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 1, col: 13 }, traveledTiles: [] },
  ],
  yellow: [
    { inHome: true, index: 0, coord: { row: 12, col: 1 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 12, col: 2 }, traveledTiles: [] },
  ],
  green: [
    { inHome: true, index: 0, coord: { row: 12, col: 12 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 12, col: 13 }, traveledTiles: [] },
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
