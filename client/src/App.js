import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import GameBoard from './components/GameBoard';
import WinningGuide from './components/WinningGuide';

// Use environment variable for backend URL
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL);

function App() {
  const [gameState, setGameState] = useState('welcome'); // welcome, waiting, playing, gameOver
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [opponentCardCount, setOpponentCardCount] = useState(13);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [winningSteps, setWinningSteps] = useState(null);
  const [gameOverData, setGameOverData] = useState(null);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Room created
    socket.on('roomCreated', (data) => {
      setRoomCode(data.roomCode);
      setIsCreator(true);
      setPlayers([data.player]);
      setGameState('waiting');
    });

    // Player joined
    socket.on('playerJoined', (data) => {
      setPlayers(data.players);
      setRoomCode(data.roomCode);
      if (data.players.length === 1) {
        setGameState('waiting');
      }
    });

    // Game started
    socket.on('gameStarted', (data) => {
      setHand(data.yourHand);
      setDiscardPile(data.discardPile);
      setOpponentCardCount(data.opponentCardCount);
      setIsMyTurn(data.isYourTurn);
      setCurrentTurn(data.currentTurn);
      setPlayers(data.players);
      setWinningSteps(data.winningSteps);
      setGameState('playing');
      setHasDrawn(false);

      // Auto-show guide for creator
      if (data.winningSteps) {
        setTimeout(() => setShowGuide(true), 1000);
      }
    });

    // Card drawn
    socket.on('cardDrawn', (data) => {
      setHand(data.yourHand);
      setHasDrawn(true);
    });

    // Card discarded
    socket.on('cardDiscarded', (data) => {
      setHand(data.yourHand);
      setDiscardPile(data.discardPile);
      setIsMyTurn(data.isYourTurn);
      setHasDrawn(false);
      setSelectedCard(null);
    });

    // Opponent drew card
    socket.on('opponentDrewCard', (data) => {
      setOpponentCardCount(data.opponentCardCount);
    });

    // Opponent discarded
    socket.on('opponentDiscarded', (data) => {
      setDiscardPile(data.discardPile);
      setOpponentCardCount(data.opponentCardCount);
      setIsMyTurn(data.isYourTurn);
    });

    // Discard pile updated
    socket.on('discardPileUpdated', (data) => {
      setDiscardPile(data.discardPile);
    });

    // Game over
    socket.on('gameOver', (data) => {
      setGameOverData(data);
      setGameState('gameOver');
    });

    // Player left
    socket.on('playerLeft', (data) => {
      setError(data.message);
      setTimeout(() => {
        setGameState('welcome');
        resetGame();
      }, 3000);
    });

    // Error
    socket.on('error', (data) => {
      setError(data.message);
      setTimeout(() => setError(''), 3000);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('playerJoined');
      socket.off('gameStarted');
      socket.off('cardDrawn');
      socket.off('cardDiscarded');
      socket.off('opponentDrewCard');
      socket.off('opponentDiscarded');
      socket.off('discardPileUpdated');
      socket.off('gameOver');
      socket.off('playerLeft');
      socket.off('error');
    };
  }, []);

  const resetGame = () => {
    setRoomCode('');
    setIsCreator(false);
    setPlayers([]);
    setHand([]);
    setDiscardPile([]);
    setOpponentCardCount(13);
    setCurrentTurn(null);
    setIsMyTurn(false);
    setSelectedCard(null);
    setHasDrawn(false);
    setWinningSteps(null);
    setGameOverData(null);
    setError('');
    setShowGuide(false);
  };

  const handleCreateRoom = (name) => {
    setPlayerName(name);
    socket.emit('createRoom', name);
  };

  const handleJoinRoom = (name, code) => {
    setPlayerName(name);
    socket.emit('joinRoom', { roomCode: code, playerName: name });
  };

  const handleDrawFromDeck = () => {
    if (!isMyTurn || hasDrawn) return;
    socket.emit('drawFromDeck', { roomCode });
  };

  const handleDrawFromDiscard = () => {
    if (!isMyTurn || hasDrawn) return;
    socket.emit('drawFromDiscard', { roomCode });
  };

  const handleDiscardCard = (index) => {
    if (!isMyTurn || !hasDrawn) return;
    socket.emit('discardCard', { roomCode, cardIndex: index });
  };

  const handleDeclare = () => {
    // Auto-group cards for declaration
    const sequences = [
      // Hearts A-2-3-4
      hand.filter(c => c.suit === 'hearts' && ['A', '2', '3', '4'].includes(c.rank)),
      // Spades 5-6-7
      hand.filter(c => c.suit === 'spades' && ['5', '6', '7'].includes(c.rank)),
      // Diamonds J-Q-K
      hand.filter(c => c.suit === 'diamonds' && ['J', 'Q', 'K'].includes(c.rank))
    ].filter(seq => seq.length >= 3);

    const sets = [
      // Three 9s
      hand.filter(c => c.rank === '9')
    ].filter(set => set.length >= 3);

    socket.emit('declareWin', { roomCode, sequences, sets });
  };

  const handlePlayAgain = () => {
    setGameState('welcome');
    resetGame();
  };

  return (
    <div className="App">
      {error && <div className="error-notification">{error}</div>}

      {gameState === 'welcome' && (
        <WelcomeScreen
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}

      {gameState === 'waiting' && (
        <div className="waiting-screen">
          <div className="waiting-card">
            <h1>Room Code: {roomCode}</h1>
            <p className="share-code">Share this code with your opponent</p>
            <div className="players-list">
              <h2>Players ({players.length}/2)</h2>
              {players.map((player, idx) => (
                <div key={idx} className="player-item">
                  {player.name} {player.isCreator && '(Host)'}
                </div>
              ))}
            </div>
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Waiting for opponent...</p>
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <GameBoard
            hand={hand}
            discardPile={discardPile}
            opponentCardCount={opponentCardCount}
            isMyTurn={isMyTurn}
            hasDrawn={hasDrawn}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            onDrawFromDeck={handleDrawFromDeck}
            onDrawFromDiscard={handleDrawFromDiscard}
            onDiscardCard={handleDiscardCard}
            onDeclare={handleDeclare}
            roomCode={roomCode}
            players={players}
            playerName={playerName}
            isCreator={isCreator}
            onShowGuide={() => setShowGuide(true)}
            hasWinningSteps={!!winningSteps}
          />
          {winningSteps && showGuide && (
            <WinningGuide
              steps={winningSteps}
              onClose={() => setShowGuide(false)}
            />
          )}
        </>
      )}

      {gameState === 'gameOver' && gameOverData && (
        <div className="game-over-screen">
          <div className="game-over-card">
            <h1>{gameOverData.winner === playerName ? 'YOU WIN!' : 'YOU LOSE!'}</h1>
            <p className="winner-name">Winner: {gameOverData.winner}</p>
            {gameOverData.reason && <p className="reason">{gameOverData.reason}</p>}
            <button onClick={handlePlayAgain} className="play-again-btn">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
