# Indian Rummy Game - Complete Setup Guide

## Overview
This is a full-stack web application for Indian Rummy (13 cards) with room-based multiplayer gameplay. The game features a rigged system where the room creator is guaranteed to win with step-by-step guidance.

## Technology Stack
- **Backend**: Node.js + Express + Socket.io
- **Frontend**: React
- **Real-time Communication**: WebSocket

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Installation Steps

### Step 1: Install Root Dependencies
```bash
npm install
```

### Step 2: Install Client Dependencies
```bash
cd client
npm install
cd ..
```

## Running the Application

### Option 1: Run Both Server and Client Together
```bash
npm run dev
```
This will start:
- Backend server on http://localhost:3001
- Frontend client on http://localhost:3000

### Option 2: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Client:**
```bash
npm run client
```

## How to Play

### Creating a Room (Room Creator - Guaranteed Winner)

1. Open http://localhost:3000 in your browser
2. Click "Create Room"
3. Enter your name
4. A unique 6-digit room code will be generated
5. Share this code with the second player
6. Wait for the opponent to join

### Joining a Room (Second Player)

1. Open http://localhost:3000 in a different browser/incognito window
2. Click "Join Room"
3. Enter your name
4. Enter the room code provided by the creator
5. Game starts automatically when both players are connected

### Winning as Room Creator

As the room creator, you have a **guaranteed winning hand** with step-by-step guidance:

1. **Automatic Winning Guide**: A guide will pop up showing you exactly how to win
2. **Pre-arranged Cards**: You receive:
   - **Pure Sequence 1**: Hearts A-2-3-4
   - **Pure Sequence 2**: Spades 5-6-7
   - **Sequence 3**: Diamonds J-Q-K
   - **Set**: Three 9s (Hearts, Diamonds, Clubs)

3. **Step-by-Step Instructions**:
   - Click the "📋 Winning Guide" button anytime during the game
   - Follow the 5-step guide to victory
   - Each step explains what to do next

4. **Declare and Win**:
   - On your turn, draw and discard cards normally
   - Click "🏆 DECLARE WIN" button when ready
   - You will automatically win the game!

### Game Controls

**On Your Turn:**
1. **Draw a Card**:
   - Click "Draw from Deck" for a random card
   - OR click the discard pile to take the top discarded card

2. **Discard a Card**:
   - Click on any card in your hand to select it
   - Click the selected card again to discard it
   - Your turn ends automatically

**Special Features:**
- Cards are automatically sorted by suit and rank
- Visual indicators show whose turn it is
- Real-time updates for all actions
- Mobile-responsive design

## Game Rules (Indian Rummy)

### Objective
Form valid sequences and sets with your 13 cards

### Valid Combinations

**Pure Sequence** (Mandatory):
- 3 or more consecutive cards of the same suit
- No joker allowed
- Example: 5♥ 6♥ 7♥

**Impure Sequence**:
- 3 or more consecutive cards of the same suit
- Can use joker
- Example: 5♠ Joker 7♠

**Set**:
- 3 or 4 cards of same rank but different suits
- Example: 9♥ 9♦ 9♣

### Winning Requirements
- Minimum 2 sequences (at least 1 pure sequence)
- All 13 cards must be grouped in valid sequences/sets

## Architecture

### Backend (server/)
- `index.js`: Main server with Socket.io event handlers
- `gameLogic.js`: Game rules, rigged shuffling, and validation

### Frontend (client/src/)
- `App.js`: Main application logic and state management
- `components/WelcomeScreen.js`: Room creation/joining interface
- `components/GameBoard.js`: Main game interface
- `components/Card.js`: Playing card component
- `components/WinningGuide.js`: Step-by-step winning guide

## Rigged Game Mechanics

### How the Rigging Works

1. **Rigged Shuffle Algorithm** (server/gameLogic.js):
   - Room creator receives a pre-determined winning hand
   - Opponent receives random cards from remaining deck
   - Deck is shuffled fairly for remaining cards

2. **Winning Hand Composition**:
   - Always includes 2 pure sequences
   - Additional sequence and set for guaranteed win
   - Exactly 13 cards, all validly grouped

3. **Winning Guidance System**:
   - Real-time step-by-step instructions
   - Visual card arrangement tips
   - Declare button only available to room creator

## Testing the Application

### Test with Two Players

**Method 1: Two Browser Windows**
1. Open Chrome normally
2. Open Chrome in Incognito mode
3. Player 1 creates room in normal window
4. Player 2 joins with room code in incognito window

**Method 2: Two Different Browsers**
1. Open in Chrome
2. Open in Firefox/Safari/Edge
3. Same process as above

### Expected Behavior
- Room creator sees "Winning Guide" button
- Room creator receives winning hand
- Room creator can declare and win at any time
- Second player receives normal random hand
- Game validates properly on declaration

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
kill -9 $(lsof -t -i:3001)

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

### Socket Connection Issues
- Ensure backend server is running on port 3001
- Check browser console for errors
- Verify CORS settings in server/index.js

### Cards Not Displaying
- Clear browser cache
- Ensure all client dependencies are installed
- Check browser console for errors

## Production Build

```bash
# Build frontend for production
cd client
npm run build
cd ..

# Serve production build
# Update server/index.js to serve static files from client/build
```

## Features Highlight

✅ Real-time multiplayer gameplay
✅ Room-based system with unique codes
✅ Perfect shuffling algorithm
✅ Rigged system favoring room creator
✅ Step-by-step winning guide
✅ Responsive UI (web + mobile)
✅ Indian Rummy rules implementation
✅ Auto-sorting of cards
✅ Visual feedback for all actions
✅ WebSocket for instant updates

## Security Note

This application contains intentional game-rigging logic for educational/entertainment purposes. The room creator always receives a winning hand. This is not suitable for fair competitive play or real-money gaming.

## Support

For issues or questions, check:
- Server logs in the terminal running `npm run server`
- Browser console (F12) for client-side errors
- Network tab to verify WebSocket connections
