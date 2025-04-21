import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGameData from "../../contexts/GameData";
import axios from "axios";
import "./Play.css";

const Play = () => {
  const navigate = useNavigate();
  const {
    name,
    questions,
    currentQuestion,
    score,
    incrementScore,
    nextQuestion,
    setCurrentQuestion,
    setScore,
    setGameQuestions,
    resetGame,
    isResult,
    setIsResult,
    topic,
    setTopic,
    uid,
  } = useGameData();

  const [isFlipped, setIsFlipped] = useState(false);
  const [chosenAnswer, setChosenAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (!name.trim() || name.trim().length === 0) {
      navigate("/");
    } else if ((!questions || questions.length === 0) && !isResult) {
      navigate("/game");
    }
  }, [name, questions]);

  const handleAnswerValidation = (answer) => {
    const inPageQuestion = questions[currentQuestion];
    const correct = answer === inPageQuestion.options[inPageQuestion.answer];
    setChosenAnswer(answer);
    setIsCorrect(correct);
    setIsFlipped(true);
    let updatedScore = score;
    if (correct) {
      incrementScore();
      updatedScore += 1;
    }

    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          nextQuestion();
        }, 150);
        setIsFlipped(false);
        setChosenAnswer(null);
      } else {
        setIsResult(true);
        setTopic("");
        if (uid) {
          const payload = {
            topic,
            score: updatedScore,
            uid,
            questions_count: questions.length,
          };
          await axios
            .post(import.meta.env.VITE_API_CREATE_GAME_HISTORY, payload)
            .then((res) => {
              if (res.status === 200) {
                alert("Successfully saved the result to your profile");
              }
            })
            .catch((err) => {
              alert(
                err.message || "Could not save your result to your profile. "
              );
            });
        }
      }
    }, 1500);
  };

  const handlePlayAgain = () => {
    setScore(0);
    setCurrentQuestion([]);
    setGameQuestions([]);
    setIsResult(false);
    navigate("/game");
  };

  const handleHome = () => {
    resetGame();
    console.log(useGameData.getState());
    navigate("/");
  };

  if (isResult) {
    return (
      <ResultCard
        score={score}
        totalQuestions={questions.length}
        handlePlayAgain={handlePlayAgain}
        handleHome={handleHome}
        uid={uid}
      />
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="play-container">
      <div
        className={`flashcard ${isFlipped ? "flipped" : ""} ${
          isFlipped ? (isCorrect ? "correct" : "incorrect") : ""
        }`}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="question-counter">
              Question {currentQuestion + 1}/{questions.length}
            </div>
            <h3 className="question-text">{question?.question}</h3>
            <div className="options-container">
              {question?.options.map((option, id) => (
                <button
                  key={id}
                  className={`option-button ${
                    chosenAnswer === option ? "selected" : ""
                  }`}
                  onClick={() => {
                    !isFlipped && handleAnswerValidation(option);
                  }}
                  disabled={isFlipped}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="flashcard-back">
            <div className="answer-result">
              {isCorrect
                ? "Correct! On to next one."
                : "Incorrect! You lost a point."}
            </div>
            <div className="correct-answer">
              <h3>Correct Answer: {question?.options[question?.answer]}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({
  score,
  totalQuestions,
  handlePlayAgain,
  handleHome,
  uid,
}) => {
  return (
    <div className="play-container">
      <div className="play-card result-card">
        <h2 className="play-title">Game Results</h2>
        <p className="play-score">
          Your Score: {score}/{totalQuestions}
        </p>
        <div className="score-details">
          <p className="correct-answers">Correct answers: {score}</p>
          <br />
          <p className="wrong-answers">
            Wrong answers: {totalQuestions - score}
          </p>
        </div>
        <div className="button-container">
          <button className="play-button play-again" onClick={handlePlayAgain}>
            Play Again
          </button>
          <button
            type="reset"
            className="play-button play-again"
            onClick={handleHome}
          >
            {uid ? "Logout" : "Home"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Play;
