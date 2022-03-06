import shuffle from "../utils/shuffle";
import { CARDS } from "../utils/cards";
import { START_GAME, PLAY_CARD, DRAW_CARD } from "../actions/constants";

const isGameOver = (arr) => {
  return arr.length === 1
}

const setWinner = (arr, player) => {
  return arr.length === 1 ? player : ''
}

const COLOR = ['R', 'B', 'Y', 'R'];

const gameReducer = (state = {}, action) => {
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
          shuffledCards[startingCardIndex] === "_R" ||
          shuffledCards[startingCardIndex] === "D2R" ||
          shuffledCards[startingCardIndex] === "skipG" ||
          shuffledCards[startingCardIndex] === "_G" ||
          shuffledCards[startingCardIndex] === "D2G" ||
          shuffledCards[startingCardIndex] === "skipB" ||
          shuffledCards[startingCardIndex] === "_B" ||
          shuffledCards[startingCardIndex] === "D2B" ||
          shuffledCards[startingCardIndex] === "skipY" ||
          shuffledCards[startingCardIndex] === "_Y" ||
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


    case PLAY_CARD:
      const cardPlayedBy = state.turn;
      switch (action.payload.cardPlayed) {
        case "0R": case "1R": case "2R": case "3R": case "4R": case "5R": case "6R": case "7R": case "8R": case "9R": case "_R":
        case "0G": case "1G": case "2G": case "3G": case "4G": case "5G": case "6G": case "7G": case "8G": case "9G": case "_G":
        case "0B": case "1B": case "2B": case "3B": case "4B": case "5B": case "6B": case "7B": case "8B": case "9B": case "_B":
        case "0Y": case "1Y": case "2Y": case "3Y": case "4Y": case "5Y": case "6Y": case "7Y": case "8Y": case "9Y": case "_Y": {
          const numberOfPlayedCard = action.payload.cardPlayed.charAt(0);
          const colorOfPlayedCard = action.payload.cardPlayed.charAt(1);

          if (state.currentColor === colorOfPlayedCard) {
            console.log("colors matched!");
            if (cardPlayedBy === "Player 1") {
              const removeIndex = state.player1Deck.indexOf(
                action.payload.cardPlayed
              );
              if (removeIndex === -1) {
                alert("Invalid Move! -  NOT YOUR TURN");
                return state;
              }
              return {
                ...state,
                gameOver: isGameOver(state.player1Deck),
                winner: setWinner(state.player1Deck, 'Player 1'),
                turn: "Player 2",
                playedCardsPile: [
                  ...state.playedCardsPile,
                  action.payload.cardPlayed,
                ],
                player1Deck: [
                  ...state.player1Deck.slice(0, removeIndex),
                  ...state.player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              };
            } else {
              const removeIndex = state.player2Deck.indexOf(
                action.payload.cardPlayed
              );
              if (removeIndex === -1) {
                alert("Invalid Move! - NOT YOUR TURN");
                return state;
              }
              return {
                ...state,
                gameOver: isGameOver(state.player2Deck),
                winner: setWinner(state.player2Deck, 'Player 2'),
                turn: "Player 1",
                playedCardsPile: [
                  ...state.playedCardsPile,
                  action.payload.cardPlayed,
                ],
                player2Deck: [
                  ...state.player2Deck.slice(0, removeIndex),
                  ...state.player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              };
            } 
               
          } else if (state.currentNumber === numberOfPlayedCard) {
            console.log("numbers matched!");
            if (cardPlayedBy === "Player 1") {
              const removeIndex = state.player1Deck.indexOf(
                action.payload.cardPlayed
              );
              if (removeIndex === -1) {
                alert("Invalid Move! - NOT YOUR TURN");
                return state;
              }
              return {
                ...state,
                gameOver: isGameOver(state.player1Deck),
                winner: setWinner(state.player1Deck, 'Player 1'),
                turn: "Player 2",
                playedCardsPile: [
                  ...state.playedCardsPile,
                  action.payload.cardPlayed,
                ],
                player1Deck: [
                  ...state.player1Deck.slice(0, removeIndex),
                  ...state.player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              };
            } else if (cardPlayedBy === "Player 2"){
              const removeIndex = state.player2Deck.indexOf(
                action.payload.cardPlayed
              );
              if (removeIndex === -1) {
                alert("Invalid Move! - NOT YOUR TURN");
                return state;
              }
              return {
                ...state,
                gameOver: isGameOver(state.player2Deck),
                winner: setWinner(state.player2Deck, 'Player 2'),
                turn: "Player 1",
                playedCardsPile: [
                  ...state.playedCardsPile,
                  action.payload.cardPlayed,
                ],
                player2Deck: [
                  ...state.player2Deck.slice(0, removeIndex),
                  ...state.player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              };
            } else {
              alert("Invalid Move! - normal card");
              return state;
            }
          } else {
            alert("Invalid Move! - normal card");
            return state;
          }
          
        }

        case "skipR":
        case "skipG":
        case "skipB":
        case "skipY": {
          const colorOfPlayedCard = action.payload.cardPlayed.charAt(4);
          if (state.currentColor === colorOfPlayedCard) {
            console.log("colors matched!");
            if (cardPlayedBy === "Player 1") {
              const removeIndex = state.player1Deck.indexOf(
                action.payload.cardPlayed
              );
              if (removeIndex === -1) {
                alert("Invalid Move! - NOT YOUR TURN");
                return state;
              }
              return {
                ...state,
                gameOver: isGameOver(state.player1Deck),
                winner: setWinner(state.player1Deck, 'Player 1'),
                playedCardsPile: [
                  ...state.playedCardsPile,
                  action.payload.cardPlayed,
                ],
                player1Deck: [
                  ...state.player1Deck.slice(0, removeIndex),
                  ...state.player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
              };
            } else {
              const removeIndex = state.player2Deck.indexOf(
                action.payload.cardPlayed
              );
              if (removeIndex === -1) {
                alert("Invalid Move! - NOT YOUR TURN");
                return state;
              }
              return {
                ...state,
                gameOver: isGameOver(state.player2Deck),
                winner: setWinner(state.player2Deck, 'Player 2'),
                playedCardsPile: [
                  ...state.playedCardsPile,
                  action.payload.cardPlayed,
                ],
                player2Deck: [
                  ...state.player2Deck.slice(0, removeIndex),
                  ...state.player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
              };
            }
          } else if (state.currentNumber === 404) {
            console.log("Numbers matched!");
            if (cardPlayedBy === "Player 1") {
              const removeIndex = state.player1Deck.indexOf(
                action.payload.cardPlayed
              );
              if (removeIndex === -1) {
                alert("Invalid Move! - NOT YOUR TURN");
                return state;
              }
              return {
                ...state,
                gameOver: isGameOver(state.player1Deck),
                winner: setWinner(state.player1Deck, 'Player 1'),
                playedCardsPile: [
                  ...state.playedCardsPile,
                  action.payload.cardPlayed,
                ],
                player1Deck: [
                  ...state.player1Deck.slice(0, removeIndex),
                  ...state.player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
              };
            } else {
              const removeIndex = state.player2Deck.indexOf(
                action.payload.cardPlayed
              );
              if (removeIndex === -1) {
                alert("Invalid Move! - NOT YOUR TURN");
                return state;
              }
              return {
                ...state,
                gameOver: isGameOver(state.player2Deck),
                winner: setWinner(state.player2Deck, 'Player 2'),
                playedCardsPile: [
                  ...state.playedCardsPile,
                  action.payload.cardPlayed,
                ],
                player2Deck: [
                  ...state.player2Deck.slice(0, removeIndex),
                  ...state.player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
              };
            }
          } else {
            alert("Invalid Move! -- skip card");
            return state;
          }
        }

        case "D2R":
        case "D2G":
        case "D2B":
        case "D2Y": {
      const colorOfPlayedCard = action.payload.cardPlayed.charAt(2);

      if (state.currentColor === colorOfPlayedCard) {
        console.log("colors matched!");
        if (cardPlayedBy === "Player 1") {
          const removeIndex = state.player1Deck.indexOf(
            action.payload.cardPlayed
          );
          if (removeIndex === -1) {
            alert("Invalid Move! - NOT YOUR TURN");
            return state;
          }

          const copiedDrawCardPileArray = [...state.drawCardPile];
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();

          return {
            ...state,
            gameOver: isGameOver(state.player1Deck),
            winner: setWinner(state.player1Deck, 'Player 1'),
            playedCardsPile: [
              ...state.playedCardsPile,
              action.payload.cardPlayed,
            ],
            player1Deck: [
              ...state.player1Deck.slice(0, removeIndex),
              ...state.player1Deck.slice(removeIndex + 1),
            ],
            player2Deck: [
              ...state.player2Deck.slice(0, state.player2Deck.length),
              drawCard1,
              drawCard2,
              ...state.player2Deck.slice(state.player2Deck.length),
            ],
            currentColor: colorOfPlayedCard,
            currentNumber: 1024,
            drawCardPile: [...copiedDrawCardPileArray],
          };
        } else {
          const removeIndex = state.player2Deck.indexOf(
            action.payload.cardPlayed
          );
          if (removeIndex === -1) {
            alert("Invalid Move! - NOT YOUR TURN");
            return state;
          }

          const copiedDrawCardPileArray = [...state.drawCardPile];
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();
          return {
            ...state,
            gameOver: isGameOver(state.player2Deck),
            winner: setWinner(state.player2Deck, 'Player 2'),
            playedCardsPile: [
              ...state.playedCardsPile,
              action.payload.cardPlayed,
            ],
            player2Deck: [
              ...state.player2Deck.slice(0, removeIndex),
              ...state.player2Deck.slice(removeIndex + 1),
            ],
            player1Deck: [
              ...state.player1Deck.slice(0, state.player1Deck.length),
              drawCard1,
              drawCard2,
              ...state.player1Deck.slice(state.player1Deck.length),
            ],
            currentColor: colorOfPlayedCard,
            currentNumber: 1024,
            drawCardPile: [...copiedDrawCardPileArray],
          };
        }
      }

      if (state.currentNumber === 1024) {
        console.log("colors matched!");
        if (cardPlayedBy === "Player 1") {
          const removeIndex = state.player1Deck.indexOf(
            action.payload.cardPlayed
          );
          if (removeIndex === -1) {
            alert("Invalid Move! - NOT YOUR TURN");
            return state;
          }

          const copiedDrawCardPileArray = [...state.drawCardPile];
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();

          return {
            ...state,
            gameOver: isGameOver(state.player1Deck),
            winner: setWinner(state.player1Deck, 'Player 1'),
            playedCardsPile: [
              ...state.playedCardsPile,
              action.payload.cardPlayed,
            ],
            player1Deck: [
              ...state.player1Deck.slice(0, removeIndex),
              ...state.player1Deck.slice(removeIndex + 1),
            ],
            player2Deck: [
              ...state.player2Deck.slice(0, state.player2Deck.length),
              drawCard1,
              drawCard2,
              ...state.player2Deck.slice(state.player2Deck.length),
            ],
            currentColor: colorOfPlayedCard,
            currentNumber: 1024,
            drawCardPile: [...copiedDrawCardPileArray],
          };
        } else {
          const removeIndex = state.player2Deck.indexOf(
            action.payload.cardPlayed
          );
          if (removeIndex === -1) {
            alert("Invalid Move! - NOT YOUR TURN");
            return state;
          }

          const copiedDrawCardPileArray = [...state.drawCardPile];
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();
          return {
            ...state,
            gameOver: isGameOver(state.player2Deck),
            winner: setWinner(state.player2Deck, 'Player 2'),
            playedCardsPile: [
              ...state.playedCardsPile,
              action.payload.cardPlayed,
            ],
            player2Deck: [
              ...state.player2Deck.slice(0, removeIndex),
              ...state.player2Deck.slice(removeIndex + 1),
            ],
            player1Deck: [
              ...state.player1Deck.slice(0, state.player1Deck.length),
              drawCard1,
              drawCard2,
              ...state.player1Deck.slice(state.player1Deck.length),
            ],
            currentColor: colorOfPlayedCard,
            currentNumber: 1024,
            drawCardPile: [...copiedDrawCardPileArray],
          };
        }
      } else {
        alert("Invalid Move! -- D2card");
        return state;
      }
        }

        case "W": {
      if (cardPlayedBy === "Player 1") {
        const newColor = prompt("Enter new color: R / G / B / Y");
        // switch(newColor) {
        //   case "R": case"G": case"B": case"Y":
        //     break;
        //   default:
        //     console.log(newColor)
        //     alert("Invalid Move!");
        //     return state;
        // }
        if (!newColor in COLOR) {
          alert("Invalid Move! - NOT YOUR TURN");
          return state;
        }
        const removeIndex = state.player1Deck.indexOf(
          action.payload.cardPlayed
        );
        if (removeIndex === -1) {
          alert("Invalid Move! - NOT YOUR TURN");
          return state;
        }
        return {
          ...state,
          gameOver: isGameOver(state.player1Deck),
          winner: setWinner(state.player1Deck, 'Player 1'),
          turn: "Player 2",          
          playedCardsPile: [
            ...state.playedCardsPile,
            action.payload.cardPlayed,
          ],
          player1Deck: [
            ...state.player1Deck.slice(0, removeIndex),
            ...state.player1Deck.slice(removeIndex + 1),
          ],
          currentColor: newColor,
          currentNumber: 300,
        };
      } else if (cardPlayedBy === "Player 2"){
        const newColor = prompt("Enter new color: R / G / B / Y");
        switch(newColor) {
          case "R": case"G": case"B": case"Y":
            break;
          default:
            console.log(newColor)
            alert("Invalid Move!");
            return state;
        }
        const removeIndex = state.player2Deck.indexOf(
          action.payload.cardPlayed
        );
        if (removeIndex === -1) {
          alert("Invalid Move! - NOT YOUR TURN");
          return state;
        }
        return {
          ...state,
          gameOver: isGameOver(state.player2Deck),
          winner: setWinner(state.player2Deck, 'Player 2'),
          turn: "Player 1",
          playedCardsPile: [
            ...state.playedCardsPile,
            action.payload.cardPlayed,
          ],
          player2Deck: [
            ...state.player2Deck.slice(0, removeIndex),
            ...state.player2Deck.slice(removeIndex + 1),
          ],
          currentColor: newColor,
          currentNumber: 300,
        };
      } else {
        alert("Invalid Move! -- W");
        return state;
      }
        }

        case "D4W": {
          if (cardPlayedBy === "Player 1") {
            const newColor = prompt("Enter new color: R / G / B / Y");
            switch(newColor) {
              case "R": case"G": case"B": case"Y":
                break;
              default:
                console.log(newColor)
                alert("Invalid Move!");
                return state;
            }
            const removeIndex = state.player1Deck.indexOf(
              action.payload.cardPlayed
            );
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              return state;
            }

            const copiedDrawCardPileArray = [...state.drawCardPile];
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            const drawCard3 = copiedDrawCardPileArray.pop();
            const drawCard4 = copiedDrawCardPileArray.pop();

            return {
              ...state,
              gameOver: isGameOver(state.player1Deck),
              winner: setWinner(state.player1Deck, 'Player 1'),
              playedCardsPile: [
                ...state.playedCardsPile,
                action.payload.cardPlayed,
              ],
              player1Deck: [
                ...state.player1Deck.slice(0, removeIndex),
                ...state.player1Deck.slice(removeIndex + 1),
              ],
              player2Deck: [
                ...state.player2Deck.slice(0, state.player2Deck.length),
                drawCard1,
                drawCard2,
                drawCard3,
                drawCard4,
              ],
              currentColor: newColor,
              currentNumber: 600,
              drawCardPile: [...copiedDrawCardPileArray],
            };
          } else if (cardPlayedBy === "Player 2") {
            const newColor = prompt("Enter new color: R / G / B / Y");
            switch(newColor) {
              case "R": case"G": case"B": case"Y":
                break;
              default:
                console.log(newColor)
                alert("Invalid Move!");
                return state;
            }
            const removeIndex = state.player2Deck.indexOf(
              action.payload.cardPlayed
            );
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              return state;
            }

            const copiedDrawCardPileArray = [...state.drawCardPile];
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            const drawCard3 = copiedDrawCardPileArray.pop();
            const drawCard4 = copiedDrawCardPileArray.pop();

            return {
              ...state,
              gameOver: isGameOver(state.player2Deck),
              winner: setWinner(state.player2Deck, 'Player 2'),
              playedCardsPile: [
                ...state.playedCardsPile,
                action.payload.cardPlayed,
              ],
              player2Deck: [
                ...state.player2Deck.slice(0, removeIndex),
                ...state.player2Deck.slice(removeIndex + 1),
              ],
              player1Deck: [
                ...state.player1Deck.slice(0, state.player1Deck.length),
                drawCard1,
                drawCard2,
                drawCard3,
                drawCard4,
              ],
              currentColor: newColor,
              currentNumber: 600,
              drawCardPile: [...copiedDrawCardPileArray],
            };
          } else {
            alert("Invalid Move! -- D4W");
            return state;
          }
        }
        default:
          return state;
      }

    
    case DRAW_CARD:
      const cardDrawnBy = state.turn;
      if (cardDrawnBy === "Player 1") {
        const copiedDrawCardPileArray = [...state.drawCardPile];
        const drawCard = copiedDrawCardPileArray.pop();
        alert(`You drew ${drawCard}.`)
        const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
        let numberOfDrawnCard = drawCard.charAt(0);
        if (
          drawCard === "skipR" ||
          drawCard === "skipG" ||
          drawCard === "skipB" ||
          drawCard === "skipY"
        ) {
          numberOfDrawnCard = 404;
        }
        else if (
          drawCard === "D2R" ||
          drawCard === "D2G" ||
          drawCard === "D2B" ||
          drawCard === "D2Y"
        ) {
          numberOfDrawnCard = 1024;
        }
        else if (drawCard === "W") {
          numberOfDrawnCard = 300;
          window.confirm("The card is playable!");
          return {
            ...state,
            turn: "Player 1",
            player1Deck: [...state.player1Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray],
          };

        }
        else if (drawCard === "D4W") {
          numberOfDrawnCard = 600;
          window.confirm("The card is playable!");
          return {
            ...state,
            turn: "Player 1",
            player1Deck: [...state.player1Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray],
          };
        }

        if (
          numberOfDrawnCard === state.currentNumber ||
          colorOfDrawnCard === state.currentColor
        ) {
          window.confirm("The card is playable!");
          return {
            ...state,
            turn: "Player 1",
            player1Deck: [...state.player1Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray],
          };
        }
        else {
          return {
            ...state,
            turn: "Player 2",
            player1Deck: [...state.player1Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray],
          };
        }

        
      } else {
        const copiedDrawCardPileArray = [...state.drawCardPile];
        const drawCard = copiedDrawCardPileArray.pop();
        alert(`You drew ${drawCard}.`)
        const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
        let numberOfDrawnCard = drawCard.charAt(0);
        if (
          drawCard === "skipR" ||
          drawCard === "skipG" ||
          drawCard === "skipB" ||
          drawCard === "skipY"
        ) {
          numberOfDrawnCard = 404;
        }
        else if (
          drawCard === "D2R" ||
          drawCard === "D2G" ||
          drawCard === "D2B" ||
          drawCard === "D2Y"
        ) {
          numberOfDrawnCard = 1024;
        }
        else if (drawCard === "W") {
          numberOfDrawnCard = 300;
          window.confirm("The card is playable!");
          return {
            ...state,
            turn: "Player 2",
            player2Deck: [...state.player2Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray],
          };
        }
        else if (drawCard === "D4W") {
          numberOfDrawnCard = 600;
          window.confirm("The card is playable!");
          return {
            ...state,
            turn: "Player 2",
            player2Deck: [...state.player2Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray],
          };
        }

        if (
          numberOfDrawnCard === state.currentNumber ||
          colorOfDrawnCard === state.currentColor
        ) {
          window.confirm("The card is playable!");
          return {
            ...state,
            turn: "Player 2",
            player2Deck: [...state.player2Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray],
          };
        } else {
          return {
            ...state,
            turn: "Player 1",
            player2Deck: [...state.player2Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray],
          };
        }  
      }

    default:
      return state;
  }
};

export default gameReducer;
