export const gradeQuiz = (creatorAnswers, takerAnswers) => {
  const quizLength = creatorAnswers.length;
  let countCorrect = 0;
  let score = 0;

  for (let i = 0; i < quizLength; i++) {
    if (creatorAnswers[i].answer === takerAnswers[i]) countCorrect++;
  }

  score = (countCorrect / quizLength) * 100;

  return String(score);
};

export const createAnswerGuide = (questions, creatorAnswers, takerAnswers) => {
  const quizLength = creatorAnswers.length;
  let answerGuide = [];

  for (let i = 0; i < quizLength; i++) {
    answerGuide.push({
      question: questions[i].question,
      creator: questions[i].answers[creatorAnswers[i].answer],
      taker: questions[i].answers[takerAnswers[i]],
      correct: creatorAnswers[i].answer === takerAnswers[i]
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
