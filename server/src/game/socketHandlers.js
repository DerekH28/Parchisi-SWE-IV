import { gameState } from "../utils/gameState.js";
import { getNextTurn, currentTurn } from "../utils/turnManager.js";
import { rollDice, movePiece } from "./gameLogic.js";

/**
 * Handles all WebSocket events related to the game.
 * @param {Server} io - The Socket.io server instance.
 */
export const handleGameEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("🔹 A player connected:", socket.id);

    // Assign a color to the player if one is available.
    const connectedSockets = Array.from(io.sockets.sockets.values());
    const availableColors = Object.keys(gameState).filter(
      (color) => !connectedSockets.some((s) => s.data?.color === color)
    );

    if (availableColors.length > 0) {
      socket.data.color = availableColors[0];
      socket.emit("player-assigned", socket.data.color);
      console.log(`🔹 Assigned player ${socket.data.color}`);
    } else {
      socket.emit("player-assigned", null);
    }

    // Send the current game state and turn information to the player.
    socket.emit("game-state-updated", JSON.parse(JSON.stringify(gameState)));
    socket.emit("turn-changed", currentTurn);

    /**
     * Handles the dice roll event.
     * Ensures only the current player can roll and broadcasts the result.
     */
    socket.on("roll-dice", (player, callback) => {
      const result = rollDice(player, currentTurn);
      if (!result.success) return callback(result);

      io.emit("dice-rolled", { player, dice: result.dice });
      callback(result);
    });

    /**
     * Handles piece movement when a player selects a die.
     * Validates move, updates game state, and advances the turn.
     */
    socket.on("piece-clicked", ({ pieceId, player, diceValue }, callback) => {
      const moveResult = movePiece(player, pieceId, diceValue);
      if (!moveResult.success) return callback(moveResult);

      io.emit("game-state-updated", JSON.parse(JSON.stringify(gameState)));

      // Advance to the next player's turn.
      const nextTurn = getNextTurn(io, currentTurn);
      io.emit("turn-changed", nextTurn);

      callback({ success: true, newPositions: gameState });
    });

    /**
     * Handles player disconnection.
     * Logs the event and keeps the game running.
     */
    socket.on("disconnect", () => {
      console.log("🔹 A player disconnected:", socket.id);
    });
  });
};
