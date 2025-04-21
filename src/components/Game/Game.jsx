import "./Game.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useWarning } from "../../contexts/WarningContext";
import { useNavigate } from "react-router-dom";
import useGameData from "../../contexts/GameData";

export default function Game() {
  const [currentFact, setCurrentFact] = useState("");
  const [factIndex, setFactIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    topic: "",
    questionsCount: 5,
  });
  const { showWarning } = useWarning();
  const {
    name,
    funfacts,
    setGameQuestions,
    setCurrentQuestion,
    setScore,
    setTopic,
    gameHistory,
  } = useGameData();

  useEffect(() => {
    if (!name.trim() || name.trim().length === 0) {
      navigate("/");
    }
  }, [name]);

  useEffect(() => {
    if (!isLoading) return;

    setCurrentFact(
      funfacts[factIndex % funfacts.length] || "Loading your questions...."
    );

    const interval = setInterval(() => {
      setFactIndex((index) => index + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading, factIndex, funfacts]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "topic") {
      const regex = /^[a-zA-Z\s]*$/;
      if (!regex.test(value)) return;
    }

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getQuestionsRequest = async (apiURL) => {
    await axios
      .get(apiURL)
      .then((res) => {
        setGameQuestions(res.data.data);
        setIsLoading(false);
        setCurrentQuestion(0);
        setScore(0);
        setTopic(input.topic);
        navigate("/play-game");
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const dictionaryValidation = async (getQuestionsUrl) => {
    const validateUrl = import.meta.env.VITE_API_VALIDATE;

    await axios
      .post(validateUrl, {
        topic: input.topic.trim(),
      })
      .then((res) => {
        if (res.data.data && res.data.data.isValid) {
          setIsLoading(true);
          getQuestionsRequest(getQuestionsUrl);
        } else {
          showWarning(
            "Are you sure you want to proceed. There are spelling mistakes in your topic. "
          );
        }
      })
      .catch((err) => {
        if (err.response.data?.message?.wordFault) {
          let suggestions = "";
          err.response.data?.message?.suggestions?.forEach((wordSuggestion) => {
            suggestions += `${wordSuggestion.word}: ${wordSuggestion.suggestions},`;
          });
          suggestions = suggestions.slice(0, -1);
          showWarning(
            `Are you sure you want to proceed. The words are probably spelled wrong. Suggested Words are ${suggestions}`,
            () => {
              setIsLoading(true);
              getQuestionsRequest(getQuestionsUrl);
            }
          );
        }
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isTopicValid = /^[A-Za-z\s]*$/.test(input.topic.trim());
    if (!isTopicValid) {
      alert("Please enter a valid topic (Only Alphabets upto 30 characters)");
      return;
    }

    let getQuestionsUrl = import.meta.env.VITE_API_GET_QUESTIONS;

    getQuestionsUrl += `topic=${encodeURIComponent(
      input.topic
    )}&questionsCount=${input.questionsCount}`;

    await dictionaryValidation(getQuestionsUrl);
  };

  if (isLoading) {
    return (
      <div className="game-container">
        <div className="loading-card">
          <h2 className="loading-title">Generating Questions....</h2>
          <div className="loading-spinner"></div>
          <div className="funfact-container">
            <h3>Did you know?</h3>
            <p className="funfact">{currentFact}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-card">
        <h2 className="game-title">Welcome, {name}!</h2>
        <p className="game-instructions">
          Please enter the topic of your own in 30 letters and choose the number
          of questions you'd like to play and click on submit to get started
          with the game.
        </p>
        <form className="game-form" onSubmit={handleSubmit}>
          <input
            className="game-input"
            type="text"
            name="topic"
            required
            value={input.topic}
            onChange={handleChange}
            placeholder="Enter a topic"
            maxLength={30}
          />
          <div className="input-wrapper">
            <select
              className="game-select"
              name="questionsCount"
              value={input.questionsCount}
              onChange={handleChange}
              required
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
            </select>
          </div>
          <button type="submit" className="game-submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
