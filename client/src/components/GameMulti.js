import React, { useEffect, useState } from "react";
import  CARDS  from "../utils/cards";
import { Link, useSearchParams } from "react-router-dom";
import Card from "./Card";
import shuffle from "../utils/shuffle";
import uuid from "react-uuid";
import io from "socket.io-client";
import { UPDATE_GAME, INIT_GAME } from "../utils/constants";
import Spinner from "./Spinner";

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
  const [isUnoButtonPressed, setUnoButtonPressed] = useState(false);

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

    socket.emit("join", { room: room }, (error) => {
      if (error) setRoomFull(true);
    });

    // cleanup on component unmount
    return function cleanup() {
      socket.disconnect();
      //shut down connnection instance
      socket.off();
    };
  }, []);

  useEffect(() => {
    const shuffledCards = [...shuffle(CARDS)]
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

  const onUnoClickedHandler = (player) => {
    const currentPlayer = gamePlayers.filter((element) => {
      return element.player === player;
    });
    if (currentPlayer[0].playerDeck.length === 2) {
      setUnoButtonPressed(true);
    }
  };

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

          const copiedDrawCardPileArray = [...drawCardPile];
          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
                alert("Oops! You forgot to press UNO");
                const drawCard1 = copiedDrawCardPileArray.pop();
                const drawCard2 = copiedDrawCardPileArray.pop();
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                    drawCard1,
                    drawCard2,
                  ],
                };
              } else {
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                  ],
                };
              }
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
            drawCardPile: copiedDrawCardPileArray,
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

          const copiedDrawCardPileArray = [...drawCardPile];
          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
                alert("Oops! You forgot to press UNO");
                const drawCard1 = copiedDrawCardPileArray.pop();
                const drawCard2 = copiedDrawCardPileArray.pop();
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                    drawCard1,
                    drawCard2,
                  ],
                };
              } else {
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                  ],
                };
              }
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
            drawCardPile: copiedDrawCardPileArray,
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

          const copiedDrawCardPileArray = [...drawCardPile];
          const updatedGamePlayers = gamePlayers.reverse().map((item) => {
            if (item.player === turn) {
              if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
                alert("Oops! You forgot to press UNO");
                const drawCard1 = copiedDrawCardPileArray.pop();
                const drawCard2 = copiedDrawCardPileArray.pop();
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                    drawCard1,
                    drawCard2,
                  ],
                };
              } else {
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                  ],
                };
              }
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
            drawCardPile: copiedDrawCardPileArray,
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

          const copiedDrawCardPileArray = [...drawCardPile];
          const updatedGamePlayers = gamePlayers.reverse().map((item) => {
            if (item.player === turn) {
              if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
                alert("Oops! You forgot to press UNO");
                const drawCard1 = copiedDrawCardPileArray.pop();
                const drawCard2 = copiedDrawCardPileArray.pop();
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                    drawCard1,
                    drawCard2,
                  ],
                };
              } else {
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                  ],
                };
              }
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
            drawCardPile: copiedDrawCardPileArray,
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

          const copiedDrawCardPileArray = [...drawCardPile];
          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
                alert("Oops! You forgot to press UNO");
                const drawCard1 = copiedDrawCardPileArray.pop();
                const drawCard2 = copiedDrawCardPileArray.pop();
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                    drawCard1,
                    drawCard2,
                  ],
                };
              } else {
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                  ],
                };
              }
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
            drawCardPile: copiedDrawCardPileArray,
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

          const copiedDrawCardPileArray = [...drawCardPile];
          const updatedGamePlayers = gamePlayers.map((item) => {
            if (item.player === turn) {
              if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
                alert("Oops! You forgot to press UNO");
                const drawCard1 = copiedDrawCardPileArray.pop();
                const drawCard2 = copiedDrawCardPileArray.pop();
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                    drawCard1,
                    drawCard2,
                  ],
                };
              } else {
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                  ],
                };
              }
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
            drawCardPile: copiedDrawCardPileArray,
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
              if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
                alert("Oops! You forgot to press UNO");
                const drawCard3 = copiedDrawCardPileArray.pop();
                const drawCard4 = copiedDrawCardPileArray.pop();
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                    drawCard3,
                    drawCard4,
                  ],
                };
              } else {
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                  ],
                };
              }
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
              if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
                alert("Oops! You forgot to press UNO");
                const drawCard3 = copiedDrawCardPileArray.pop();
                const drawCard4 = copiedDrawCardPileArray.pop();
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                    drawCard3,
                    drawCard4,
                  ],
                };
              } else {
                return {
                  ...item,
                  playerDeck: [
                    ...item.playerDeck.slice(0, removeIndex),
                    ...item.playerDeck.slice(removeIndex + 1),
                  ],
                };
              }
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

        const copiedDrawCardPileArray = [...drawCardPile];
        const updatedGamePlayers = gamePlayers.map((item) => {
          if (item.player === turn) {
            if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
              alert("Oops! You forgot to press UNO");
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                  drawCard1,
                  drawCard2,
                ],
              };
            } else {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
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
          currentColor: newColor,
          currentNumber: 300,
          drawCardPile: copiedDrawCardPileArray,
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
            if (item.playerDeck.length === 2 && !isUnoButtonPressed) {
              alert("Oops! You forgot to press UNO");
              const drawCard5 = copiedDrawCardPileArray.pop();
              const drawCard6 = copiedDrawCardPileArray.pop();
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                  drawCard5,
                  drawCard6,
                ],
              };
            } else {
              return {
                ...item,
                playerDeck: [
                  ...item.playerDeck.slice(0, removeIndex),
                  ...item.playerDeck.slice(removeIndex + 1),
                ],
              };
            }
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

  return (
    <div className={`Game backgroundColorP backgroundColor${currentColor}`}>
      {!roomFull ? (
        <>
          <h5>Game Code: {room}</h5>
          {users.length < 3 && currentUser === "Player 2" && (
            <h1 className="topInfoText">Other Player has left the game.</h1>
          )}
          {users.length < 3 && currentUser === "Player 3" && (
            <h1 className="topInfoText">Other Player has left the game.</h1>
          )}
          {users.length >= 3 ? (
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
                  <h5>Turn: {turn}</h5>

                  {/* Player1 view */}
                  <div className="container">
                    {currentUser === "Player 1" && (
                      <>
                        <div className="row mb-3">
                          <div
                            className="d-flex align-items-start"
                            style={{ pointerEvents: "none" }}
                          >
                            <h5>Player 2</h5>
                            <div className="mx-3">
                              {gamePlayers
                                .filter((item) => item.player === "Player 2")
                                .map((item) => {
                                  return (
                                    <div className="d-flex align-items-start">
                                      {item.playerDeck.map((element) => (
                                        <Card
                                          item={element}
                                          src={require(`../asset/cards/Deck.png`)}
                                          myClick={null}
                                          key={uuid()}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                            </div>
                            {turn === "Player 2" && <Spinner />}
                          </div>
                        </div>
                        <div className="row  mb-3">
                          <div
                            className="d-flex align-items-start"
                            style={{ pointerEvents: "none" }}
                          >
                            <h5>Player 3</h5>
                            <div className="mx-3">
                              {gamePlayers
                                .filter((item) => item.player === "Player 3")
                                .map((item) => {
                                  return (
                                    <div className="d-flex align-items-start">
                                      {item.playerDeck.map((element) => (
                                        <Card
                                          item={element}
                                          src={require(`../asset/cards/Deck.png`)}
                                          myClick={null}
                                          key={uuid()}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                            </div>
                            {turn === "Player 3" && <Spinner />}
                          </div>
                        </div>
                        <div className="row my-3">
                          <div
                            style={
                              turn === "Player 2" || turn === "Player 3"
                                ? { pointerEvents: "none" }
                                : null
                            }
                          >
                            <div>
                              {playedCardsPile &&
                                playedCardsPile.length > 0 && (
                                  <img
                                    src={require(`../asset/cards/${
                                      playedCardsPile[
                                        playedCardsPile.length - 1
                                      ]
                                    }.png`)}
                                    alt=""
                                    className="mx-3"
                                    width="100px"
                                  />
                                )}
                            </div>
                            <div className="text-center">
                              <button
                                onClick={onCardDrawnHandler}
                                className="btn btn-success btn-lg mt-3"
                                disabled={turn !== "Player 1"}
                              >
                                DRAW CARD
                              </button>
                              <button
                                className="btn btn-danger btn-lg mx-3 mt-3"
                                onClick={() => onUnoClickedHandler("Player 1")}
                              >
                                UNO
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div
                            className="d-flex align-items-start"
                            style={
                              turn === "Player 1"
                                ? null
                                : { pointerEvents: "none" }
                            }
                          >
                            <h5>Player 1</h5>
                            <div className="mx-3">
                              {gamePlayers
                                .filter((item) => item.player === "Player 1")
                                .map((item) => {
                                  return (
                                    <div className="d-flex align-items-start">
                                      {item.playerDeck.map((element) => (
                                        <Card
                                          className="zoom"
                                          item={element}
                                          src={require(`../asset/cards/${element}.png`)}
                                          myClick={() =>
                                            onCardPlayedHandler(element)
                                          }
                                          key={uuid()}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>

                        <br />
                      </>
                    )}
                  </div>

                  {/* Player2 view */}
                  <div className="container">
                    {currentUser === "Player 2" && (
                      <>
                        <div className="row mb-3">
                          <div
                            className="d-flex align-items-start"
                            style={{ pointerEvents: "none" }}
                          >
                            <h5>Player 1</h5>
                            <div className="mx-3">
                              {gamePlayers
                                .filter((item) => item.player === "Player 1")
                                .map((item) => {
                                  return (
                                    <div className="d-flex align-items-start">
                                      {item.playerDeck.map((element) => (
                                        <Card
                                          item={element}
                                          src={require(`../asset/cards/Deck.png`)}
                                          myClick={null}
                                          key={uuid()}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                            </div>
                            {turn === "Player 1" && <Spinner />}
                          </div>
                        </div>
                        <div className="row  mb-3">
                          <div
                            className="d-flex align-items-start"
                            style={{ pointerEvents: "none" }}
                          >
                            <h5>Player 3</h5>
                            <div className="mx-3">
                              {gamePlayers
                                .filter((item) => item.player === "Player 3")
                                .map((item) => {
                                  return (
                                    <div className="d-flex align-items-start">
                                      {item.playerDeck.map((element) => (
                                        <Card
                                          item={element}
                                          src={require(`../asset/cards/Deck.png`)}
                                          myClick={null}
                                          key={uuid()}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                            </div>
                            {turn === "Player 3" && <Spinner />}
                          </div>
                        </div>
                        <div className="row  mb-3">
                          <div
                            style={
                              turn === "Player 1" || turn === "Player 3"
                                ? { pointerEvents: "none" }
                                : null
                            }
                          >
                            <div>
                              {playedCardsPile &&
                                playedCardsPile.length > 0 && (
                                  <img
                                    src={require(`../asset/cards/${
                                      playedCardsPile[
                                        playedCardsPile.length - 1
                                      ]
                                    }.png`)}
                                    className="mx-3"
                                    alt=""
                                    width="100px"
                                  />
                                )}
                            </div>
                            <div className="text-center">
                              <button
                                onClick={onCardDrawnHandler}
                                className="btn btn-success btn-lg mt-3"
                                disabled={turn !== "Player 2"}
                              >
                                DRAW CARD
                              </button>
                              <button
                                className="btn btn-danger btn-lg mx-3 mt-3"
                                onClick={() => onUnoClickedHandler("Player 2")}
                              >
                                UNO
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div
                            className="d-flex align-items-start"
                            style={
                              turn === "Player 2"
                                ? null
                                : { pointerEvents: "none" }
                            }
                          >
                            <h5>Player 2</h5>
                            <div className="mx-3">
                              {gamePlayers
                                .filter((item) => item.player === "Player 2")
                                .map((item) => {
                                  return (
                                    <div className="d-flex align-items-start">
                                      {item.playerDeck.map((element) => (
                                        <Card
                                          className="zoom"
                                          item={element}
                                          src={require(`../asset/cards/${element}.png`)}
                                          myClick={() =>
                                            onCardPlayedHandler(element)
                                          }
                                          key={uuid()}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>

                        <br />
                      </>
                    )}
                  </div>

                  {/* Player3 view */}
                  <div className="container">
                    {currentUser === "Player 3" && (
                      <>
                        <div className="row mb-3">
                          <div
                            className="d-flex align-items-start"
                            style={{ pointerEvents: "none" }}
                          >
                            <h5>Player 1</h5>
                            <div className="mx-3">
                              {gamePlayers
                                .filter((item) => item.player === "Player 1")
                                .map((item) => {
                                  return (
                                    <div className="d-flex align-items-start">
                                      {item.playerDeck.map((element) => (
                                        <Card
                                          item={element}
                                          src={require(`../asset/cards/Deck.png`)}
                                          myClick={null}
                                          key={uuid()}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                            </div>
                            {turn === "Player 1" && <Spinner />}
                          </div>
                        </div>
                        <div className="row  mb-3">
                          <div
                            className="d-flex align-items-start"
                            style={{ pointerEvents: "none" }}
                          >
                            <h5>Player 2</h5>
                            <div className="mx-3">
                              {gamePlayers
                                .filter((item) => item.player === "Player 2")
                                .map((item) => {
                                  return (
                                    <div className="d-flex align-items-start">
                                      {item.playerDeck.map((element) => (
                                        <Card
                                          item={element}
                                          src={require(`../asset/cards/Deck.png`)}
                                          myClick={null}
                                          key={uuid()}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                            </div>
                            {turn === "Player 2" && <Spinner />}
                          </div>
                        </div>
                        <div className="row  mb-3">
                          <div
                            style={
                              turn === "Player 1" || turn === "Player 2"
                                ? { pointerEvents: "none" }
                                : null
                            }
                          >
                            <div>
                              {playedCardsPile &&
                                playedCardsPile.length > 0 && (
                                  <img
                                    src={require(`../asset/cards/${
                                      playedCardsPile[
                                        playedCardsPile.length - 1
                                      ]
                                    }.png`)}
                                    className="mx-3"
                                    alt=""
                                    width="100px"
                                  />
                                )}
                            </div>
                            <div className="text-center"> 
                              <button
                                onClick={onCardDrawnHandler}
                                className="btn btn-success btn-lg mt-3"
                                disabled={turn !== "Player 3"}
                              >
                                DRAW CARD
                              </button>
                              <button
                                className="btn btn-danger btn-lg mx-3 mt-3"
                                onClick={() => onUnoClickedHandler("Player 3")}
                              >
                                UNO
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div
                            className="d-flex align-items-start"
                            style={
                              turn === "Player 3"
                                ? null
                                : { pointerEvents: "none" }
                            }
                          >
                            <h5>Player 3</h5>
                            <div className="mx-3">
                              {gamePlayers
                                .filter((item) => item.player === "Player 3")
                                .map((item) => {
                                  return (
                                    <div className="d-flex align-items-start">
                                      {item.playerDeck.map((element) => (
                                        <Card
                                          className="zoom"
                                          item={element}
                                          src={require(`../asset/cards/${element}.png`)}
                                          myClick={() =>
                                            onCardPlayedHandler(element)
                                          }
                                          key={uuid()}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>

                        <br />
                      </>
                    )}
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
      )}

      <br />
      <Link to="/">
        <button className="btn btn-danger btn-lg">QUIT</button>
      </Link>
    </div>
  );
}

export default GameMulti;
