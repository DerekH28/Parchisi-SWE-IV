import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { handleGameEvents } from "./game/socketHandlers.js";

/** Initialize the Express app */
const app = express();

/** Enable CORS */
app.use(cors());

/** Create an HTTP server to work with WebSockets */
const server = createServer(app);

/** Initialize Socket.io with CORS configuration */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

/** Attach game event handlers to the WebSocket server */
handleGameEvents(io);

/** Start the server */
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
