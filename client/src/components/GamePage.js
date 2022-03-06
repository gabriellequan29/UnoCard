import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import uuid from "react-uuid";
import Card from "./Card";
import { Link } from "react-router-dom";
import { PLAY_CARD, DRAW_CARD } from "../actions/constants";

const GamePage = (props) => {
  return props.gameOver ? (
    <div>
      <h1>GAME OVER</h1>
      <Link to="/">
        <button>GO BACK</button>
      </Link>
      {props.winner !== "" && (
        <>
          <h2>{props.winner} wins!</h2>
        </>
      )}
    </div>
  ) : (
    <div>
      <Link to="/">
        <button>GO BACK</button>
      </Link>
      <h1>Turn: {props.turn}</h1>
      <div>
        {props.player1Deck.map((item) => (
          <Card item={item} myClick={() => props.onCardPlayed(item)} key={uuid()} />
        ))}
      </div>
      <hr></hr>
      <div>
        <h1>
          Current Card:{props.playedCardsPile[props.playedCardsPile.length - 1]}
          <br/>
          Current Color:{props.currentColor}
        </h1>
        <button onClick={props.onCardDrawn}>DRAW CARD</button>
      </div>
      <hr></hr>
      <div>
        {props.player2Deck.map((item) => (
          <Card item={item} myClick={() => props.onCardPlayed(item)} key={uuid()} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    gameOver: state.gameOver,
    winner: state.winner,
    turn: state.turn,
    player1Deck: state.player1Deck,
    player2Deck: state.player2Deck,
    currentColor: state.currentColor,
    currentNumber: state.currentNumber,
    playedCardsPile: state.playedCardsPile,
    drawCardPile: state.drawCardPile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCardDrawn: () => dispatch({ type: DRAW_CARD }),
    onCardPlayed: (card) =>
    dispatch({ type: PLAY_CARD, payload: { cardPlayed: card } }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
