import firebase from "../../firestore";

export const gradeQuiz = (creatorAnswers, takerAnswers) => {
  console.log("graded");

  if (creatorAnswers === takerAnswers) {
    return "100";
  } else {
    return "oops";
  }
};

export const submitQuiz = creatorAnswers => {
  return "submitted";
};

export const createQuiz = () => {
  const db = firebase.firestore();
  const quizHash = Math.floor(Math.random() * Math.floor(1000000000));

  db.collection("quizzes").add({
    quizID: quizHash
  });

  return quizHash;
};
