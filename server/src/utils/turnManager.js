/**
 * Defines the turn order for the game.
 * Players take turns in this order.
 */
const turnOrder = ["red", "blue", "yellow", "green"];

/** Tracks the current player's turn. */
export let currentTurn = turnOrder[0];

/**
 * Determines the next player in turn order who is currently connected.
 * @param {Server} io - The Socket.io server instance.
 * @param {string} current - The current player's turn.
 * @returns {string} - The next player's color.
 */
export const getNextTurn = (io, current) => {
  const connectedSockets = Array.from(io.sockets.sockets.values());
  let index = turnOrder.indexOf(current);

  // Loop through turnOrder to find the next available player
  for (let i = 1; i <= turnOrder.length; i++) {
    const nextIndex = (index + i) % turnOrder.length;

    // If the next player in order is connected, update the turn
    if (connectedSockets.some((s) => s.data?.color === turnOrder[nextIndex])) {
      currentTurn = turnOrder[nextIndex];
      return currentTurn;
    }
  }

  // Fallback: Keep the current turn if no connected players are found
  return current;
};
