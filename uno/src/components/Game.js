import React, { useEffect, useState } from 'react';
import { CARDS } from "../utils/cards";
import { Link } from "react-router-dom";
import Card from "./Card";
import shuffle from "../utils/shuffle";
import uuid from "react-uuid";

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
    setGameOver(false);
    setTurn("Player 1");
    setPlayer1Deck([...player1Deck]);
    setPlayer2Deck([...player2Deck]);
    setCurrentColor(playedCardsPile[0].charAt(1));
    setCurrentNumber(playedCardsPile[0].charAt(0));
    setPlayedCardsPile([...playedCardsPile]);
    setDrawCardPile([...drawCardPile]);
  }, []);

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
            setGameOver(isGameOver(player1Deck));
            setWinner(isWinner(player1Deck, "Player 1"));
            setTurn("Player 2");
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer1Deck([
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(numberOfPlayedCard);
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            setGameOver(isGameOver(player2Deck));
            setWinner(isWinner(player2Deck, "Player 2"));
            setTurn("Player 1");
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer2Deck([
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(numberOfPlayedCard);
          }
        } else if (currentNumber === numberOfPlayedCard) {
          console.log("numbers matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            setGameOver(isGameOver(player1Deck));
            setWinner(isWinner(player1Deck, "Player 1"));
            setTurn("Player 2");
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer1Deck([
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(numberOfPlayedCard);
          } else if (cardPlayedBy === "Player 2") {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            setGameOver(isGameOver(player2Deck));
            setWinner(isWinner(player2Deck, "Player 2"));
            setTurn("Player 1");
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer2Deck([
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(numberOfPlayedCard);
          } else {
            alert("Invalid Move! - normal card");
            break;
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
            setGameOver(isGameOver(player1Deck));
            setWinner(isWinner(player1Deck, "Player 1"));
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer1Deck([
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(404);
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            setGameOver(isGameOver(player2Deck));
            setWinner(isWinner(player2Deck, "Player 2"));
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer2Deck([
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(404);
          }
        } else if (currentNumber === 404) {
          console.log("Numbers matched!");
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            setGameOver(isGameOver(player1Deck));
            setWinner(isWinner(player1Deck, "Player 1"));
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer1Deck([
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(404);
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            setGameOver(isGameOver(player2Deck));
            setWinner(isWinner(player2Deck, "Player 2"));
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer2Deck([
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(404);
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

            setGameOver(isGameOver(player1Deck));
            setWinner(isWinner(player1Deck, "Player 1"));
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer1Deck([
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ]);
            setPlayer2Deck([
              ...player2Deck.slice(0, player2Deck.length),
              drawCard1,
              drawCard2,
              ...player2Deck.slice(player2Deck.length),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(1024);
            setDrawCardPile([...copiedDrawCardPileArray]);
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            const copiedDrawCardPileArray = [...drawCardPile];
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();

            setGameOver(isGameOver(player2Deck));
            setWinner(isWinner(player2Deck, "Player 2"));
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer1Deck([
              ...player1Deck.slice(0, player1Deck.length),
              drawCard1,
              drawCard2,
              ...player1Deck.slice(player1Deck.length),
            ]);
            setPlayer2Deck([
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(1024);
            setDrawCardPile([...copiedDrawCardPileArray]);
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

            setGameOver(isGameOver(player1Deck));
            setWinner(isWinner(player1Deck, "Player 1"));
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer1Deck([
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ]);
            setPlayer2Deck([
              ...player2Deck.slice(0, player2Deck.length),
              drawCard1,
              drawCard2,
              ...player2Deck.slice(player2Deck.length),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(1024);
            setDrawCardPile([...copiedDrawCardPileArray]);
          } else {
            const removeIndex = player2Deck.indexOf(cardPlayed);
            if (removeIndex === -1) {
              alert("Invalid Move! - NOT YOUR TURN");
              break;
            }
            const copiedDrawCardPileArray = [...drawCardPile];
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            setGameOver(isGameOver(player2Deck));
            setWinner(isWinner(player2Deck, "Player 2"));
            setPlayedCardsPile([...playedCardsPile, cardPlayed]);
            setPlayer1Deck([
              ...player1Deck.slice(0, player1Deck.length),
              drawCard1,
              drawCard2,
              ...player1Deck.slice(player1Deck.length),
            ]);
            setPlayer2Deck([
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ]);
            setCurrentColor(colorOfPlayedCard);
            setCurrentNumber(1024);
            setDrawCardPile([...copiedDrawCardPileArray]);
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
          setGameOver(isGameOver(player1Deck));
          setWinner(isWinner(player1Deck, "Player 1"));
          setTurn("Player 2");
          setPlayedCardsPile([...playedCardsPile, cardPlayed]);
          setPlayer1Deck([
            ...player1Deck.slice(0, removeIndex),
            ...player1Deck.slice(removeIndex + 1),
          ]);
          setCurrentColor(newColor);
          setCurrentNumber(300);
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
          setGameOver(isGameOver(player2Deck));
          setWinner(isWinner(player2Deck, "Player 2"));
          setTurn("Player 1");
          setPlayedCardsPile([...playedCardsPile, cardPlayed]);
          setPlayer2Deck([
            ...player2Deck.slice(0, removeIndex),
            ...player2Deck.slice(removeIndex + 1),
          ]);
          setCurrentColor(newColor);
          setCurrentNumber(300);
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

          setGameOver(isGameOver(player1Deck));
          setWinner(isWinner(player1Deck, "Player 1"));
          setPlayedCardsPile([...playedCardsPile, cardPlayed]);
          setPlayer1Deck([
            ...player1Deck.slice(0, removeIndex),
            ...player1Deck.slice(removeIndex + 1),
          ]);
          setPlayer2Deck([
            ...player2Deck.slice(0, player2Deck.length),
            drawCard1,
            drawCard2,
            drawCard3,
            drawCard4,
          ]);
          setCurrentColor(newColor);
          setCurrentNumber(600);
          setDrawCardPile([...copiedDrawCardPileArray]);
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

          setGameOver(isGameOver(player2Deck));
          setWinner(isWinner(player2Deck, "Player 2"));
          setPlayedCardsPile([...playedCardsPile, cardPlayed]);
          setPlayer1Deck([
            ...player1Deck.slice(0, player1Deck.length),
            drawCard1,
            drawCard2,
            drawCard3,
            drawCard4,
          ]);
          setPlayer2Deck([
            ...player2Deck.slice(0, removeIndex),
            ...player2Deck.slice(removeIndex + 1),
          ]);
          setCurrentColor(newColor);
          setCurrentNumber(600);
          setDrawCardPile([...copiedDrawCardPileArray]);
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
        setTurn("Player 1");
        setPlayer1Deck([...player1Deck, drawCard]);
        setDrawCardPile([...copiedDrawCardPileArray]);
      } else if (drawCard === "D4W") {
        numberOfDrawnCard = 600;
        window.confirm("The card is playable!");
        setTurn("Player 1");
        setPlayer1Deck([...player1Deck, drawCard]);
        setDrawCardPile([...copiedDrawCardPileArray]);
      }
      if (drawCard !== "W" && drawCard !== "D4W") {
        if (numberOfDrawnCard === currentNumber || colorOfDrawnCard === currentColor)
        {
          window.confirm("The card is playable!");
          setTurn("Player 1");
          setPlayer1Deck([...player1Deck, drawCard]);
          setDrawCardPile([...copiedDrawCardPileArray]);
        } else {
          setTurn("Player 2");
          setPlayer1Deck([...player1Deck, drawCard]);
          setDrawCardPile([...copiedDrawCardPileArray]);
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
        setTurn("Player 2");
        setPlayer2Deck([...player2Deck, drawCard]);
        setDrawCardPile([...copiedDrawCardPileArray]);
      } else if (drawCard === "D4W") {
        numberOfDrawnCard = 600;
        window.confirm("The card is playable!");
        setTurn("Player 2");
        setPlayer2Deck([...player2Deck, drawCard]);
        setDrawCardPile([...copiedDrawCardPileArray]);
      }

      if (drawCard !== "W" && drawCard !== "D4W") {
        if (
            numberOfDrawnCard === currentNumber ||
            colorOfDrawnCard === currentColor
          ) {
            window.confirm("The card is playable!");
            setTurn("Player 2");
            setPlayer2Deck([...player2Deck, drawCard]);
            setDrawCardPile([...copiedDrawCardPileArray]);
          } else {
            setTurn("Player 1");
            setPlayer2Deck([...player2Deck, drawCard]);
            setDrawCardPile([...copiedDrawCardPileArray]);
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
      <Link to="/">
        <button>GO BACK</button>
      </Link>
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