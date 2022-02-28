import React, { useEffect, useState } from "react";
import { CARDS } from "../utils/cards";
import { Link, useSearchParams } from "react-router-dom";
import Card from "./Card";
import shuffle from "../utils/shuffle";
import uuid from "react-uuid";
import io from "socket.io-client";
import { UPDATE_GAME, INIT_GAME } from "../utils/constants";

let socket;
const ENDPOINT = "http://localhost:5000";

function GameMulti() {
  const [searchParams] = useSearchParams();
  let roomCode = 0;
  if (searchParams) {
    roomCode = searchParams.get("roomCode");
  }

  //initialize socket state
  const [room, setRoom] = useState(roomCode);
  const [roomFull, setRoomFull] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  //initialize game state
  const [gameOver, setGameOver] = useState(true);
  const [gamePlayers, setGamePlayers] = useState([
    { player: "Player 1", playerDeck: [] },
    { player: "Player 2", playerDeck: [] },
    { player: "Player 3", playerDeck: [] },
  ]);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [playedCardsPile, setPlayedCardsPile] = useState([]);
  const [drawCardPile, setDrawCardPile] = useState([]);

  const isGameOver = (arr) => {
    return arr.length === 1;
  };

  const isWinner = (arr, player) => {
    return arr.length === 1 ? player : "";
  };

  useEffect(() => {
    const connectionOptions = {
      forceNew: true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
    };
    socket = io.connect(ENDPOINT, connectionOptions);
    console.log(socket);

    socket.emit("join", { room: room }, (error) => {
      if (error) setRoomFull(true);
    });

    //cleanup on component unmount
    return function cleanup() {
      socket.emit("disconnect");
      //shut down connnection instance
      socket.off();
    };
  }, []);

  useEffect(() => {
    const shuffledCards = shuffle(CARDS);
    const initGamePlayers = gamePlayers.map((item) => {
      item.playerDeck = shuffledCards.splice(0, 7);
      return item;
    });

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
      turn: initGamePlayers[0].player,
      gamePlayers: initGamePlayers,
      playedCardsPile: [...playedCardsPile],
      currentColor: playedCardsPile[0].charAt(1),
      currentNumber: playedCardsPile[0].charAt(0),
      drawCardPile: [...drawCardPile],
    });
  }, []);

  useEffect(() => {
    socket.on(
      INIT_GAME,
      ({
        gameOver,
        turn,
        gamePlayers,
        currentColor,
        currentNumber,
        playedCardsPile,
        drawCardPile,
      }) => {
        setGameOver(gameOver);
        setTurn(turn);
        setGamePlayers(gamePlayers);
        setCurrentColor(currentColor);
        setCurrentNumber(currentNumber);
        setPlayedCardsPile(playedCardsPile);
        setDrawCardPile(drawCardPile);
      }
    );

    socket.on(
      UPDATE_GAME,
      ({
        gameOver,
        winner,
        turn,
        gamePlayers,
        currentColor,
        currentNumber,
        playedCardsPile,
        drawCardPile,
      }) => {
        gameOver && setGameOver(gameOver);
        winner && setWinner(winner);
        turn && setTurn(turn);
        gamePlayers && setGamePlayers(gamePlayers);
        currentColor && setCurrentColor(currentColor);
        currentNumber && setCurrentNumber(currentNumber);
        playedCardsPile && setPlayedCardsPile(playedCardsPile);
        drawCardPile && setDrawCardPile(drawCardPile);
      }
    );

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    socket.on("currentUserData", ({ name }) => {
      setCurrentUser(name);
    });
  }, []);

  const onCardPlayedHandler = (cardPlayed) => {
    switch (cardPlayed) {
      case "0R":
      case "1R":
      case "2R":
      case "3R":
      case "4R":
      case "5R":
      case "6R":
      case "7R":
      case "8R":
      case "9R":
      case "0G":
      case "1G":
      case "2G":
      case "3G":
      case "4G":
      case "5G":
      case "6G":
      case "7G":
      case "8G":
      case "9G":
      case "0B":
      case "1B":
      case "2B":
      case "3B":
      case "4B":
      case "5B":
      case "6B":
      case "7B":
      case "8B":
      case "9B":
      case "0Y":
      case "1Y":
      case "2Y":
      case "3Y":
      case "4Y":
      case "5Y":
      case "6Y":
      case "7Y":
      case "8Y":
      case "9Y": {
        const numberOfPlayedCard = cardPlayed.charAt(0);
        const colorOfPlayedCard = cardPlayed.charAt(1);

        if (currentColor === colorOfPlayedCard) {
          console.log("colors matched!");
          const index = gamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );
          const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! -  NOT YOUR TURN");
            break;
          }

          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
            return item;
          });
          console.log(updatedGamePlayers);
          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(gamePlayers[index].playerDeck),
            winner: isWinner(
              gamePlayers[index].playerDeck,
              gamePlayers[index].player
            ),
            turn: gamePlayers[(index + 1) % gamePlayers.length].player,
            playedCardsPile: [...playedCardsPile, cardPlayed],
            gamePlayers: updatedGamePlayers,
            currentColor: colorOfPlayedCard,
            currentNumber: numberOfPlayedCard,
          });
        } else if (currentNumber === numberOfPlayedCard) {
          console.log("numbers matched!");

          const index = gamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );
          const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! -  NOT YOUR TURN");
            break;
          }

          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
            return item;
          });
          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(gamePlayers[index].playerDeck),
            winner: isWinner(
              gamePlayers[index].playerDeck,
              gamePlayers[index].player
            ),
            turn: gamePlayers[(index + 1) % gamePlayers.length].player,
            playedCardsPile: [...playedCardsPile, cardPlayed],
            gamePlayers: updatedGamePlayers,
            currentColor: colorOfPlayedCard,
            currentNumber: numberOfPlayedCard,
          });
        } else {
          alert("Invalid Move! - normal card");
          break;
        }
        break;
      }

      case "_R":
      case "_G":
      case "_B":
      case "_Y": {
        const numberOfPlayedCard = cardPlayed.charAt(0);
        const colorOfPlayedCard = cardPlayed.charAt(1);

        if (currentColor === colorOfPlayedCard) {
          console.log("colors matched!");
          const index = gamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );
          const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! -  NOT YOUR TURN");
            break;
          }

          const updatedGamePlayers = gamePlayers.reverse().map((item) => {
            if (item.player === turn) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
            return item;
          });

          const newIndex = updatedGamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );

          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(gamePlayers[index].playerDeck),
            winner: isWinner(
              gamePlayers[index].playerDeck,
              gamePlayers[index].player
            ),
            turn: gamePlayers[(newIndex + 1) % gamePlayers.length].player,
            playedCardsPile: [...playedCardsPile, cardPlayed],
            gamePlayers: updatedGamePlayers,
            currentColor: colorOfPlayedCard,
            currentNumber: numberOfPlayedCard,
          });
        } else if (currentNumber === numberOfPlayedCard) {
          console.log("numbers matched!");
          const index = gamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );
          const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! -  NOT YOUR TURN");
            break;
          }

          const updatedGamePlayers = gamePlayers.reverse().map((item) => {
            if (item.player === turn) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
            return item;
          });

          const newIndex = updatedGamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );

          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(gamePlayers[index].playerDeck),
            winner: isWinner(
              gamePlayers[index].playerDeck,
              gamePlayers[index].player
            ),
            turn: gamePlayers[(newIndex + 1) % gamePlayers.length].player,
            playedCardsPile: [...playedCardsPile, cardPlayed],
            gamePlayers: updatedGamePlayers,
            currentColor: colorOfPlayedCard,
            currentNumber: numberOfPlayedCard,
          });
        } else {
          alert("Invalid Move! - reverse card");
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

          const index = gamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );
          const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! -  NOT YOUR TURN");
            break;
          }

          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
            return item;
          });
          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(gamePlayers[index].playerDeck),
            winner: isWinner(
              gamePlayers[index].playerDeck,
              gamePlayers[index].player
            ),
            turn: gamePlayers[(index + 2) % gamePlayers.length].player,
            playedCardsPile: [...playedCardsPile, cardPlayed],
            gamePlayers: updatedGamePlayers,
            currentColor: colorOfPlayedCard,
            currentNumber: 404,
          });
        } else if (currentNumber === 404) {
          console.log("Numbers matched!");

          const index = gamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );
          const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! -  NOT YOUR TURN");
            break;
          }

          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
            return item;
          });
          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(gamePlayers[index].playerDeck),
            winner: isWinner(
              gamePlayers[index].playerDeck,
              gamePlayers[index].player
            ),
            turn: gamePlayers[(index + 2) % gamePlayers.length].player,
            playedCardsPile: [...playedCardsPile, cardPlayed],
            gamePlayers: updatedGamePlayers,
            currentColor: colorOfPlayedCard,
            currentNumber: 404,
          });
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

          const index = gamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );
          const nextPlayer =
            gamePlayers[(index + 1) % gamePlayers.length].player;
          console.log(nextPlayer);
          const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! -  NOT YOUR TURN");
            break;
          }

          const copiedDrawCardPileArray = [...drawCardPile];
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();

          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
            if (item.player === nextPlayer) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, item.playerDeck.length),
                  drawCard1,
                  drawCard2,
                  ...item.playerDeck.slice(item.playerDeck.length),
                ],
              };
            }
            return item;
          });

          console.log(updatedGamePlayers);

          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(gamePlayers[index].playerDeck),
            winner: isWinner(
              gamePlayers[index].playerDeck,
              gamePlayers[index].player
            ),
            turn: gamePlayers[(index + 2) % gamePlayers.length].player,
            playedCardsPile: [...playedCardsPile, cardPlayed],
            gamePlayers: updatedGamePlayers,
            currentColor: colorOfPlayedCard,
            currentNumber: 1024,
            drawCardPile: [...copiedDrawCardPileArray],
          });
        } else if (currentNumber === 1024) {
          console.log("numbers matched!");

          const index = gamePlayers.findIndex(
            (gamePlayer) => gamePlayer.player === turn
          );
          const nextPlayer =
            gamePlayers[(index + 1) % gamePlayers.length].player;
          const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
          if (removeIndex === -1) {
            alert("Invalid Move! -  NOT YOUR TURN");
            break;
          }

          const copiedDrawCardPileArray = [...drawCardPile];
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();

          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
            if (item.player === nextPlayer) {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, item.playerDeck.length),
                  drawCard1,
                  drawCard2,
                  ...item.playerDeck.slice(item.playerDeck.length),
                ],
              };
            }
            return item;
          });

          console.log(updatedGamePlayers);

          socket.emit(UPDATE_GAME, {
            gameOver: isGameOver(gamePlayers[index].playerDeck),
            winner: isWinner(
              gamePlayers[index].playerDeck,
              gamePlayers[index].player
            ),
            turn: gamePlayers[(index + 2) % gamePlayers.length].player,
            playedCardsPile: [...playedCardsPile, cardPlayed],
            gamePlayers: updatedGamePlayers,
            currentColor: colorOfPlayedCard,
            currentNumber: 1024,
            drawCardPile: [...copiedDrawCardPileArray],
          });
        } else {
          alert("Invalid Move! - D2CARD");
          break;
        }
        break;
      }

      case "W": {
        const newColor = prompt("Enter new color: R / G / B / Y");
        if (
          newColor === "R" ||
          newColor === "G" ||
          newColor === "B" ||
          newColor === "Y"
        ) {
        } else {
          alert("Invalid Move! - illegal argument");
          break;
        }
        const index = gamePlayers.findIndex(
          (gamePlayer) => gamePlayer.player === turn
        );
        const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
        if (removeIndex === -1) {
          alert("Invalid Move! -  NOT YOUR TURN");
          break;
        }
        const updatedGamePlayers = gamePlayers.map((item) => {
          if (item.player === turn) {
            return {
              ...item,
              playerDeck: [
                ...item.playerDeck.slice(0, removeIndex),
                ...item.playerDeck.slice(removeIndex + 1),
              ],
            };
          }
          return item;
        });
        console.log(updatedGamePlayers);
        socket.emit(UPDATE_GAME, {
          gameOver: isGameOver(gamePlayers[index].playerDeck),
          winner: isWinner(
            gamePlayers[index].playerDeck,
            gamePlayers[index].player
          ),
          turn: gamePlayers[(index + 1) % gamePlayers.length].player,
          playedCardsPile: [...playedCardsPile, cardPlayed],
          gamePlayers: updatedGamePlayers,
          currentColor: newColor,
          currentNumber: 300,
        });
        break;
      }

      case "D4W": {
        const newColor = prompt("Enter new color: R / G / B / Y");
        if (
          newColor === "R" ||
          newColor === "G" ||
          newColor === "B" ||
          newColor === "Y"
        ) {
        } else {
          alert("Invalid Move! - illegal argument");
          break;
        }
        const index = gamePlayers.findIndex(
          (gamePlayer) => gamePlayer.player === turn
        );
        const nextPlayer = gamePlayers[(index + 1) % gamePlayers.length].player;
        const removeIndex = gamePlayers[index].playerDeck.indexOf(cardPlayed);
        if (removeIndex === -1) {
          alert("Invalid Move! -  NOT YOUR TURN");
          break;
        }

        const copiedDrawCardPileArray = [...drawCardPile];
        const drawCard1 = copiedDrawCardPileArray.pop();
        const drawCard2 = copiedDrawCardPileArray.pop();
        const drawCard3 = copiedDrawCardPileArray.pop();
        const drawCard4 = copiedDrawCardPileArray.pop();

        const updatedGamePlayers = gamePlayers.map((item) => {
          if (item.player === turn) {
            return {
              ...item,
              playerDeck: [
                ...item.playerDeck.slice(0, removeIndex),
                ...item.playerDeck.slice(removeIndex + 1),
              ],
            };
          }
          if (item.player === nextPlayer) {
            return {
              ...item,
              playerDeck: [
                ...item.playerDeck.slice(0, item.playerDeck.length),
                drawCard1,
                drawCard2,
                drawCard3,
                drawCard4,
                ...item.playerDeck.slice(item.playerDeck.length),
              ],
            };
          }
          return item;
        });
        socket.emit(UPDATE_GAME, {
          gameOver: isGameOver(gamePlayers[index].playerDeck),
          winner: isWinner(
            gamePlayers[index].playerDeck,
            gamePlayers[index].player
          ),
          turn: gamePlayers[(index + 2) % gamePlayers.length].player,
          playedCardsPile: [...playedCardsPile, cardPlayed],
          gamePlayers: updatedGamePlayers,
          currentColor: newColor,
          currentNumber: 600,
          drawCardPile: [...copiedDrawCardPileArray],
        });
        break;
      }

      default:
        break;
    }
  };

  const onCardDrawnHandler = () => {
    const index = gamePlayers.findIndex(
      (gamePlayer) => gamePlayer.player === turn
    );
    const copiedDrawCardPileArray = [...drawCardPile];
    const drawCard = copiedDrawCardPileArray.pop();
    alert(`You drew ${drawCard}.`);
    const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
    let numberOfDrawnCard = drawCard.charAt(0);

    const updatedGamePlayers = gamePlayers.map((item) => {
      if (item.player === turn) {
        return {
          ...item,
          playerDeck: [
            ...item.playerDeck.slice(0, item.playerDeck.length),
            drawCard,
            ...item.playerDeck.slice(item.playerDeck.length),
          ],
        };
      }
      return item;
    });

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
        gamePlayers: updatedGamePlayers,
        drawCardPile: [...copiedDrawCardPileArray],
      });
    } else if (drawCard === "D4W") {
      numberOfDrawnCard = 600;
      window.confirm("The card is playable!");

      socket.emit(UPDATE_GAME, {
        gamePlayers: updatedGamePlayers,
        drawCardPile: [...copiedDrawCardPileArray],
      });
    }
    if (drawCard !== "W" && drawCard !== "D4W") {
      if (
        numberOfDrawnCard === currentNumber ||
        colorOfDrawnCard === currentColor
      ) {
        window.confirm("The card is playable!");

        socket.emit(UPDATE_GAME, {
          gamePlayers: updatedGamePlayers,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      } else {
        socket.emit(UPDATE_GAME, {
          turn: gamePlayers[(index + 1) % gamePlayers.length].player,
          gamePlayers: updatedGamePlayers,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      }
    }
  };

  console.log(users.length)
  return !roomFull ? (
    <>
      {users.length >= 2 ? (
        <>
          {gameOver ? (
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
                {
                gamePlayers.filter(item => item.player === currentUser).map((item) => {
                  return (
                    <div key={uuid()}>
                      <h3>{item.player}</h3>
                      {item.playerDeck.map((element) => (
                        <Card
                          item={element}
                          myClick={() => onCardPlayedHandler(element)}
                          key={uuid()}
                        />
                      ))}
                      <hr></hr>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <h1>Waiting for other player</h1>
      )}
    </>
  ) : (
    <h1>Room full</h1>
  );
}

export default GameMulti;
