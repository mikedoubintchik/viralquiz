import quizData from "../quiz/quiz-data/how-well-you-know-me.json";

export const gradeQuiz = (creatorAnswers, takerAnswers) => {
  const quizLength = Object.keys(creatorAnswers).length;
  let countCorrect = 0;
  let score = 0;

  for (let i = 0; i < quizLength; i++) {
    if (creatorAnswers[i] === takerAnswers[i]) countCorrect++;
  }

  score = (countCorrect / quizLength) * 100;

  return String(score);
};

export const createAnswerGuide = (questions, creatorAnswers, takerAnswers) => {
  const quizLength = Object.keys(creatorAnswers).length;
  let answerGuide = [];

  for (let i = 0; i < quizLength; i++) {
    answerGuide.push({
      question: questions[i].question,
      creator: questions[i].answers[creatorAnswers[i]],
      taker: questions[i].answers[takerAnswers[i]],
      correct: creatorAnswers[i] === takerAnswers[i]
    });
  }

  return answerGuide;
};

export const getQuizScoreFromLocalStorage = quizID => {
  let viralQuizzes = JSON.parse(localStorage.getItem("viralQuizzes"));
  let quizScore = "";

  if (viralQuizzes) {
    viralQuizzes.forEach(quiz => {
      if (quiz.quizID === quizID) {
        quizScore = quiz.quizScore;
      }
    });
  }

  return String(quizScore);
};

export const createQuiz = db => {
  db.collection("quizOptions")
    .doc("HowWellDoYouKnowMe?")
    .update({
      quizName: "How Well Do You Know Me?",
      data: quizData
    });
};
