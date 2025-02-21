import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let totalAmount = 0;
let players = [];
let currentTurn = 0;

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("joinGame", (playerId, playerName) => {
    if (!players.some((p) => p.id === playerId)) {
      players.push({ id: playerId, name: playerName });
      console.log(`${playerName} joined the game`);
    }

    socket.emit("gameState", {
      totalAmount,
      players,
      currentTurn: players[currentTurn]?.id || null,
    });

    io.emit("playerListUpdate", players);
  });

  socket.on("rollDice", (playerId, operation) => {
    if (players[currentTurn]?.id !== playerId) {
      socket.emit("notYourTurn");
      return;
    }

    const diceRoll = Math.floor(Math.random() * 6) + 1;
    totalAmount += operation === "add" ? diceRoll : -diceRoll;

    io.emit("diceRolled", {
      player: players[currentTurn].name,
      roll: diceRoll,
      operation,
    });
    io.emit("totalUpdate", totalAmount);

    currentTurn = (currentTurn + 1) % players.length;
    io.emit("turnUpdate", players[currentTurn]?.id || null);
  });

  socket.on("leaveGame", (playerId) => {
    players = players.filter((p) => p.id !== playerId);
    console.log(`Player left: ${playerId}`);

    if (players.length > 0) {
      currentTurn = currentTurn % players.length;
      io.emit("turnUpdate", players[currentTurn]?.id || null);
    }

    io.emit("playerListUpdate", players);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("Game server running on port 4000");
});
