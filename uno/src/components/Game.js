import React, { useEffect, useState } from 'react';
import { CARDS } from "../utils/cards";
import { Link } from "react-router-dom";
import Card from "./Card";
import shuffle from "../utils/shuffle";
import uuid from "react-uuid";
import io from 'socket.io-client';
import { UPDATE_GAME, INIT_GAME } from '../utils/constants';

let socket
const ENDPOINT = 'http://localhost:5000'

function Game() {
  //initialize game state
  const [gameOver, setGameOver] = useState(true);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState("");
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [playedCardsPile, setPlayedCardsPile] = useState([]);
  const [drawCardPile, setDrawCardPile] = useState([]);

  const COLOR = ["R", "G", "B", "Y"];

  const isGameOver = (arr) => {
    return arr.length === 1;
  };

  const isWinner = (arr, player) => {
    return arr.length === 1 ? player : "";
  };

  useEffect(() => {
    const connectionOptions =  {
        "forceNew" : true,
        "reconnectionAttempts": "Infinity", 
        "timeout" : 10000,                  
        "transports" : ["websocket"]
    }
    socket = io.connect(ENDPOINT, connectionOptions)
    console.log(socket);
  }, [])

  useEffect(() => {
    const shuffledCards = shuffle(CARDS);
    const player1Deck = shuffledCards.splice(0, 7);
    const player2Deck = shuffledCards.splice(0, 7);

    let randomCardIndex;
    while (true) {
      randomCardIndex = Math.floor(Math.random() * 94);
      if (
        shuffledCards[randomCardIndex] === "skipR" ||
        shuffledCards[randomCardIndex] === "_R" ||
        shuffledCards[randomCardIndex] === "D2R" ||
        shuffledCards[randomCardIndex] === "skipG" ||
        shuffledCards[randomCardIndex] === "_G" ||
        shuffledCards[randomCardIndex] === "D2G" ||
        shuffledCards[randomCardIndex] === "skipB" ||
        shuffledCards[randomCardIndex] === "_B" ||
        shuffledCards[randomCardIndex] === "D2B" ||
        shuffledCards[randomCardIndex] === "skipY" ||
        shuffledCards[randomCardIndex] === "_Y" ||
        shuffledCards[randomCardIndex] === "D2Y" ||
        shuffledCards[randomCardIndex] === "W" ||
        shuffledCards[randomCardIndex] === "D4W"
      ) {
        continue;
      } else break;
    }
    //extract the card from that randomCardIndex into the playedCardsPile
    const playedCardsPile = shuffledCards.splice(randomCardIndex, 1);

    //store all remaining cards into drawCardPile
    const drawCardPile = shuffledCards;
    //set initial state
    socket.emit(INIT_GAME, {
      gameOver: false,
      turn: "Player 1",
      player1Deck: [...player1Deck],
      player2Deck: [...player2Deck],
      playedCardsPile: [...playedCardsPile],
      currentColor: playedCardsPile[0].charAt(1),
      currentNumber: playedCardsPile[0].charAt(0),
      drawCardPile: [...drawCardPile]
    })
  }, []);

  useEffect(() => {
    socket.on(INIT_GAME, ({ gameOver, turn, player1Deck, player2Deck, currentColor, currentNumber, playedCardsPile, drawCardPile }) => {
      setGameOver(gameOver);
      setTurn(turn);
      setPlayer1Deck(player1Deck);
      setPlayer2Deck(player2Deck);
      setCurrentColor(currentColor);
      setCurrentNumber(currentNumber);
      setPlayedCardsPile(playedCardsPile);
      setDrawCardPile(drawCardPile);
    });

    socket.on(UPDATE_GAME, ({ gameOver, winner, turn, player1Deck, player2Deck, currentColor, currentNumber, playedCardsPile, drawCardPile }) => {
      gameOver && setGameOver(gameOver)
      winner && setWinner(winner)
      turn && setTurn(turn)
      player1Deck && setPlayer1Deck(player1Deck)
      player2Deck && setPlayer2Deck(player2Deck)
      currentColor && setCurrentColor(currentColor)
      currentNumber && setCurrentNumber(currentNumber)
      playedCardsPile && setPlayedCardsPile(playedCardsPile)
      drawCardPile && setDrawCardPile(drawCardPile)
    })
  }, [])

  const onCardPlayedHandler = (cardPlayed) => {
    const cardPlayedBy = turn;
    switch (cardPlayed) {
      case "0R": case "1R": case "2R": case "3R": case "4R": case "5R": case "6R": case "7R": case "8R": case "9R": case "_R":
      case "0G": case "1G": case "2G": case "3G": case "4G": case "5G": case "6G": case "7G": case "8G": case "9G": case "_G":
      case "0B": case "1B": case "2B": case "3B": case "4B": case "5B": case "6B": case "7B": case "8B": case "9B": case "_B":
      case "0Y": case "1Y": case "2Y": case "3Y": case "4Y": case "5Y": case "6Y": case "7Y": case "8Y": case "9Y": case "_Y":
        {
        const numberOfPlayedCard = cardPlayed.charAt(0);
        const colorOfPlayedCard = cardPlayed.charAt(1);
    

        if (currentColor === colorOfPlayedCard) {
          console.log("colors matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! -  NOT YOUR TURN");
              break;
            }
            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player1Deck),
              winner: isWinner(player1Deck, "Player 1"),
              turn: "Player 2",
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player1Deck: [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: numberOfPlayedCard
            })
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            socket.emit(UPDATE_GAME, {
              gameOver:isGameOver(player2Deck),
              winner: isWinner(player2Deck, "Player 2"),
              turn: "Player 1",
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player2Deck: [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: numberOfPlayedCard
            })
          }
        } else if (currentNumber === numberOfPlayedCard) {
          console.log("numbers matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player1Deck),
              winner: isWinner(player1Deck, "Player 1"),
              turn: "Player 2",
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player1Deck: [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: numberOfPlayedCard
            })
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            socket.emit(UPDATE_GAME, {
              gameOver:isGameOver(player2Deck),
              winner: isWinner(player2Deck, "Player 2"),
              turn: "Player 1",
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player2Deck: [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: numberOfPlayedCard
            })
          }
        } else {
          alert("Invalid Move! - normal card");
          break;
        }
        break;
      }

      case "skipR":
      case "skipG":
      case "skipB":
      case "skipY": {
        const colorOfPlayedCard = cardPlayed.charAt(4);
        if (currentColor === colorOfPlayedCard) {
          console.log("colors matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player1Deck),
              winner: isWinner(player1Deck, "Player 1"),
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player1Deck: [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: 404
            })
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player2Deck),
              winner: isWinner(player2Deck, "Player 2"),
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player2Deck: [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: 404
            })
          }
        } else if (currentNumber === 404) {
          console.log("Numbers matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player1Deck),
              winner: isWinner(player1Deck, "Player 1"),
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player1Deck: [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: 404
            })
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player2Deck),
              winner: isWinner(player2Deck, "Player 2"),
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player2Deck: [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: 404
            })
          }
        } else {
          alert("Invalid Move! -- skip card");
          break;
        }
        break;
      }

      case "D2R":
      case "D2G":
      case "D2B":
      case "D2Y": {
        const colorOfPlayedCard = cardPlayed.charAt(2);

        if (currentColor === colorOfPlayedCard) {
          console.log("colors matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            const copiedDrawCardPileArray = [...drawCardPile];
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();

            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player1Deck),
              winner: isWinner(player1Deck, "Player 1"),
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player1Deck: [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ],
              player2Deck: [
                ...player2Deck.slice(0, player2Deck.length),
                drawCard1,
                drawCard2,
                ...player2Deck.slice(player2Deck.length),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: 1024,
              drawCardPile: [...copiedDrawCardPileArray]
            })
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            const copiedDrawCardPileArray = [...drawCardPile];
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player2Deck),
              winner: isWinner(player2Deck, 'Player 2'),
              playedCardsPile: [
                playedCardsPile,
                cardPlayed,
              ],
              player2Deck: [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ],
              player1Deck: [
                ...player1Deck.slice(0, player1Deck.length),
                drawCard1,
                drawCard2,
                ...player1Deck.slice(player1Deck.length),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: 1024,
              drawCardPile: [...copiedDrawCardPileArray],
            })
          }
        }
        else if (currentNumber === 1024) {
          console.log("colors matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }

            const copiedDrawCardPileArray = [...drawCardPile];
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();

            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player1Deck),
              winner: isWinner(player1Deck, "Player 1"),
              playedCardsPile: [...playedCardsPile, cardPlayed],
              player1Deck: [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ],
              player2Deck: [
                ...player2Deck.slice(0, player2Deck.length),
                drawCard1,
                drawCard2,
                ...player2Deck.slice(player2Deck.length),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: 1024,
              drawCardPile: [...copiedDrawCardPileArray]
            })
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            const copiedDrawCardPileArray = [...drawCardPile];
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            socket.emit(UPDATE_GAME, {
              gameOver: isGameOver(player2Deck),
              winner: isWinner(player2Deck, 'Player 2'),
              playedCardsPile: [
                playedCardsPile,
                cardPlayed,
              ],
              player2Deck: [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ],
              player1Deck: [
                ...player1Deck.slice(0, player1Deck.length),
                drawCard1,
                drawCard2,
                ...player1Deck.slice(player1Deck.length),
              ],
              currentColor: colorOfPlayedCard,
              currentNumber: 1024,
              drawCardPile: [...copiedDrawCardPileArray],
            })
          }
        } 
        else {
            alert("Invalid Move! - D2CARD");
              break;
        }
        break;
      }

      case "W": {
        if (cardPlayedBy === "Player 1") {
          const newColor = prompt("Enter new color: R / G / B / Y");
          if ( newColor === 'R' || newColor === 'G' || newColor === 'B' || newColor === 'Y') {
          } else {
            alert("Invalid Move! - illegal argument");
            break;
          }
          const removeIndex = player1Deck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! - NOT YOUR TURN");
            break;
          }
          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(player1Deck),
            winner: isWinner(player1Deck, "Player 1"),
            turn: "Player 2",
            playedCardsPile: [...playedCardsPile, cardPlayed],
            player1Deck: [
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ],
            currentColor: newColor,
            currentNumber: 300
          })
        } else if (cardPlayedBy === "Player 2") {
            const newColor = prompt("Enter new color: R / G / B / Y");
            if ( newColor === 'R' || newColor === 'G' || newColor === 'B' || newColor === 'Y') {
            } else {
              alert("Invalid Move! - illegal argument");
              break;
            }
          const removeIndex = player2Deck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! - NOT YOUR TURN");
            break;
          }
          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(player2Deck),
            winner: isWinner(player2Deck, "Player 2"),
            turn: "Player 1",
            playedCardsPile: [...playedCardsPile, cardPlayed],
            player1Deck: [
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ],
            currentColor: newColor,
            currentNumber: 300
          })
        } else {
          alert("Invalid Move! -- W");
          break;
        }
        break;
      }

      case "D4W": {
        if (cardPlayedBy === "Player 1") {
            const newColor = prompt("Enter new color: R / G / B / Y");
            if ( newColor === 'R' || newColor === 'G' || newColor === 'B' || newColor === 'Y') {
            } else {
              alert("Invalid Move! - illegal argument");
              break;
            }  
          const removeIndex = player1Deck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! - NOT YOUR TURN");
            break;
          }

          const copiedDrawCardPileArray = [...drawCardPile];
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();
          const drawCard3 = copiedDrawCardPileArray.pop();
          const drawCard4 = copiedDrawCardPileArray.pop();

          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(player1Deck),
            winner: isWinner(player1Deck, "Player 1"),
            playedCardsPile: [...playedCardsPile, cardPlayed],
            player1Deck: [
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ],
            player2Deck: [
              ...player2Deck.slice(0, player2Deck.length),
              drawCard1,
              drawCard2,
              drawCard3,
              drawCard4,
            ],
            currentColor: newColor,
            currentNumber: 600,
            drawCardPile: [...copiedDrawCardPileArray]
          })
        } else if (cardPlayedBy === "Player 2") {
            const newColor = prompt("Enter new color: R / G / B / Y");
            if ( newColor === 'R' || newColor === 'G' || newColor === 'B' || newColor === 'Y') {
            } else {
              alert("Invalid Move! - illegal argument");
              break;
            }  
          const removeIndex = player2Deck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! - NOT YOUR TURN");
            break;
          }

          const copiedDrawCardPileArray = [...drawCardPile];
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();
          const drawCard3 = copiedDrawCardPileArray.pop();
          const drawCard4 = copiedDrawCardPileArray.pop();


          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(player2Deck),
            winner: isWinner(player2Deck, "Player 2"),
            playedCardsPile: [...playedCardsPile, cardPlayed],
            player1Deck: [
              ...player1Deck.slice(0, player1Deck.length),
              drawCard1,
              drawCard2,
              drawCard3,
              drawCard4,
            ],
            player2Deck: [
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),4,
            ],
            currentColor: newColor,
            currentNumber: 600,
            drawCardPile: [...copiedDrawCardPileArray]
          })
        } else {
          alert("Invalid Move! -- D4W");
          break;
        }
      }

      default:
        break;
    }
  };

  const onCardDrawnHandler = () => {
    const cardDrawnBy = turn;
    if (cardDrawnBy === "Player 1") {
      const copiedDrawCardPileArray = [...drawCardPile];
      const drawCard = copiedDrawCardPileArray.pop();
      alert(`You drew ${drawCard}.`);
      const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
      let numberOfDrawnCard = drawCard.charAt(0);
      if (
        drawCard === "skipR" ||
        drawCard === "skipG" ||
        drawCard === "skipB" ||
        drawCard === "skipY"
      ) {
        numberOfDrawnCard = 404;
      } else if (
        drawCard === "D2R" ||
        drawCard === "D2G" ||
        drawCard === "D2B" ||
        drawCard === "D2Y"
      ) {
        numberOfDrawnCard = 1024;
      } else if (drawCard === "W") {
        numberOfDrawnCard = 300;
        window.confirm("The card is playable!");

        socket.emit(UPDATE_GAME, {
          turn: "Player 1",
          player1Deck: [...player1Deck, drawCard],
          drawCardPile: [...copiedDrawCardPileArray]
        })
      } else if (drawCard === "D4W") {
        numberOfDrawnCard = 600;
        window.confirm("The card is playable!");

        socket.emit(UPDATE_GAME, {
          turn: "Player 1",
          player1Deck: [...player1Deck, drawCard],
          drawCardPile: [...copiedDrawCardPileArray]
        })
      }
      if (drawCard !== "W" && drawCard !== "D4W") {
        if (numberOfDrawnCard === currentNumber || colorOfDrawnCard === currentColor)
        {
          window.confirm("The card is playable!");

          socket.emit(UPDATE_GAME, {
            turn: "Player 1",
            player1Deck: [...player1Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray]
          })

        } else {

          socket.emit(UPDATE_GAME, {
            turn: "Player 2",
            player1Deck: [...player1Deck, drawCard],
            drawCardPile: [...copiedDrawCardPileArray]
          })

        }
      }         
    } else {
      const copiedDrawCardPileArray = [...drawCardPile];
      const drawCard = copiedDrawCardPileArray.pop();
      alert(`You drew ${drawCard}.`);
      const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
      let numberOfDrawnCard = drawCard.charAt(0);
      if (
        drawCard === "skipR" ||
        drawCard === "skipG" ||
        drawCard === "skipB" ||
        drawCard === "skipY"
      ) {
        numberOfDrawnCard = 404;
      } else if (
        drawCard === "D2R" ||
        drawCard === "D2G" ||
        drawCard === "D2B" ||
        drawCard === "D2Y"
      ) {
        numberOfDrawnCard = 1024;
      } else if (drawCard === "W") {
        numberOfDrawnCard = 300;
        window.confirm("The card is playable!");

        socket.emit(UPDATE_GAME, {
          turn: "Player 2",
          player2Deck: [...player2Deck, drawCard],
          drawCardPile: [...copiedDrawCardPileArray]
        })

      } else if (drawCard === "D4W") {
        numberOfDrawnCard = 600;
        window.confirm("The card is playable!");

        socket.emit(UPDATE_GAME, {
          turn: "Player 2",
          player2Deck: [...player2Deck, drawCard],
          drawCardPile: [...copiedDrawCardPileArray]
        })

      }

      if (drawCard !== "W" && drawCard !== "D4W") {
        if (
            numberOfDrawnCard === currentNumber ||
            colorOfDrawnCard === currentColor
          ) {
            window.confirm("The card is playable!");

            socket.emit(UPDATE_GAME, {
              turn: "Player 2",
              player2Deck: [...player2Deck, drawCard],
              drawCardPile: [...copiedDrawCardPileArray]
            })

          } else {

            socket.emit(UPDATE_GAME, {
              turn: "Player 1",
              player2Deck: [...player2Deck, drawCard],
              drawCardPile: [...copiedDrawCardPileArray]
            })
          }
      }
    }
  };

  return gameOver ? (
    <div>
      <h1>GAME OVER</h1>
      <Link to="/">
        <button>GO BACK</button>
      </Link>
      {winner !== "" && (
        <>
          <h2>{winner} wins!</h2>
        </>
      )}
    </div>
  ) : (
    <div>
      <h1>Turn: {turn}</h1>
      <div>
        {player1Deck.map((item) => (
          <Card
            item={item}
            myClick={() => onCardPlayedHandler(item)}
            key={uuid()}
          />
        ))}
      </div>
      <hr></hr>
      <div>
        <h1>
          Current Card:{playedCardsPile[playedCardsPile.length - 1]}
          <br />
          Current Color:{currentColor}
        </h1>
        <button onClick={onCardDrawnHandler}>DRAW CARD</button>
      </div>
      <hr></hr>
      <div>
        {player2Deck.map((item) => (
          <Card
            item={item}
            myClick={() => onCardPlayedHandler(item)}
            key={uuid()}
          />
        ))}
      </div>
    </div>
  );
}

export default Game;

// case "0R": case "1R": case "2R": case "3R": case "4R": case "5R": case "6R": case "7R": case "8R": case "9R": case "_R":
//     case "0G": case "1G": case "2G": case "3G": case "4G": case "5G": case "6G": case "7G": case "8G": case "9G": case "_G":
//     case "0B": case "1B": case "2B": case "3B": case "4B": case "5B": case "6B": case "7B": case "8B": case "9B": case "_B":
//     case "0Y": case "1Y": case "2Y": case "3Y": case "4Y": case "5Y": case "6Y": case "7Y": case "8Y": case "9Y": case "_Y":
