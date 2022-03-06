import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import GameMulti from "./components/GameMulti";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/play" element={<GameMulti />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
