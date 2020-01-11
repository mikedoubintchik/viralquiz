import React from "react";
import quizData from "./components/quiz/quiz-data/how-well-you-know-me.json";
import quizAnswers from "./components/quiz/quiz-data/how-well-you-know-me-answers.json";

export const initialState = {
  quizName: quizData.name,
  questions: quizData.questions,
  creatorAnswers: quizAnswers || [],
  takerAnswers: [],
  activeQuestionIndex: 0
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "addQuestion":
      return { questions: state.questions };
    case "addAnswer":
      return {
        ...state,
        creatorAnswers: [
          ...state.creatorAnswers,
          { question: action.questionIndex, answer: action.answer }
        ]
      };
    case "recordAnswer":
      return {
        ...state,
        takerAnswers: [
          ...state.takerAnswers,
          { question: action.questionIndex, answer: action.answer }
        ]
      };
    case "incrementActiveQuestion":
      return {
        ...state,
        activeQuestionIndex:
          state.activeQuestionIndex < state.questions.length
            ? state.activeQuestionIndex + 1
            : state.activeQuestionIndex
      };
    case "decrementActiveQuestion":
      return {
        ...state,
        activeQuestionIndex:
          state.activeQuestionIndex > 0
            ? state.activeQuestionIndex - 1
            : state.activeQuestionIndex
      };
    default:
      return state;
  }
};

export const Context = React.createContext();
