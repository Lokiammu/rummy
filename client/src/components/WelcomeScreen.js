import React, { useState } from 'react';
import './WelcomeScreen.css';

function WelcomeScreen({ onCreateRoom, onJoinRoom }) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState(null); // null, 'create', 'join'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (mode === 'create') {
      onCreateRoom(playerName.trim());
    } else if (mode === 'join') {
      if (!roomCode.trim()) {
        alert('Please enter room code');
        return;
      }
      onJoinRoom(playerName.trim(), roomCode.trim().toUpperCase());
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1 className="game-title">Indian Rummy</h1>
          <p className="game-subtitle">13 Cards • 2 Players</p>
        </div>

        {!mode ? (
          <div className="mode-selection">
            <button
              className="mode-btn create-btn"
              onClick={() => setMode('create')}
            >
              <div className="btn-icon">+</div>
              <div className="btn-text">Create Room</div>
              <div className="btn-desc">Start a new game</div>
            </button>

            <button
              className="mode-btn join-btn"
              onClick={() => setMode('join')}
            >
              <div className="btn-icon">→</div>
              <div className="btn-text">Join Room</div>
              <div className="btn-desc">Enter room code</div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="room-form">
            <div className="form-group">
              <label htmlFor="playerName">Your Name</label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                autoFocus
              />
            </div>

            {mode === 'join' && (
              <div className="form-group">
                <label htmlFor="roomCode">Room Code</label>
                <input
                  id="roomCode"
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  style={{ textTransform: 'uppercase', letterSpacing: '2px' }}
                />
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={() => setMode(null)} className="back-btn">
                Back
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Create Room' : 'Join Room'}
              </button>
            </div>
          </form>
        )}

        <div className="welcome-footer">
          <div className="rules-preview">
            <h3>Quick Rules</h3>
            <ul>
              <li>Form sequences and sets with 13 cards</li>
              <li>Need minimum 2 sequences (1 pure)</li>
              <li>Pure sequence = consecutive cards, same suit</li>
              <li>Set = 3-4 cards of same rank, different suits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
