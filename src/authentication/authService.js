import { auth } from "./FirebaseSetup";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  return await signOut(auth);
};
