import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logIn, signUp } from "../../authentication/authService";
import "./Auth.css";
import "../Home/Home.css";
import useGameData from "../../contexts/GameData";
import axios from "axios";
import validator from "validator";

export default function AuthForm() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const mode = new URLSearchParams(search).get("mode") || "signin";
  const isSignup = mode === "signup";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { name, setName, setEmail, email, setUid } = useGameData();

  const setUserData = (uid) => {
    setEmail(email);
    setUid(uid);
  };

  useEffect(() => {
    setTimeout(() => {
      setError("");
      setPassword("");
    }, 3000);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let isValidPassword = validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      });
      const isValidEmail = validator.isEmail(email);
      if (!isValidEmail || !isValidPassword) {
        setError(
          "Invalid Email/password. Your password must have atleast 8 letters with 1 lower, 1 upper and 1 special character."
        );
        setPassword("");
        return;
      }
      if (isSignup) {
        await signUp(email, password).then(async (res) => {
          const payload = {
            name,
            email,
            uid: res?.user.uid,
          };
          await axios.post(import.meta.env.VITE_API_CREATE_USER, payload);
          setUserData(res?.user.uid);
        });
      } else {
        await logIn(email, password).then(async (res) => {
          let baseUrl = import.meta.env.VITE_API_GET_USER_DETAILS;
          baseUrl += res?.user.uid;
          await axios.get(baseUrl).then((res) => {
            setName(res.data?.data?.name);
            setUserData(res.data?.data.uid);
          });
        });
      }
      navigate("/game");
    } catch (er) {
      setError(er.message || "Could not create account. Please try again.");
    }
  };

  return (
    <div className="auth">
      <div className="auth-home">
        <h2 className="auth-title">{isSignup ? "Sign Up" : "Sign in"}</h2>
        {error && <p className="error-text">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="name"
              className="input-name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            className="input-name"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-name"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-play-button">
            {isSignup ? "Create Account" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
