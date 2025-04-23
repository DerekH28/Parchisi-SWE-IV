import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabase";

/**
 * Game Options Page: Create or Join Games
 */
const GameOptionsPage = () => {
  const navigate = useNavigate();
  const [showJoinCodePopup, setShowJoinCodePopup] = useState(false);
  const [showPublicLobbyPopup, setShowPublicLobbyPopup] = useState(false);
  const [code, setCode] = useState("");
  const [publicGames, setPublicGames] = useState([]);

  // Fetch public games when opening public lobby popup
  const openPublicLobby = async () => {
    const { data } = await supabase
      .from("games")
      .select()
      .eq("is_public", true)
      .eq("status", "waiting");

    setPublicGames(data || []);
    setShowPublicLobbyPopup(true);
  };

  // Create Public Lobby
  const createPublicGame = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase
      .from("games")
      .insert([{ code, host_user_id: supabase.auth.user().id, is_public: true }])
      .select()
      .single();

    if (error) {
      console.error("Error creating game:", error);
      return;
    }

    navigate(`/game/${data.id}`);
  };

  // Join by code
  const joinByCode = async () => {
    const { data, error } = await supabase
      .from("games")
      .select()
      .eq("code", code.toUpperCase())
      .single();

    if (error || !data) {
      alert("Game not found.");
      return;
    }

    navigate(`/game/${data.id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">

      <h1 className="text-3xl font-bold mb-4">Parcheesi - Multiplayer</h1>

      <button
        onClick={createPublicGame}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        Create Public Lobby
      </button>

      <button
        onClick={() => setShowJoinCodePopup(true)}
        className="px-6 py-3 bg-green-600 text-white rounded"
      >
        Join Friends with Code
      </button>

      <button
        onClick={openPublicLobby}
        className="px-6 py-3 bg-yellow-600 text-white rounded"
      >
        Join Public Lobby
      </button>

      {/* --- Join by Code Popup --- */}
      {showJoinCodePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded space-y-4">
            <h2 className="text-xl font-semibold">Enter Game Code</h2>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ABC123"
              className="border rounded px-2 py-1"
            />
            <div className="space-x-2">
              <button onClick={joinByCode} className="bg-green-500 px-4 py-2 text-white rounded">Join</button>
              <button onClick={() => setShowJoinCodePopup(false)} className="bg-red-500 px-4 py-2 text-white rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Public Lobby Popup --- */}
      {showPublicLobbyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded space-y-4 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold">Public Games</h2>
            {publicGames.length > 0 ? (
              publicGames.map((game) => (
                <div key={game.id} className="flex justify-between items-center border-b py-2">
                  <span>Code: {game.code}</span>
                  <button
                    onClick={() => navigate(`/game/${game.id}`)}
                    className="bg-blue-500 px-3 py-1 text-white rounded"
                  >
                    Join
                  </button>
                </div>
              ))
            ) : (
              <p>No public games available.</p>
            )}
            <button onClick={() => setShowPublicLobbyPopup(false)} className="bg-red-500 px-4 py-2 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameOptionsPage;
