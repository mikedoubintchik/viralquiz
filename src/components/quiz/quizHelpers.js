import quizData from "../quiz/quiz-data/how-well-you-know-me-test.json";

export const gradeQuiz = (creatorAnswers, takerAnswers) => {
  const keys = Object.keys(creatorAnswers);
  const quizLength = keys.length;
  let countCorrect = 0;

  for (const key of keys) {
    if (creatorAnswers[key] === takerAnswers[key]) countCorrect++;
  }

  return String((countCorrect / quizLength) * 100);
};

export const createAnswerGuide = (questions, creatorAnswers, takerAnswers) => {
  const quizLength = questions.length;
  let answerGuide = [];

  for (let i = 0; i < quizLength; i++) {
    if (questions[i]) {
      answerGuide.push({
        question: questions[i].question,
        creator: questions[i].answers[creatorAnswers[i]],
        taker: questions[i].answers[takerAnswers[i]],
        correct: creatorAnswers[i] === takerAnswers[i]
      });
    }
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
