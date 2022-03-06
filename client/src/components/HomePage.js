import React, { useState } from "react";
import { Link } from "react-router-dom";
import codeGen from "../utils/rgen";


const HomePage = () => {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div className="Homepage">
      <div className="homepage-menu">
        <h1>Welcome To UNO</h1>
        <div className="homepage-form">
          <div className="homepage-join">
            <input
              className="mb-3"
              type="text"
              placeholder="Room"
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Link to={`/play?roomCode=${roomCode}`}>
              <button className="btn btn-success btn-lg">JOIN GAME</button>
            </Link>
          </div>

          <h1>OR</h1>
          <div className="homepage-create">
            <Link to={`/play?roomCode=${codeGen(5)}`}>
              <button className="btn btn-danger btn-lg">CREATE GAME</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
