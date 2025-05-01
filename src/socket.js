import io from "socket.io-client";

// Create a single socket instance that will be shared across components
const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
});

// Add connection event handlers
socket.on("connect", () => {
  console.log("✅ Socket connected with ID:", socket.id);
  // Request player assignment if we have a stored color
  const storedColor = localStorage.getItem("playerColor");
  if (storedColor) {
    console.log("🔹 Requesting stored color:", storedColor);
    socket.emit("request-player-assignment", storedColor);
  }
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

// Add error handling
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

// Add player assignment handler
socket.on("player-assigned", (color) => {
  console.log("🔹 Player assigned color:", color);
  localStorage.setItem("playerColor", color);
});

export default socket;
