import React , { useState } from "react";
import { Link } from "react-router-dom";

 const HomePage = () => {

  const [roomCode, setRoomCode] = useState('')

  return (
    <div>
      <h1>Welcome To UNO</h1>
      <div>
        <input type='text' placeholder='Room' onChange={(event) => setRoomCode(event.target.value)} />
      </div>
      <Link to={`/play?roomCode=${roomCode}`}>
        <button>START GAME</button>
      </Link>
    </div>
  );
};

export default HomePage;
