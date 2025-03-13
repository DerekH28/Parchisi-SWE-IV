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

    // Use an explicit array of valid player colors.
    const allColors = ["red", "blue", "yellow", "green"];
    const connectedSockets = Array.from(io.sockets.sockets.values());

    // Determine available colors by filtering out colors already assigned.
    const availableColors = allColors.filter(
      (color) => !connectedSockets.some((s) => s.data?.color === color)
    );

    if (availableColors.length > 0) {
      socket.data.color = availableColors[0];
      socket.emit("player-assigned", socket.data.color);
      console.log(`🔹 Assigned player ${socket.data.color}`);
    } else {
      socket.emit("player-assigned", null);
      console.log("🔹 No available player colors to assign");
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

      // Update the gameState dice values and reset played flags.
      gameState.dice.die1.value = result.dice[0];
      gameState.dice.die2.value = result.dice[1];
      gameState.dice.die1.played = false;
      gameState.dice.die2.played = false;

      io.emit("dice-rolled", { player, dice: result.dice });
      callback(result);
    });

    /**
     * Handles piece movement when a player selects a die.
     * Validates move, updates game state, and advances the turn if both dice have been used.
     */
    socket.on("piece-clicked", ({ pieceId, player, diceValue }, callback) => {
      const moveResult = movePiece(player, pieceId, diceValue);
      if (!moveResult.success) return callback(moveResult);

      // Mark the appropriate die as played based on the diceValue.
      if (
        gameState.dice.die1.value === diceValue &&
        !gameState.dice.die1.played
      ) {
        gameState.dice.die1.played = true;
      } else if (
        gameState.dice.die2.value === diceValue &&
        !gameState.dice.die2.played
      ) {
        gameState.dice.die2.played = true;
      } else {
        // If dice values are equal or don't match specifically, mark the first unplayed die.
        if (!gameState.dice.die1.played) {
          gameState.dice.die1.played = true;
        } else if (!gameState.dice.die2.played) {
          gameState.dice.die2.played = true;
        }
      }

      io.emit("game-state-updated", JSON.parse(JSON.stringify(gameState)));

      // Check if both dice have been played. If so, switch turn and reset dice.
      if (gameState.dice.die1.played && gameState.dice.die2.played) {
        const nextTurn = getNextTurn(io, currentTurn);

        // Reset dice values and flags.
        gameState.dice.die1.value = null;
        gameState.dice.die2.value = null;
        gameState.dice.die1.played = false;
        gameState.dice.die2.played = false;

        io.emit("turn-changed", nextTurn);
      }

      callback({ success: true, newPositions: gameState });
    });

    /**
     * Handles player disconnection.
     */
    socket.on("disconnect", () => {
      console.log("🔹 A player disconnected:", socket.id);
    });
  });
};
