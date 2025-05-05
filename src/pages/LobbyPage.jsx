import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import socket from "../socket";
import backgroundImage from "../assets/parcheesi_background.jpg";
import ParcheesiHeader from "../components/ParcheesiHeader.jsx";

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
    const handleLobbyUpdated = (lobbyData) => {
      if (lobbyData) {
        setPlayers(lobbyData.players || []);
        setLobbyCode(lobbyData.code || "");
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
    <div
      className="min-h-screen bg-cover  bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="mt-6">
        <ParcheesiHeader />
      </div>
      <div className="flex justify-center items-center flex-1 w-full">
        <div className="relative bg-[#D8F8F3] bg-opacity-90 rounded-2xl px-10 py-12 shadow-xl w-full max-w-md text-center border-2 border-[#42aaca]">
          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#d8f8f3] px-8 py-2 min-w-[300px] rounded-xl border-2 border-[#42aaca] shadow text-xl font-bold text-gray-800">
            {lobbyCode ? "Lobby" : "Create or Join a Lobby"}
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 mt-2 text-sm font-semibold">
              {error}
            </div>
          )}
          {!lobbyCode ? (
            <div className="flex flex-col space-y-8 mt-10">
              <button
                onClick={createLobby}
                className="w-full px-4 py-3 text-black bg-[#A3DEE7] rounded-full hover:brightness-95 transition font-bold border border-[#42aaca] shadow-sm"
              >
                Create New Lobby
              </button>
              <input
                type="text"
                placeholder="Enter Lobby Code"
                className="w-full p-3 bg-white border-2 border-[#42aaca] rounded-lg text-center text-gray-800 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#50B4D4]"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <button
                onClick={joinLobby}
                className="w-full px-4 py-3 text-black bg-white rounded-full hover:brightness-95 transition font-bold border border-[#42aaca] shadow-sm"
              >
                Join Lobby
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-8 mt-10">
              <p className="text-lg font-bold mb-2 text-gray-800">Lobby Code: <span className="font-mono text-[#42aaca]">{lobbyCode}</span></p>
              <div className="mb-2">
                <h2 className="text-lg font-bold mb-2 text-gray-800">Players</h2>
                <div className="flex flex-col items-center space-y-2">
                  {[...players]
                    .sort((a, b) => {
                      if (a.isHost) return -1;
                      if (b.isHost) return 1;
                      return a.id.localeCompare(b.id);
                    })
                    .map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center space-x-2"
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-${player.color || "gray"}-500 border border-gray-400`}
                        ></div>
                        <span className="text-gray-800 text-sm font-semibold">
                          {player.isHost ? "Host" : "Player"}
                          {player.id === socket.id && " (You)"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              {!selectedColor && (
                <div className="mb-2">
                  <h2 className="text-base font-semibold mb-2 text-gray-800">Choose Your Color</h2>
                  <div className="flex space-x-2 justify-center">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => selectColor(color)}
                        className={`px-4 py-2 bg-${color}-500 text-white rounded-full capitalize font-bold border border-gray-300 shadow-sm hover:brightness-95 transition`}
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
                  className="w-full px-4 py-3 text-black bg-[#A3DEE7] rounded-full hover:brightness-95 transition font-bold border border-[#42aaca] shadow-sm"
                  disabled={!selectedColor}
                >
                  Start Game
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
