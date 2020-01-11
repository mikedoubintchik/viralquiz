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
