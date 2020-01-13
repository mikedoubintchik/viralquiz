export const gradeQuiz = (creatorAnswers, takerAnswers) => {
  let countCorrect = 0;

  for (let i = 0; i < creatorAnswers.length; i++) {
    if (creatorAnswers[i].answer === takerAnswers[i].answer) countCorrect++;
  }

  return countCorrect;
};
