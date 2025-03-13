import { useEffect, useState } from "react";
import io from "socket.io-client";
// TODO: Set up lobbies and a lobby screen

const socket = io("http://localhost:4000", { transports: ["websocket"] });

/**
 * Custom hook for managing socket connections and game events.
 */
const useSocket = () => {
  const [player, setPlayer] = useState(null);
  const [diceValues, setDiceValues] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [positions, setPositions] = useState({});

  useEffect(() => {
    socket.on("connect", () => console.log("✅ Connected to server"));
    socket.on("disconnect", () => console.log("❌ Disconnected from server"));

    socket.on("player-assigned", (assignedPlayer) => {
      setPlayer(assignedPlayer);
      console.log(`🔹 Assigned player: ${assignedPlayer}`);
    });

    socket.on("game-state-updated", (updatedState) => {
      console.log("🔹 Received game-state-updated:", updatedState);
      setPositions(updatedState);
    });

    socket.on("dice-rolled", ({ player: rolledBy, dice }) => {
      console.log(`🎲 ${rolledBy} rolled: ${dice[0]} and ${dice[1]}`);
      // Only update dice values if the roll was by the current client.
      if (rolledBy === player) {
        setDiceValues(dice);
      }
    });

    socket.on("turn-changed", (turn) => {
      console.log(`🔹 Turn changed: It is now ${turn}'s turn.`);
      setCurrentTurn(turn);
      // Clear dice values when the turn changes.
      setDiceValues([]);
    });

    return () => {
      socket.off("player-assigned");
      socket.off("game-state-updated");
      socket.off("dice-rolled");
      socket.off("turn-changed");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [player]);

  return { socket, player, diceValues, currentTurn, positions, setDiceValues };
};

export default useSocket;
