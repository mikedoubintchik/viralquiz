import React from "react";

export const initialState = {
  quizID: "",
  userID: "",
  userName: "",
  userEmail: "",
  quizName: "Create Your Quiz!",
  questions: [],
  creatorAnswers: [],
  takerAnswers: [],
  quizScore: null,
  activeQuestionIndex: 0
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "addQuestion":
      return { questions: state.questions };
    case "saveUser":
      return {
        ...state,
        quizID: action.quizID,
        userID: action.userID,
        userName: action.userName,
        userEmail: action.userEmail
      };
    case "takingQuiz":
      return {
        ...state,
        quizID: action.quizID,
        quizName: action.quizName,
        questions: action.questions,
        creatorAnswers: action.creatorAnswers
      };
    case "setQuizScore":
      return {
        ...state,
        quizScore: action.quizScore
      };
    case "recordCreatorAnswer":
      return {
        ...state,
        creatorAnswers: [
          ...state.creatorAnswers,
          { question: action.questionIndex, answer: action.answer }
        ]
      };
    case "recordTakerAnswer":
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
          state.activeQuestionIndex < state.questions.length - 1
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