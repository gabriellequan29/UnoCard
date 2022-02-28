import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./components/Game";
import HomePage from "./components/HomePage";
import GameMulti from "./components/GameMulti";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/game" element={<GameMulti />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
