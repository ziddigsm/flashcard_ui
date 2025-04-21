import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Game from "./components/Game/Game";
import Play from "./components/Play/Play";
import Auth from "./components/Auth/Auth";
import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/play-game" element={<Play />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
