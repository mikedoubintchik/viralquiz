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
  const questions = state.questions;
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
      questions[action.questionIndex].answers.push(action.answer);
      return { ...state, questions };
    case "updateAnswerImage":
      questions[action.questionIndex].images[action.answer] = action.image;
      return { ...state, questions };
    case "addQuestion":
      questions.push({ answers: [], images: {}, question: action.question });
      return { ...state, questions };
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
        creatorAnswers: {
          ...state.creatorAnswers,
          [action.questionIndex]: action.answer
        }
      };
    case "recordTakerAnswer":
      return {
        ...state,
        takerAnswers: {
          ...state.takerAnswers,
          [action.questionIndex]: action.answer
        }
      };
    case "deleteAnswer":
      delete questions[action.questionIndex].answers[action.answerIndex];
      return { ...state, questions };
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
