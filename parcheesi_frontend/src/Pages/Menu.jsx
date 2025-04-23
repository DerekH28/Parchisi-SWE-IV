// Menu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';


function Menu() {
  const navigate = useNavigate();

  const handleStartNewGame = () => {
    navigate('/new-game');
  };

  const handleMyStats = () => {
    navigate('/my-stats');
  };

  const handleViewTutorial = () => {
    navigate('/tutorial');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="menu-container">
      <header className="menu-header">
        <h1 className="menu-title">Parcheesi</h1>
        <h2 className="menu-subtitle">Chase, Race, Capture</h2>
      </header>

      <div className="menu-options">
        <h3>Choose An Option</h3>
        <button onClick={handleStartNewGame}>Start New Game</button>
        <button onClick={handleMyStats}>My Stats</button>
        <button onClick={handleViewTutorial}>View Tutorial</button>
        <button onClick={handleSettings}>Settings</button>
      </div>
      
      <button className="back-button" onClick={handleBack}>
        BACK
      </button>
    </div>
  );
}

export default Menu;
