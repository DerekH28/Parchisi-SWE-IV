import { gameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";
import { getNextTurn, currentTurn } from "../utils/turnManager.js";
import { rollDice, movePiece } from "./gameLogic.js";
import { hasValidMoves } from "../utils/validMoves.js";

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

    // Send the current game state and turn information.
    socket.emit("game-state-updated", JSON.parse(JSON.stringify(gameState)));
    socket.emit("turn-changed", currentTurn);

    /**
     * Handles the dice roll event.
     * Rolls the dice, updates the game state, emits the dice values,
     * and checks if the player has any valid moves.
     */
    socket.on("roll-dice", (player, callback) => {
      const result = rollDice(player, currentTurn);
      if (!result.success) return callback(result);

      // Update dice values in game state and reset played flags.
      gameState.dice.die1.value = result.dice[0];
      gameState.dice.die2.value = result.dice[1];
      gameState.dice.die1.played = false;
      gameState.dice.die2.played = false;

      io.emit("dice-rolled", { player, dice: result.dice });
      callback(result);

      // After rolling, check if the player has any valid moves.
      if (!hasValidMoves(player, result.dice)) {
        console.log(`No valid moves for ${player}. Skipping turn.`);
        // Reset dice values and flags.
        gameState.dice.die1.value = null;
        gameState.dice.die2.value = null;
        gameState.dice.die1.played = false;
        gameState.dice.die2.played = false;
        const nextTurn = getNextTurn(io, currentTurn);
        io.emit("turn-changed", nextTurn);
      }
    });

    /**
     * Handles piece movement when a player clicks a piece.
     * Marks dice as played based on the dice value used and switches turn when needed.
     */
    socket.on("piece-clicked", ({ pieceId, player, diceValue }, callback) => {
      const moveResult = movePiece(player, pieceId, diceValue);
      if (!moveResult.success) return callback(moveResult);

      // Calculate the sum of both dice.
      const totalDiceValue =
        gameState.dice.die1.value + gameState.dice.die2.value;
      if (diceValue === totalDiceValue) {
        // Combination move: mark both dice as played.
        gameState.dice.die1.played = true;
        gameState.dice.die2.played = true;
      } else {
        // If an individual die was used, mark the matching die as played.
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
          // Fallback: mark the first unplayed die.
          if (!gameState.dice.die1.played) {
            gameState.dice.die1.played = true;
          } else if (!gameState.dice.die2.played) {
            gameState.dice.die2.played = true;
          }
        }
      }

      io.emit("game-state-updated", JSON.parse(JSON.stringify(gameState)));

      // If both dice have been played, advance the turn.
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
