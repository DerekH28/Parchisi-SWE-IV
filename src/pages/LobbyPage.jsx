import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import socket from "../socket";

// Store the selected color in localStorage
const storePlayerColor = (color) => {
  localStorage.setItem("playerColor", color);
};

// Get the stored color
const getStoredPlayerColor = () => {
  return localStorage.getItem("playerColor");
};

const LobbyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState("");
  const [lobbyCode, setLobbyCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleLobbyUpdated = (lobbyData) => {
      console.log("Lobby updated:", lobbyData);
      if (lobbyData) {
        setPlayers(lobbyData.players || []);
        setLobbyCode(lobbyData.code || "");
        // Update selected color if this player is in the lobby
        const thisPlayer = lobbyData.players?.find((p) => p.id === socket.id);
        if (thisPlayer && thisPlayer.color) {
          setSelectedColor(thisPlayer.color);
        }
      }
    };

    const handleGameStarted = ({ gameState, yourColor }) => {
      if (yourColor) {
        socket.emit("request-player-assignment", yourColor);
        navigate("/game");
      }
    };

    socket.on("lobby-updated", handleLobbyUpdated);
    socket.on("game-started", handleGameStarted);
    socket.on("host-assigned", () => setIsHost(true));
    socket.on("error", (msg) => setError(msg));

    // Request current lobby state if we have a lobby code
    if (lobbyCode) {
      socket.emit("get-lobby", lobbyCode);
    }

    return () => {
      socket.off("lobby-updated", handleLobbyUpdated);
      socket.off("game-started", handleGameStarted);
      socket.off("host-assigned");
      socket.off("error");
    };
  }, [navigate, lobbyCode]);

  const createLobby = () => {
    setError(null);
    socket.emit("create-lobby");
  };

  const joinLobby = () => {
    setError(null);
    if (!inputCode) {
      setError("Please enter a lobby code");
      return;
    }
    const code = inputCode.trim().toUpperCase();
    if (code.length !== 6) {
      setError("Lobby code must be 6 characters");
      return;
    }
    socket.emit("join-lobby", code);
  };

  const selectColor = (color) => {
    setError(null);
    if (!lobbyCode) {
      setError("Must be in a lobby to select a color");
      return;
    }
    socket.emit("select-color", color, lobbyCode);
  };

  const startGame = () => {
    setError(null);
    if (!selectedColor) {
      setError("You must select a color before starting the game");
      return;
    }
    if (players.length < 2) {
      setError("Need at least 2 players to start");
      return;
    }
    socket.emit("start-game", lobbyCode);
  };

  const availableColors = ["red", "blue", "yellow", "green"].filter(
    (color) => !players.some((p) => p.color === color)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Parcheesi Lobby</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {!lobbyCode ? (
        <div className="flex flex-col items-center">
          <button
            onClick={createLobby}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
          >
            Create New Lobby
          </button>
          <div className="w-full max-w-md">
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Enter Lobby Code"
                className="w-full p-2 border rounded"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <button
                onClick={joinLobby}
                className="w-full px-4 py-2 bg-green-500 text-white rounded"
              >
                Join Lobby
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-4">Lobby Code: {lobbyCode}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Players</h2>
            {[...players]
              .sort((a, b) => {
                // Host always first
                if (a.isHost) return -1;
                if (b.isHost) return 1;
                // Then sort by join order using socket ID
                return a.id.localeCompare(b.id);
              })
              .map((player) => (
                <div
                  key={player.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-${
                      player.color || "gray"
                    }-500`}
                  ></div>
                  <span>{player.isHost ? "Host" : "Player"}</span>
                  {player.id === socket.id && " (You)"}
                </div>
              ))}
          </div>

          {!selectedColor && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Choose Your Color</h2>
              <div className="flex space-x-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => selectColor(color)}
                    className={`px-4 py-2 bg-${color}-500 text-white rounded capitalize`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isHost && players.length > 1 && (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-purple-500 text-white rounded"
              disabled={!selectedColor}
            >
              Start Game
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default LobbyPage;
