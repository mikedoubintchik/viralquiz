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
  leaderboard: [],
  quizScore: null,
  activeQuestionIndex: 0
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return {
        ...state,
        questions: [],
        creatorAnswers: [],
        takerAnswers: [],
        activeQuestionIndex: 0
      };
    case "addCustomAnswer":
      const questions = state.questions;
      questions[action.questionIndex].answers.push(action.answer);
      return { ...state, questions };
    case "addQuestion":
      return { ...state, questions: state.questions };
    case "createDefaultQuizQuestions":
      return { ...state, questions: action.questions };
    case "updateQuizName":
      return { ...state, quizName: action.quizName };
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
        creatorAnswers: action.creatorAnswers,
        leaderboard: action.leaderboard
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
    case "setActiveQuestion":
      return {
        ...state,
        activeQuestionIndex: action.questionIndex
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
