import shuffle from "../utils/shuffle";
import { CARDS } from "../utils/cards";
import { START_GAME } from "../actions/constants";



const reducer = (state = {}, action) => {
  switch (action.type) {
    case START_GAME:
      //shuffle cards
      const shuffledCards = shuffle(CARDS);

      //extract 7 elements to player1Deck
      const player1Deck = shuffledCards.splice(0, 7);

      //extract 7 elements to player2Deck
      const player2Deck = shuffledCards.splice(0, 7);

      //extract random card from shuffledCards and check if its not an action card
      let startingCardIndex;
      while (true) {
        startingCardIndex = Math.floor(Math.random() * 94);
        if (
          shuffledCards[startingCardIndex] === "skipR" ||
          shuffledCards[startingCardIndex] === "revR" ||
          shuffledCards[startingCardIndex] === "D2R" ||
          shuffledCards[startingCardIndex] === "skipG" ||
          shuffledCards[startingCardIndex] === "revG" ||
          shuffledCards[startingCardIndex] === "D2G" ||
          shuffledCards[startingCardIndex] === "skipB" ||
          shuffledCards[startingCardIndex] === "revB" ||
          shuffledCards[startingCardIndex] === "D2B" ||
          shuffledCards[startingCardIndex] === "skipY" ||
          shuffledCards[startingCardIndex] === "revY" ||
          shuffledCards[startingCardIndex] === "D2Y" ||
          shuffledCards[startingCardIndex] === "W" ||
          shuffledCards[startingCardIndex] === "D4W"
        ) {
          continue;
        } else break;
      }
      //extract the card from that startingCardIndex into the playedCardsPile
      const playedCardsPile = shuffledCards.splice(startingCardIndex, 1);

      //store all remaining cards into drawCardPile
      const drawCardPile = shuffledCards;

      return {
        gameOver: false,
        turn: "Player 1",
        player1Deck: [...player1Deck],
        player2Deck: [...player2Deck],
        currentColor: playedCardsPile[0].charAt(1),
        currentNumber: playedCardsPile[0].charAt(0),
        playedCardsPile: [...playedCardsPile],
        drawCardPile: [...drawCardPile],
      };

      default:
        return state;
  }
  
};

export default reducer;
