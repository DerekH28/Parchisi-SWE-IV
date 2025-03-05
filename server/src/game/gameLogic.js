import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";

/**
 * Rolls two dice for the current player if it's their turn.
 * @param {string} player - The player rolling the dice.
 * @param {string} currentTurn - The player whose turn it is.
 * @returns {object} - Success status and dice values.
 */
export const rollDice = (player, currentTurn) => {
  if (!player || !gameState[player]) {
    return { success: false, message: "Invalid player" };
  }
  if (player !== currentTurn) {
    return { success: false, message: "Not your turn" };
  }

  const dice = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
  console.log(`🎲 ${player} rolled: ${dice[0]} and ${dice[1]}`);

  return { success: true, dice };
};

/**
 * Moves a piece based on the selected dice value.
 * @param {string} player - The player making the move.
 * @param {string} pieceId - The piece being moved (e.g., "red1").
 * @param {number} diceValue - The dice value used for movement.
 * @returns {object} - Success status.
 */
export const movePiece = (player, pieceId, diceValue) => {
  if (!gameState[player]) {
    return { success: false, message: "Invalid player" };
  }

  const pieceIndex = parseInt(pieceId.replace(player, "")) - 1;
  if (pieceIndex < 0 || pieceIndex >= gameState[player].length) {
    return { success: false, message: "Invalid piece selection" };
  }

  let piece = gameState[player][pieceIndex];

  // ✅ Rule 1: Home Exit Logic - Must Roll Sum of 5
  if (piece.inHome) {
    if (diceValue !== 5) {
      console.log(`🚫 ${pieceId} must roll a sum of 5 to leave home.`);
      return { success: false, message: "Must roll exactly 5 to leave home" };
    }
    console.log(`🚀 ${pieceId} is leaving home!`);
    gameState[player][pieceIndex] = {
      ...piece,
      coord: routes[player][0], // ✅ Start at first board position
      inHome: false,
    };
    return { success: true };
  }

  // ✅ Find ALL occurrences of the current position in the route
  let matchingIndices = routes[player]
    .map((pos, index) =>
      pos.row === piece.coord.row && pos.col === piece.coord.col ? index : -1
    )
    .filter((index) => index !== -1);

  if (matchingIndices.length === 0) {
    console.warn(`⚠️ ${pieceId} not found in route! Resetting to start.`);
    gameState[player][pieceIndex] = {
      ...piece,
      coord: routes[player][0], // Reset to start
    };
    return { success: true };
  }

  // ✅ Check if the piece is transitioning into the final stretch
  let currentPosIndex = matchingIndices[0];

  //NOTE: This won't work for all players
  if (routes[player][currentPosIndex]?.final === 0) {
    let finalIndex = routes[player].findIndex(
      (pos, index) =>
        pos.row === piece.coord.row &&
        pos.col === piece.coord.col &&
        pos.final === 1 &&
        index > currentPosIndex // ✅ Ensure it’s later in the route
    );

    if (finalIndex !== -1) {
      console.log(`🏁 ${pieceId} is entering the final stretch!`);
      currentPosIndex = finalIndex; // ✅ Move to the final stretch
    }
  }

  // ✅ Rule 2: Exact Roll Required in Final Stretch
  let isInFinalStretch = routes[player][currentPosIndex]?.final === 1;
  let remainingMoves = routes[player].length - 1 - currentPosIndex;

  if (isInFinalStretch && diceValue > remainingMoves) {
    console.log(`🔄 ${pieceId} rolled too high in final stretch! Turn resets.`);
    return {
      success: false,
      message: "Rolled too high in final stretch, turn resets",
    };
  }

  // ✅ Ensure the piece does not move beyond the final position
  let newIndex = Math.min(
    currentPosIndex + diceValue,
    routes[player].length - 1
  );

  gameState[player][pieceIndex] = {
    ...piece,
    coord: routes[player][newIndex],
  };

  console.log(
    `✅ ${pieceId} moved to ${JSON.stringify(routes[player][newIndex])}`
  );
  return { success: true };
};
