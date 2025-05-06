/**
 * Defines the turn order for the game.
 * Players take turns in this order.
 */
const turnOrder = ["red", "blue", "yellow", "green"];

/** Tracks the current player's turn. */
export let currentTurn = turnOrder[0];

/** Tracks active players in the game */
export let activePlayers = [];

/**
 * Sets the active players for the game.
 * @param {string[]} players - Array of player colors that are in the game
 */
export const setActivePlayers = (players) => {
  activePlayers = players
    .filter((player) => turnOrder.includes(player))
    .sort((a, b) => turnOrder.indexOf(a) - turnOrder.indexOf(b));
};

/**
 * Gets the next player's turn based on the current turn.
 * Only cycles through active players.
 * @param {Server} io - Socket.io server instance
 * @param {string} current - The current player's color
 * @returns {string} The next player's color
 */
export const getNextTurn = (io, current) => {
  if (!activePlayers.length) {
    return current;
  }

  const currentIndex = activePlayers.indexOf(current);
  if (currentIndex === -1) {
    currentTurn = activePlayers[0];
    return currentTurn;
  }

  currentTurn = activePlayers[(currentIndex + 1) % activePlayers.length];
  return currentTurn;
};
