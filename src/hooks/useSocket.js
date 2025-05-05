import { useEffect, useState } from "react";
import socket from "../socket";
// TODO: Set up lobbies and a lobby screen

// Initial game state structure
const initialGameState = {
  red: [
    { inHome: true, index: 0, coord: { row: 2, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 2, col: 3 }, traveledTiles: [] },
    { inHome: true, index: 2, coord: { row: 3, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 3, coord: { row: 3, col: 3 }, traveledTiles: [] },
  ],
  blue: [
    { inHome: true, index: 0, coord: { row: 2, col: 11 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 2, col: 12 }, traveledTiles: [] },
    { inHome: true, index: 2, coord: { row: 3, col: 11 }, traveledTiles: [] },
    { inHome: true, index: 3, coord: { row: 3, col: 12 }, traveledTiles: [] },
  ],
  yellow: [
    { inHome: true, index: 0, coord: { row: 11, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 11, col: 3 }, traveledTiles: [] },
    { inHome: true, index: 2, coord: { row: 12, col: 2 }, traveledTiles: [] },
    { inHome: true, index: 3, coord: { row: 12, col: 3 }, traveledTiles: [] },
  ],
  green: [
    { inHome: true, index: 0, coord: { row: 11, col: 11 }, traveledTiles: [] },
    { inHome: true, index: 1, coord: { row: 11, col: 12 }, traveledTiles: [] },
    { inHome: true, index: 2, coord: { row: 12, col: 11 }, traveledTiles: [] },
    { inHome: true, index: 3, coord: { row: 12, col: 12 }, traveledTiles: [] },
  ],
};

/**
 * Custom hook for managing socket connections and game events.
 */
const useSocket = () => {
  // Initialize state with values from localStorage
  const [player, setPlayer] = useState(() =>
    localStorage.getItem("playerColor")
  );
  const [diceValues, setDiceValues] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [positions, setPositions] = useState(initialGameState);

  useEffect(() => {
    // Request player assignment on mount if we have a stored color
    const storedColor = localStorage.getItem("playerColor");
    if (storedColor) {
      console.log("🔹 Requesting stored color on mount:", storedColor);
      socket.emit("request-player-assignment", storedColor);
    }

    const handleConnect = () => {
      console.log("✅ Connected to server");
      // Re-request player assignment on reconnect if we have a color
      const currentColor = localStorage.getItem("playerColor");
      if (currentColor) {
        console.log("🔹 Re-requesting color on connect:", currentColor);
        socket.emit("request-player-assignment", currentColor);
      }
    };

    const handleDisconnect = () => {
      console.log("❌ Disconnected from server");
    };

    const handlePlayerAssigned = (assignedColor) => {
      console.log(`🔹 Player assigned in useSocket:`, assignedColor);
      localStorage.setItem("playerColor", assignedColor);
      setPlayer(assignedColor);
    };

    const handleGameStarted = ({ gameState, yourColor }) => {
      console.log(
        `🔹 Game started in useSocket, color:`,
        yourColor,
        "state:",
        gameState
      );
      if (yourColor) {
        localStorage.setItem("playerColor", yourColor);
        setPlayer(yourColor);
      }
      if (gameState) {
        setPositions(gameState);
      }
    };

    const handleGameStateUpdated = (updatedState) => {
      console.log("🔹 Game state updated in useSocket:", updatedState);
      if (updatedState) {
        setPositions(updatedState);
      }
    };

    const handleDiceRolled = ({ player: rolledBy, dice }) => {
      console.log(`🎲 ${rolledBy} rolled:`, dice);
      if (rolledBy === player) {
        setDiceValues(dice);
      }
    };

    const handleTurnChanged = (turn) => {
      console.log(`🔹 Turn changed to:`, turn);
      setCurrentTurn(turn);
      if (turn !== player) {
        setDiceValues([]);
      }
    };

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("player-assigned", handlePlayerAssigned);
    socket.on("game-started", handleGameStarted);
    socket.on("game-state-updated", handleGameStateUpdated);
    socket.on("dice-rolled", handleDiceRolled);
    socket.on("turn-changed", handleTurnChanged);

    // Debug current state
    console.log("useSocket current state:", {
      player,
      storedColor: localStorage.getItem("playerColor"),
      hasPositions: !!positions,
      currentTurn,
      socketId: socket.id,
    });

    // Cleanup event listeners
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("player-assigned", handlePlayerAssigned);
      socket.off("game-started", handleGameStarted);
      socket.off("game-state-updated", handleGameStateUpdated);
      socket.off("dice-rolled", handleDiceRolled);
      socket.off("turn-changed", handleTurnChanged);
    };
  }, [player]); // Only depend on player to avoid unnecessary re-renders

  return { socket, player, diceValues, currentTurn, positions, setDiceValues };
};

export default useSocket;
