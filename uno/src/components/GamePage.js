import React from "react";
import { connect } from "react-redux";
import uuid from "react-uuid";

const GamePage = (props) => {
  return (
    <div>
      <h1>Game</h1>
      <div>
        {props.player1Deck.map((card) => {
          return <h6 key={uuid()}>{card}</h6>;
        })}
      </div>
      <hr></hr>
      <div>
        <h1>Current Card: {props.playedCardsPile[0]}</h1>
      </div>
      <hr></hr>
      <div>
        {props.player2Deck.map((card) => {
          return <h6 key={uuid()}>{card}</h6>;
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    gameOver: state.gameOver,
    turn: state.turn,
    player1Deck: state.player1Deck,
    player2Deck: state.player2Deck,
    currentColor: state.currentColor,
    currentNumber: state.currentNumber,
    playedCardsPile: state.playedCardsPile,
    drawCardPile: state.drawCardPile,
  };
};

export default connect(mapStateToProps)(GamePage);
