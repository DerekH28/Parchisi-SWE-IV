import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { handleGameEvents } from "./game/socketHandlers.js";

/**
 * Express application instance
 * @type {import('express').Application}
 */
const app = express();

/**
 * Enable Cross-Origin Resource Sharing (CORS)
 * Allows requests from the frontend application
 */
app.use(cors());

/**
 * HTTP server instance
 * Required for WebSocket functionality
 * @type {import('http').Server}
 */
const server = createServer(app);

/**
 * Socket.io server instance
 * Configured with CORS to allow connections from the frontend
 * @type {import('socket.io').Server}
 */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

/**
 * Initialize game event handlers
 * Attaches all socket event listeners for game functionality
 */
handleGameEvents(io);

/**
 * Start the server
 * Listens on the specified port or defaults to 4000
 */
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
