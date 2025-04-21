import "./Home.css";
import { FaCirclePlay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useGameData from "../../contexts/GameData";
import validator from "validator";

export default function Home() {
  const navigateTo = useNavigate();
  const { name, setName, setFunFacts, resetGame } = useGameData();

  const getFunFacts = () => {
    axios
      .get(import.meta.env.VITE_API_GET_FUN_FACTS)
      .then((res) => {
        const funfacts = res.data?.data;
        setFunFacts(funfacts);
      })
      .catch((err) => {
        console.log(err.message);
        return;
      });
  };
  const handleGameStart = (e) => {
    e.preventDefault();

    if (name.trim()) {
      getFunFacts();
      navigateTo("/game");
    }
  };
  return (
    <div className="app">
      <div className="app-home">
        <h2 className="app-title">Game of Flash Cards</h2>
        <span className="app-description">
          Welcome to the game of cards. In this game, you get to learn new
          concepts with gamified content. Just give us the topic and we got you
          the questions. You will have to answer ten questions and at the end,
          you get a score to know where you stand in the realm of knowledge.
        </span>
        <form className="name-form" onSubmit={handleGameStart}>
          <input
            className="input-name"
            type="text"
            name="name"
            value={name}
            required
            placeholder="Enter Your Name"
            onChange={(e) => {
              const input = e.target.value;

              if (validator.isAlpha(input)) {
                setName(e.target.value);
              }
            }}
            maxLength={15}
          />
          <div className="form-buttons">
            <button type="submit" className="app-play-button">
              <FaCirclePlay />
              Guest
            </button>
            <button
              type="button"
              className="app-play-button"
              onClick={() => {
                navigateTo("/auth?mode=signup");
                resetGame();
                getFunFacts();
              }}
            >
              Sign Up
            </button>
            <button
              type="button"
              className="app-play-button"
              onClick={() => {
                navigateTo("/auth?mode=signin");
                resetGame();
                getFunFacts();
              }}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
