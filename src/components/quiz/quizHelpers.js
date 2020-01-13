import firebase from "../../firestore";

const db = firebase.firestore();

export const gradeQuiz = (creatorAnswers, takerAnswers) => {
  console.log("graded");

  if (creatorAnswers === takerAnswers) {
    return "100";
  } else {
    return "oops";
  }
};
