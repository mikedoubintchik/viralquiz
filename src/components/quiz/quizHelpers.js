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

export const createQuiz = async ({ userName, userEmail }) => {
  const db = firebase.firestore();
  const quizHash = Math.floor(Math.random() * Math.floor(1000000000));
  const userData = { userName, userEmail };
  const user = await db.collection("users").add(userData);
  const quizData = { quizID: quizHash };

  db.collection("users")
    .doc(user.id)
    .collection("quizzes")
    .add(quizData);

  return quizHash;
};
