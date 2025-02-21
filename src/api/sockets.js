import { io } from "socket.io-client";

// Reuse the same player ID after a page reload
let storedPlayerId = localStorage.getItem("playerId");
if (!storedPlayerId) {
  storedPlayerId = Math.random().toString(36).substring(7); // Generate a random ID
  localStorage.setItem("playerId", storedPlayerId);
}

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});

export { socket, storedPlayerId };
