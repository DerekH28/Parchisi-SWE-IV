import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import GamePage from "./pages/GamePage";
import { AuthProvider } from "./context/AuthProvider";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import MenuPage from "./pages/MenuPG";
import TutorialPage from "./pages/TutorialPage";
import LobbyPage from "./pages/LobbyPage";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
