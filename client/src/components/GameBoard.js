import React from 'react';
import './GameBoard.css';
import Card from './Card';

function GameBoard({
  hand,
  discardPile,
  opponentCardCount,
  isMyTurn,
  hasDrawn,
  selectedCard,
  setSelectedCard,
  onDrawFromDeck,
  onDrawFromDiscard,
  onDiscardCard,
  onDeclare,
  roomCode,
  players,
  playerName,
  isCreator,
  onShowGuide,
  hasWinningSteps
}) {
  const opponent = players.find(p => p.name !== playerName);

  const handleCardClick = (index) => {
    if (!hasDrawn || !isMyTurn) return;
    if (selectedCard === index) {
      // Discard selected card
      onDiscardCard(index);
    } else {
      setSelectedCard(index);
    }
  };

  const sortHand = (cards) => {
    return [...cards].sort((a, b) => {
      const suitOrder = { hearts: 0, diamonds: 1, clubs: 2, spades: 3 };
      if (suitOrder[a.suit] !== suitOrder[b.suit]) {
        return suitOrder[a.suit] - suitOrder[b.suit];
      }
      return a.value - b.value;
    });
  };

  const sortedHand = sortHand(hand);

  return (
    <div className="game-board">
      {/* Header */}
      <div className="game-header">
        <div className="room-info">
          <span className="room-code">Room: {roomCode}</span>
          {hasWinningSteps && (
            <button className="guide-btn" onClick={onShowGuide}>
              📋 Winning Guide
            </button>
          )}
        </div>
        <div className="turn-indicator">
          {isMyTurn ? (
            <span className="your-turn">YOUR TURN</span>
          ) : (
            <span className="opponent-turn">Opponent's Turn</span>
          )}
        </div>
      </div>

      {/* Opponent Area */}
      <div className="opponent-area">
        <div className="opponent-info">
          <div className="opponent-name">{opponent?.name || 'Opponent'}</div>
          <div className="opponent-cards">
            {Array.from({ length: opponentCardCount }).map((_, i) => (
              <div key={i} className="opponent-card-back"></div>
            ))}
          </div>
          <div className="opponent-card-count">{opponentCardCount} cards</div>
        </div>
      </div>

      {/* Middle Area - Deck and Discard Pile */}
      <div className="middle-area">
        <div className="deck-container">
          <button
            className="deck draw-pile"
            onClick={onDrawFromDeck}
            disabled={!isMyTurn || hasDrawn}
          >
            <div className="deck-icon">🂠</div>
            <div className="deck-label">Draw from Deck</div>
          </button>

          <div className="discard-pile-container">
            {discardPile.length > 0 ? (
              <button
                className="discard-pile"
                onClick={onDrawFromDiscard}
                disabled={!isMyTurn || hasDrawn}
              >
                <Card card={discardPile[discardPile.length - 1]} />
                <div className="pile-label">Discard Pile ({discardPile.length})</div>
              </button>
            ) : (
              <div className="discard-pile empty">
                <div className="empty-label">Empty</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Hand */}
      <div className="player-area">
        <div className="player-info">
          <div className="player-name">{playerName} (You)</div>
          {hasDrawn && (
            <div className="action-hint">
              {selectedCard !== null
                ? 'Click selected card again to discard'
                : 'Select a card to discard'}
            </div>
          )}
        </div>

        <div className="player-hand">
          {sortedHand.map((card, index) => (
            <div
              key={index}
              className={`card-wrapper ${selectedCard === index ? 'selected' : ''} ${
                hasDrawn && isMyTurn ? 'clickable' : ''
              }`}
              onClick={() => handleCardClick(index)}
            >
              <Card card={card} />
            </div>
          ))}
        </div>

        <div className="player-actions">
          {!hasDrawn && isMyTurn && (
            <div className="instruction">Draw a card to start your turn</div>
          )}
          {hasDrawn && isMyTurn && (
            <div className="instruction">Select and discard a card to end your turn</div>
          )}
          {isCreator && (
            <button
              className="declare-btn"
              onClick={onDeclare}
              disabled={!hasDrawn || hand.length !== 13}
            >
              🏆 DECLARE WIN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
