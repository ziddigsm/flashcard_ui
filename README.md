# ⚡ Flashcards Frontend

An interactive flashcard game built with **React**, **Vite**, and **Tailwind CSS**. This app allows users to play quiz-style flashcards, track scores, and engage with fun facts while learning. Integrated with **Google Firebase** for authentication.

---

## 🎮 Features

- Topic-based flashcard quiz
- Guest play and user login (Firebase Auth)
- Score tracking and result display
- Fun facts shown during loading states
- API integration with backend for questions, scores, and facts
- Responsive design with smooth animations

---

## 🛠️ Tech Stack

- **Frontend Framework:** React
- **Build Tool:** Vite
- **Styling:** Vanilla CSS
- **Routing:** React Router
- **State Management:** Context API and Zustand along with React Hooks
- **API Handling:** Axios
- **Authentication & Identity:** Google Firebase

---

## 🔐 Firebase Integration

This app uses **Firebase Authentication** to:
- Allow users to create and sign in with their personal email ID
- Persist login sessions
- Save and retrieve user-specific game history

## 🧾 Pages / Components

- `/` — Home page with name input and signup/signin navigation
- `/game` — Game setup and loading
- `/play` — Flashcard game interface
- `/result` — Final score and review
