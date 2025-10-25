// Indian Rummy Game Logic

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RANK_VALUES = {
  'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
};

// Create a standard deck of 52 cards
function createDeck() {
  const deck = [];
  for (let suit of SUITS) {
    for (let rank of RANKS) {
      deck.push({
        suit,
        rank,
        value: RANK_VALUES[rank],
        id: `${rank}_${suit}`
      });
    }
  }
  return deck;
}

// Fisher-Yates shuffle algorithm (for fair shuffling)
function shuffle(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create a winning hand for the room creator
function createWinningHand(deck) {
  const winningHand = [];

  // Strategy: Give creator strong sequences and sets

  // Pure sequence 1: Hearts A-2-3-4
  const heartsSequence = deck.filter(card =>
    card.suit === 'hearts' && ['A', '2', '3', '4'].includes(card.rank)
  );
  winningHand.push(...heartsSequence);

  // Pure sequence 2: Spades 5-6-7
  const spadesSequence = deck.filter(card =>
    card.suit === 'spades' && ['5', '6', '7'].includes(card.rank)
  );
  winningHand.push(...spadesSequence);

  // Set 1: Three 9s (different suits)
  const nineSet = deck.filter(card =>
    card.rank === '9' && ['hearts', 'diamonds', 'clubs'].includes(card.suit)
  );
  winningHand.push(...nineSet);

  // Additional cards for sequence: Diamonds J-Q-K
  const diamondsSequence = deck.filter(card =>
    card.suit === 'diamonds' && ['J', 'Q', 'K'].includes(card.rank)
  );
  winningHand.push(...diamondsSequence);

  return winningHand.slice(0, 13); // Ensure exactly 13 cards
}

// Rigged shuffle that gives creator a winning hand
function riggedShuffle(deck) {
  const shuffledDeck = shuffle([...deck]);

  // Create winning hand for creator
  const creatorHand = createWinningHand(shuffledDeck);

  // Remove creator's cards from deck
  const remainingDeck = shuffledDeck.filter(card =>
    !creatorHand.some(c => c.id === card.id)
  );

  // Deal 13 random cards to opponent
  const opponentHand = remainingDeck.slice(0, 13);
  const finalDeck = remainingDeck.slice(13);

  return {
    deck: finalDeck,
    creatorHand,
    opponentHand
  };
}

// Deal cards to players
function dealCards(deck, numPlayers = 2, cardsPerPlayer = 13) {
  const hands = [];
  let deckCopy = [...deck];

  for (let i = 0; i < numPlayers; i++) {
    hands.push(deckCopy.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer));
  }

  return {
    hands,
    remainingDeck: deckCopy.slice(numPlayers * cardsPerPlayer)
  };
}

// Check if cards form a valid sequence
function isValidSequence(cards) {
  if (cards.length < 3) return false;

  // All cards must be same suit
  const suit = cards[0].suit;
  if (!cards.every(card => card.suit === suit)) return false;

  // Sort by value
  const sorted = [...cards].sort((a, b) => a.value - b.value);

  // Check consecutive values
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].value - sorted[i-1].value !== 1) {
      return false;
    }
  }

  return true;
}

// Check if cards form a valid set
function isValidSet(cards) {
  if (cards.length < 3 || cards.length > 4) return false;

  // All cards must have same rank
  const rank = cards[0].rank;
  if (!cards.every(card => card.rank === rank)) return false;

  // All cards must have different suits
  const suits = cards.map(card => card.suit);
  const uniqueSuits = new Set(suits);
  if (suits.length !== uniqueSuits.size) return false;

  return true;
}

// Check if hand has at least one pure sequence
function hasPureSequence(sequences) {
  return sequences.some(seq => isValidSequence(seq));
}

// Validate winning hand
function checkWinningHand(hand, sequences, sets) {
  // Must have at least 2 sequences
  if (sequences.length < 2) return false;

  // Must have at least 1 pure sequence
  if (!hasPureSequence(sequences)) return false;

  // Validate each sequence
  for (let seq of sequences) {
    if (!isValidSequence(seq)) return false;
  }

  // Validate each set
  for (let set of sets) {
    if (!isValidSet(set)) return false;
  }

  // Check if all cards are used
  const totalCards = sequences.flat().length + sets.flat().length;
  if (totalCards !== 13) return false;

  return true;
}

// Get winning steps for the creator
function getWinningSteps(hand, deck, discardPile) {
  const steps = [
    {
      step: 1,
      action: "ARRANGE YOUR CARDS",
      description: "You have a WINNING hand! Organize your cards into sequences and sets.",
      details: "Look for consecutive cards of the same suit (sequences) and same rank cards (sets)"
    },
    {
      step: 2,
      action: "IDENTIFY YOUR SEQUENCES",
      description: "Find your pure sequences (no jokers):",
      details: [
        "Hearts: A-2-3-4 (Pure Sequence)",
        "Spades: 5-6-7 (Pure Sequence)",
        "Diamonds: J-Q-K (Sequence)"
      ]
    },
    {
      step: 3,
      action: "IDENTIFY YOUR SETS",
      description: "Find your sets (same rank, different suits):",
      details: [
        "Three 9s (Hearts, Diamonds, Clubs)"
      ]
    },
    {
      step: 4,
      action: "COMPLETE YOUR TURN",
      description: "On your turn:",
      details: [
        "1. Draw a card from deck or discard pile",
        "2. Discard any unwanted card",
        "3. Keep improving your hand if needed"
      ]
    },
    {
      step: 5,
      action: "DECLARE AND WIN!",
      description: "When ready, click 'DECLARE' to win the game!",
      details: [
        "You already have 2 pure sequences (mandatory)",
        "You have additional sequence and set",
        "All 13 cards are grouped validly",
        "YOU WILL WIN!"
      ]
    }
  ];

  return steps;
}

// Auto-group cards for display
function autoGroupCards(hand) {
  const grouped = {
    sequences: [],
    sets: [],
    ungrouped: []
  };

  // Sort hand by suit and rank
  const sorted = [...hand].sort((a, b) => {
    if (a.suit !== b.suit) {
      return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
    }
    return a.value - b.value;
  });

  return sorted;
}

module.exports = {
  createDeck,
  shuffle,
  riggedShuffle,
  dealCards,
  isValidSequence,
  isValidSet,
  checkWinningHand,
  getWinningSteps,
  autoGroupCards
};
