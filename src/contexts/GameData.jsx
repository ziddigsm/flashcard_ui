import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGameData = create(
  persist(
    (set) => ({
      name: "",
      funfacts: [],
      questions: [],
      currentQuestion: 0,
      score: 0,
      isResult: false,
      email: "",
      uid: "",
      topic: "",
      gameHistory: null,

      setName: (name) => set({ name }),
      setFunFacts: (facts) => set({ funfacts: facts }),
      setGameQuestions: (questions) => set({ questions }),
      setCurrentQuestion: (index) => set({ currentQuestion: index }),
      setScore: (score) => set({ score }),
      setIsResult: (isResult) => set({ isResult }),
      incrementScore: () => set((state) => ({ score: state.score + 1 })),
      nextQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion + 1 })),
      setEmail: (email) => set({ email }),
      setUid: (uid) => set({ uid }),
      setTopic: (topic) => set({ topic }),
      setGameHistory: (gameHistory) => set({ gameHistory }),
      resetGame: () =>
        set({
          currentQuestion: 0,
          score: 0,
          questions: [],
          name: "",
          isResult: false,
          funfacts: [],
          email: "",
          uid: "",
          topic: "",
          gameHistory: null,
        }),
    }),
    {
      name: "game-data",
    }
  )
);

export default useGameData;
