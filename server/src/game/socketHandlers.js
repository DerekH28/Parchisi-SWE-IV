import { gameState, resetGameState } from "../utils/gameState.js";
import { routes } from "../utils/routes.js";
import { getNextTurn, setActivePlayers } from "../utils/turnManager.js";
import { rollDice } from "./gameLogic.js";
import { movePiece } from "./movePiece.js";
import { hasValidMoves } from "../utils/validMoves.js";
import { currentTurn } from "../utils/turnManager.js";

// Store active lobbies and player assignments
const lobbies = new Map();
const playerAssignments = new Map();

/**
 * Handles all WebSocket events related to the game.
 * @param {Server} io - The Socket.io server instance.
 */
export const handleGameEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("🔹 A player connected:", socket.id);

    // Handle player assignment request
    socket.on("request-player-assignment", (requestedColor) => {
      console.log(`🔹 Player ${socket.id} requesting color ${requestedColor}`);
      const existingAssignment = playerAssignments.get(socket.id);

      if (existingAssignment) {
        // Player already has a color assigned
        socket.emit("player-assigned", existingAssignment);
        socket.emit("game-state-updated", gameState);
        if (currentTurn) {
          socket.emit("turn-changed", currentTurn);
        }
      } else if (
        requestedColor &&
        !Array.from(playerAssignments.values()).includes(requestedColor)
      ) {
        // Assign requested color if available
        playerAssignments.set(socket.id, requestedColor);
        socket.emit("player-assigned", requestedColor);
      }
    });

    // Create a new lobby
    socket.on("create-lobby", () => {
      const lobbyCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const lobby = {
        code: lobbyCode,
        players: [
          {
            id: socket.id,
            isHost: true,
          },
        ],
        host: socket.id,
      };

      lobbies.set(lobbyCode, lobby);
      socket.join(lobbyCode);
      socket.emit("host-assigned");
      io.to(lobbyCode).emit("lobby-updated", lobby);
      console.log(`🔹 Created lobby ${lobbyCode}`);
    });

    // Join an existing lobby
    socket.on("join-lobby", (code) => {
      const lobby = lobbies.get(code);
      if (lobby) {
        // Add player to lobby if not already in it
        if (!lobby.players.some((p) => p.id === socket.id)) {
          lobby.players.push({
            id: socket.id,
            isHost: false,
          });
        }
        socket.join(code);
        // Emit updated lobby state to all players in the lobby
        io.to(code).emit("lobby-updated", lobby);
        console.log(`🔹 Player ${socket.id} joined lobby ${code}`);
      } else {
        socket.emit("error", "Lobby not found");
      }
    });

    // Select a color in the lobby
    socket.on("select-color", (color, lobbyCode) => {
      console.log(
        `🔹 Player ${socket.id} selecting color ${color} in lobby ${lobbyCode}`
      );
      const lobby = lobbies.get(lobbyCode);
      if (lobby) {
        // Check if color is already taken
        if (lobby.players.some((p) => p.color === color)) {
          socket.emit("error", "Color already taken");
          return;
        }

        const player = {
          id: socket.id,
          color,
          isHost: lobby.host === socket.id,
        };

        lobby.players = [
          ...lobby.players.filter((p) => p.id !== socket.id),
          player,
        ];
        io.to(lobbyCode).emit("lobby-updated", lobby);
      }
    });

    // Start the game
    socket.on("start-game", (lobbyCode) => {
      console.log(`🔹 Attempting to start game in lobby ${lobbyCode}`);
      const lobby = lobbies.get(lobbyCode);
      if (lobby && lobby.host === socket.id && lobby.players.length > 1) {
        console.log("Current lobby state:", {
          players: lobby.players,
          host: lobby.host,
        });

        // Reset game state
        resetGameState();
        console.log("Game state after reset:", gameState);

        // Set active players for turn management
        const activeColors = lobby.players.map((p) => p.color);
        setActivePlayers(activeColors);
        console.log("🔹 Active players set for turn management:", activeColors);

        // Store player socket IDs and their colors for future reference
        lobby.players.forEach((player) => {
          const playerSocket = Array.from(io.sockets.sockets.values()).find(
            (s) => s.id === player.id
          );
          if (playerSocket) {
            // Store the player's color in their socket data and assignments map
            playerSocket.data.color = player.color;
            playerAssignments.set(player.id, player.color);
            // Emit player assignment to each player
            playerSocket.emit("player-assigned", player.color);
            console.log(`🔹 Assigned ${player.color} to player ${player.id}`);
          }
        });

        // Start with the first active player's turn
        const firstTurn = activeColors[0];
        io.emit("turn-changed", firstTurn);
        console.log("🔹 Set first turn to:", firstTurn);

        // Send initial game state to all players
        io.emit("game-state-updated", gameState);
        console.log("🔹 Sent initial game state to all players");

        // Notify all players to start the game
        lobby.players.forEach((player) => {
          const playerSocket = Array.from(io.sockets.sockets.values()).find(
            (s) => s.id === player.id
          );
          if (playerSocket) {
            playerSocket.emit("game-started", {
              gameState,
              yourColor: player.color,
            });
            console.log(
              `🔹 Sent game start to ${player.color} player (${player.id})`
            );
          }
        });

        console.log(`🔹 Game started in lobby ${lobbyCode}`);
        console.log("Final game state:", gameState);

        // Clean up the lobby
        lobbies.delete(lobbyCode);
      } else {
        console.log("⚠️ Failed to start game:", {
          hasLobby: !!lobby,
          isHost: lobby?.host === socket.id,
          playerCount: lobby?.players.length,
        });
        socket.emit(
          "error",
          "Cannot start game - not enough players or not host"
        );
      }
    });

    // Handle dice rolling
    socket.on("roll-dice", (player, callback) => {
      const result = rollDice(player, currentTurn, gameState);
      if (!result.success) return callback(result);

      gameState.dice.die1.value = result.dice[0];
      gameState.dice.die2.value = result.dice[1];
      gameState.dice.die1.played = false;
      gameState.dice.die2.played = false;

      io.emit("dice-rolled", { player, dice: result.dice });
      callback(result);

      if (!hasValidMoves(player, result.dice)) {
        console.log(`No valid moves for ${player}. Skipping turn.`);
        gameState.dice.die1.value = null;
        gameState.dice.die2.value = null;
        gameState.dice.die1.played = false;
        gameState.dice.die2.played = false;
        const nextTurn = getNextTurn(io, currentTurn);
        io.emit("turn-changed", nextTurn);
      }
    });

    // Handle piece movement
    socket.on("piece-clicked", ({ pieceId, player, diceValue }, callback) => {
      const moveResult = movePiece(player, pieceId, diceValue, routes);
      if (!moveResult.success) return callback(moveResult);

      const totalDiceValue =
        gameState.dice.die1.value + gameState.dice.die2.value;
      if (diceValue === totalDiceValue) {
        gameState.dice.die1.played = true;
        gameState.dice.die2.played = true;
      } else {
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
          if (!gameState.dice.die1.played) {
            gameState.dice.die1.played = true;
          } else if (!gameState.dice.die2.played) {
            gameState.dice.die2.played = true;
          }
        }
      }

      io.emit("game-state-updated", JSON.parse(JSON.stringify(gameState)));

      // Check if the player has won
      if (moveResult.hasWon) {
        io.emit("game-won", player);
        return callback({
          success: true,
          newPositions: gameState,
          hasWon: true,
        });
      }

      if (gameState.dice.die1.played && gameState.dice.die2.played) {
        const nextTurn = getNextTurn(io, currentTurn);
        gameState.dice.die1.value = null;
        gameState.dice.die2.value = null;
        gameState.dice.die1.played = false;
        gameState.dice.die2.played = false;
        io.emit("turn-changed", nextTurn);
      }

      callback({ success: true, newPositions: gameState });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("🔹 A player disconnected:", socket.id);
      // Remove player from assignments
      playerAssignments.delete(socket.id);
      // Remove player from any lobby they're in
      for (const [code, lobby] of lobbies.entries()) {
        if (lobby.players.some((p) => p.id === socket.id)) {
          lobby.players = lobby.players.filter((p) => p.id !== socket.id);
          if (lobby.players.length === 0) {
            lobbies.delete(code);
          } else {
            // If host disconnected, assign new host
            if (lobby.host === socket.id) {
              lobby.host = lobby.players[0].id;
              lobby.players[0].isHost = true;
              io.to(code).emit("host-assigned");
            }
            io.to(code).emit("lobby-updated", lobby);
          }
        }
      }
    });
  });
};
