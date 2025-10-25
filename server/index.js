const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createDeck, riggedShuffle, dealCards, checkWinningHand, getWinningSteps } = require('./gameLogic');

const app = express();
const server = http.createServer(app);

// Environment variables
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';

const io = socketIo(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Store active rooms
const rooms = new Map();

// Generate unique room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Create room
  socket.on('createRoom', (playerName) => {
    const roomCode = generateRoomCode();
    const room = {
      code: roomCode,
      creator: socket.id,
      players: [{
        id: socket.id,
        name: playerName,
        isCreator: true
      }],
      gameStarted: false,
      deck: [],
      discardPile: [],
      currentTurn: null,
      gameState: null
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);

    socket.emit('roomCreated', {
      roomCode,
      player: room.players[0]
    });

    console.log(`Room created: ${roomCode} by ${playerName}`);
  });

  // Join room
  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    if (room.gameStarted) {
      socket.emit('error', { message: 'Game already started' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      isCreator: false
    };

    room.players.push(player);
    socket.join(roomCode);

    // Notify both players
    io.to(roomCode).emit('playerJoined', {
      players: room.players,
      roomCode
    });

    console.log(`${playerName} joined room: ${roomCode}`);

    // Start game automatically when 2 players join
    if (room.players.length === 2) {
      startGame(roomCode);
    }
  });

  // Start game
  function startGame(roomCode) {
    const room = rooms.get(roomCode);
    if (!room || room.players.length !== 2) return;

    room.gameStarted = true;

    // Create and shuffle deck (rigged for room creator)
    const deck = createDeck();
    const { deck: shuffledDeck, creatorHand, opponentHand } = riggedShuffle(deck);

    room.deck = shuffledDeck;
    room.discardPile = [room.deck.pop()];
    room.currentTurn = room.creator; // Creator starts

    // Create game state for each player
    const creatorPlayer = room.players.find(p => p.isCreator);
    const opponentPlayer = room.players.find(p => !p.isCreator);

    room.gameState = {
      [creatorPlayer.id]: {
        hand: creatorHand,
        hasDrawn: false
      },
      [opponentPlayer.id]: {
        hand: opponentHand,
        hasDrawn: false
      }
    };

    // Get winning steps for creator
    const winningSteps = getWinningSteps(creatorHand, room.deck, room.discardPile);

    // Send game state to each player
    room.players.forEach(player => {
      const playerHand = room.gameState[player.id].hand;
      const opponentId = room.players.find(p => p.id !== player.id).id;

      io.to(player.id).emit('gameStarted', {
        yourHand: playerHand,
        opponentCardCount: room.gameState[opponentId].hand.length,
        discardPile: room.discardPile,
        currentTurn: room.currentTurn,
        isYourTurn: player.id === room.currentTurn,
        roomCode,
        players: room.players,
        winningSteps: player.isCreator ? winningSteps : null
      });
    });

    console.log(`Game started in room: ${roomCode}`);
  }

  // Draw card from deck
  socket.on('drawFromDeck', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || !room.gameStarted) return;

    if (room.currentTurn !== socket.id) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    if (room.gameState[socket.id].hasDrawn) {
      socket.emit('error', { message: 'Already drawn a card' });
      return;
    }

    if (room.deck.length === 0) {
      socket.emit('error', { message: 'Deck is empty' });
      return;
    }

    const card = room.deck.pop();
    room.gameState[socket.id].hand.push(card);
    room.gameState[socket.id].hasDrawn = true;

    socket.emit('cardDrawn', {
      card,
      yourHand: room.gameState[socket.id].hand
    });

    // Update opponent
    const opponentId = room.players.find(p => p.id !== socket.id).id;
    io.to(opponentId).emit('opponentDrewCard', {
      opponentCardCount: room.gameState[socket.id].hand.length
    });
  });

  // Draw card from discard pile
  socket.on('drawFromDiscard', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || !room.gameStarted) return;

    if (room.currentTurn !== socket.id) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    if (room.gameState[socket.id].hasDrawn) {
      socket.emit('error', { message: 'Already drawn a card' });
      return;
    }

    if (room.discardPile.length === 0) {
      socket.emit('error', { message: 'Discard pile is empty' });
      return;
    }

    const card = room.discardPile.pop();
    room.gameState[socket.id].hand.push(card);
    room.gameState[socket.id].hasDrawn = true;

    socket.emit('cardDrawn', {
      card,
      yourHand: room.gameState[socket.id].hand
    });

    // Update both players about discard pile
    io.to(roomCode).emit('discardPileUpdated', {
      discardPile: room.discardPile
    });
  });

  // Discard card
  socket.on('discardCard', ({ roomCode, cardIndex }) => {
    const room = rooms.get(roomCode);
    if (!room || !room.gameStarted) return;

    if (room.currentTurn !== socket.id) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    if (!room.gameState[socket.id].hasDrawn) {
      socket.emit('error', { message: 'Must draw a card first' });
      return;
    }

    const playerHand = room.gameState[socket.id].hand;
    if (cardIndex < 0 || cardIndex >= playerHand.length) {
      socket.emit('error', { message: 'Invalid card index' });
      return;
    }

    const discardedCard = playerHand.splice(cardIndex, 1)[0];
    room.discardPile.push(discardedCard);
    room.gameState[socket.id].hasDrawn = false;

    // Switch turn
    const opponentId = room.players.find(p => p.id !== socket.id).id;
    room.currentTurn = opponentId;

    socket.emit('cardDiscarded', {
      yourHand: playerHand,
      discardPile: room.discardPile,
      isYourTurn: false
    });

    io.to(opponentId).emit('opponentDiscarded', {
      discardedCard,
      discardPile: room.discardPile,
      opponentCardCount: playerHand.length,
      isYourTurn: true
    });
  });

  // Declare winner
  socket.on('declareWin', ({ roomCode, sequences, sets }) => {
    const room = rooms.get(roomCode);
    if (!room || !room.gameStarted) return;

    const playerHand = room.gameState[socket.id].hand;
    const isValid = checkWinningHand(playerHand, sequences, sets);

    if (isValid) {
      const winner = room.players.find(p => p.id === socket.id);
      io.to(roomCode).emit('gameOver', {
        winner: winner.name,
        winnerId: socket.id,
        sequences,
        sets
      });

      // Clean up room
      room.gameStarted = false;
      console.log(`Game over in room ${roomCode}. Winner: ${winner.name}`);
    } else {
      socket.emit('error', { message: 'Invalid declaration. You lose!' });
      const opponent = room.players.find(p => p.id !== socket.id);
      io.to(roomCode).emit('gameOver', {
        winner: opponent.name,
        winnerId: opponent.id,
        reason: 'Invalid declaration by opponent'
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Find and clean up rooms
    rooms.forEach((room, roomCode) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);

        if (room.players.length === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted`);
        } else {
          io.to(roomCode).emit('playerLeft', {
            message: 'Opponent disconnected',
            players: room.players
          });
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
