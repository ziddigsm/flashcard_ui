import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import useGameData from "../../contexts/GameData";
import "./NavBar.css";
import { useState, useEffect } from "react";
import { logOut } from "../../authentication/authService";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uid, name, resetGame, gameHistory, setGameHistory } = useGameData();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (uid && location.pathname === "/auth") {
      navigate("/game");
    }
  }, [uid, location.pathname, navigate]);

  const handleLogout = () => {
    logOut();
    resetGame();
  };

  const handleLogoClick = () => {
    console.log(useGameData.getState());
    if (uid) {
      navigate("/game");
    } else {
      navigate("/");
    }
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleGetGameHistory = async () => {
    if (!uid) return;

    try {
      let baseUrl = import.meta.env.VITE_API_GET_GAME_HISTORY;
      baseUrl += uid;
      const res = await axios.get(baseUrl);
      setGameHistory(res.data?.data);
      setShowHistory(true);
      console.log(useGameData.getState());
    } catch (err) {
      alert("Error fetching game history. Please try again later.");
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick}>
        Flash Cards
      </div>
      {showHistory && uid && (
        <div className="history-overlay">
          <div className="history-panel">
            <h2>Game History</h2>
            {gameHistory && gameHistory.length > 0 ? (
              <ul className="history-list">
                {gameHistory.map((item, index) => (
                  <li key={index} className="history-item">
                    <strong>Topic:</strong> {item.topic} |{" "}
                    <strong>Score:</strong> {item.score}/{item.questions_count}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No game history found.</p>
            )}
            <button className="nav-button" onClick={handleCloseHistory}>
              Close
            </button>
          </div>
        </div>
      )}
      {uid ? (
        <div className="navbar-actions">
          <button
            className="nav-button"
            disabled={!uid}
            onClick={handleGetGameHistory}
          >
            History
          </button>
          <span className="nav-name">{name}</span>
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="navbar-actions">
          <button
            className="nav-button"
            onClick={() => {
              resetGame();
              navigate("/auth?mode=signin");
            }}
          >
            Login
          </button>
          <button
            className="nav-button"
            onClick={() => {
              resetGame();
              navigate("/auth?mode=signup");
            }}
          >
            SignUp
          </button>
        </div>
      )}
    </div>
  );
}
