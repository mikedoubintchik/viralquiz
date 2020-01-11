import React from "react";
import quizData from "./components/quiz/quiz-data/how-well-you-know-me.json";

export const initialState = {
  quizName: quizData.name,
  questions: quizData.questions,
  answers: []
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "addQuestion":
      return { questions: state.questions };
    case "recordAnswer":
      return { answers: state.answers.push("meow") };
    default:
      return state;
  }
};

export const Context = React.createContext();
