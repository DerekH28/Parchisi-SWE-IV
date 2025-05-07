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
  activePlayers = players.filter((player) => turnOrder.includes(player));
  // Sort active players according to the turn order
  activePlayers.sort((a, b) => turnOrder.indexOf(a) - turnOrder.indexOf(b));
  console.log("🔹 Active players set:", activePlayers);
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
    console.warn("⚠️ No active players set for turn management");
    return current;
  }

  const currentIndex = activePlayers.indexOf(current);
  if (currentIndex === -1) {
    console.warn(`⚠️ Current player ${current} not found in active players`);
    currentTurn = activePlayers[0];
    return currentTurn;
  }

  const nextIndex = (currentIndex + 1) % activePlayers.length;
  currentTurn = activePlayers[nextIndex];
  console.log(`🔹 Turn changed from ${current} to ${currentTurn}`);
  return currentTurn;
};
