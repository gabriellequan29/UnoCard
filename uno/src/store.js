import { createStore, combineReducers } from "redux";
import gameReducer from "./reducers/gameReducer";
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {
    gameOver: true,
    winner: '',
    turn: "",
    player1Deck: [],
    player2Deck: [],
    currentColor: "",
    currentNumber: "",
    playedCardsPile: [],
    drawCardPile: [],
  };

const store = createStore(gameReducer, initialState, composeWithDevTools(
  ))

export default store