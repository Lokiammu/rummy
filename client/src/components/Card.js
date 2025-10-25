import React from 'react';
import './Card.css';

function Card({ card }) {
  const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <div className={`playing-card ${isRed ? 'red' : 'black'}`}>
      <div className="card-corner top-left">
        <div className="rank">{card.rank}</div>
        <div className="suit">{suitSymbols[card.suit]}</div>
      </div>
      <div className="card-center">
        <span className="suit-symbol">{suitSymbols[card.suit]}</span>
      </div>
      <div className="card-corner bottom-right">
        <div className="rank">{card.rank}</div>
        <div className="suit">{suitSymbols[card.suit]}</div>
      </div>
    </div>
  );
}

export default Card;
