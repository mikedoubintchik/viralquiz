import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

import quizData from "./quiz-data/how-well-you-know-me.json";

export const DisplayQuiz = () => {
  const generateAnswersHTML = answers => {
    return answers.map((answer, index) => {
      return (
        <Col key={index} xs={6} md={4}>
          <Image src="http://placekitten.com/200/200" fluid />
          {answer}
        </Col>
      );
    });
  };

  const generateQuestionsHTML = questions => {
    return questions.map((question, index) => {
      return (
        <div key={index}>
          <h1>{question.question}</h1>
          <Container>
            <Row>{generateAnswersHTML(question.answers)}</Row>
          </Container>
        </div>
      );
    });
  };

  return (
    <>
      <h1>{quizData.name}</h1>
      <div>{generateQuestionsHTML(quizData.questions)}</div>
    </>
  );
};
