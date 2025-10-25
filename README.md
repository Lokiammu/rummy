# Indian Rummy 13 Cards Game

A real-time multiplayer Indian Rummy game with room-based gameplay.

## Features
- Create and join rooms with unique room codes
- Real-time gameplay using WebSocket
- Perfect shuffling algorithm
- Responsive UI for web and mobile
- Indian Rummy rules (13 cards, sequences, and sets)
- Room creator gets winning advantage with step-by-step guidance

## Installation

```bash
# Install all dependencies
npm run install-all

# Run in development mode (both server and client)
npm run dev

# Or run separately
npm run server  # Start backend server on port 3001
npm run client  # Start frontend on port 3000
```

## How to Play

1. **Create Room**: Click "Create Room" to generate a unique room code
2. **Join Room**: Enter the room code to join an existing game
3. **Gameplay**: Once both players join, the game starts automatically
4. **Objective**: Form valid sequences and sets with your 13 cards
5. **Win**: Declare when you have valid combinations

## Indian Rummy Rules

- **Pure Sequence** (mandatory): Consecutive cards of same suit without joker
- **Impure Sequence**: Consecutive cards of same suit with joker
- **Set**: 3 or 4 cards of same rank but different suits

To win: Minimum 2 sequences (including 1 pure sequence) + remaining cards in sets/sequences
