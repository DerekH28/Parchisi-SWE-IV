import { useState, useEffect } from "react";
import { socket, storedPlayerId } from "../api/sockets";

const DiceRoller = () => {
  const [total, setTotal] = useState(0);
  const [diceRolls, setDiceRolls] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [hasJoined, setHasJoined] = useState(
    !!localStorage.getItem("playerName")
  );

  useEffect(() => {
    socket.on("gameState", (data) => {
      setTotal(data.totalAmount);
      setPlayers(data.players);
      setCurrentPlayer(data.currentTurn);
    });

    socket.on("totalUpdate", (newTotal) => {
      setRolling(false);
      setTotal(newTotal);
    });

    socket.on("diceRolled", (data) => {
      setRolling(false);
      setDiceRolls((prev) => [...prev, data]);
    });

    socket.on("turnUpdate", (nextPlayerId) => {
      setCurrentPlayer(nextPlayerId);
    });

    socket.on("playerListUpdate", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on("notYourTurn", () => {
      alert("It's not your turn!");
    });

    if (playerName) {
      socket.emit("joinGame", storedPlayerId, playerName);
    }

    return () => {
      socket.off("gameState");
      socket.off("totalUpdate");
      socket.off("diceRolled");
      socket.off("turnUpdate");
      socket.off("playerListUpdate");
      socket.off("notYourTurn");
    };
  }, [playerName]);

  const handleJoinGame = () => {
    if (playerName.trim()) {
      localStorage.setItem("playerName", playerName);
      setHasJoined(true);
      socket.emit("joinGame", storedPlayerId, playerName);
    }
  };

  const handleLogout = () => {
    socket.emit("leaveGame", storedPlayerId);
    localStorage.removeItem("playerName");
    localStorage.removeItem("playerId");
    setPlayerName("");
    setHasJoined(false);
  };

  const rollDice = (operation) => {
    if (storedPlayerId !== currentPlayer) {
      alert("Wait for your turn!");
      return;
    }

    setRolling(true);
    setTimeout(() => {
      socket.emit("rollDice", storedPlayerId, operation);
    }, 2000);
  };

  return (
    <div>
      {!hasJoined ? (
        <div>
          <h2>Enter Your Name to Join</h2>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your Name"
          />
          <button onClick={handleJoinGame}>Join Game</button>
        </div>
      ) : (
        <>
          <h2>Shared Total: {total}</h2>
          <h3>
            {currentPlayer
              ? currentPlayer === storedPlayerId
                ? "Your Turn!"
                : `Waiting for ${
                    players.find((p) => p.id === currentPlayer)?.name ||
                    "Unknown"
                  }`
              : "Waiting for players..."}
          </h3>

          <button
            onClick={() => rollDice("add")}
            disabled={rolling || storedPlayerId !== currentPlayer}
          >
            {rolling ? "Rolling..." : "Roll & Add"}
          </button>
          <button
            onClick={() => rollDice("subtract")}
            disabled={rolling || storedPlayerId !== currentPlayer}
          >
            {rolling ? "Rolling..." : "Roll & Subtract"}
          </button>

          <h3>Players in Game</h3>
          <ul>
            {players.map((player, index) => (
              <li
                key={index}
                style={{
                  fontWeight: player.id === currentPlayer ? "bold" : "normal",
                }}
              >
                {player.name}{" "}
                {player.id === currentPlayer ? "(Current Turn)" : ""}
              </li>
            ))}
          </ul>

          <h3>Recent Rolls</h3>
          <ul>
            {diceRolls.slice(-5).map((roll, index) => (
              <li key={index}>
                {roll.player} rolled a {rolling ? "🎲" : roll.roll} (
                {roll.operation})
              </li>
            ))}
          </ul>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              color: "white",
              backgroundColor: "red",
            }}
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
};

export default DiceRoller;
