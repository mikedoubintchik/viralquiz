import React, { useContext } from "react";
import { Context } from "../../store";
import {
  Container,
  Row,
  Col,
  Image,
  ButtonToolbar,
  Button
} from "react-bootstrap";
import { gradeQuiz } from "./quizHelpers";

export const DisplayQuiz = props => {
  const { store, dispatch } = useContext(Context);

  const generateAnswersHTML = (answers, questionIndex) => {
    return answers.map((answer, index) => {
      return (
        <Col
          key={index}
          xs={6}
          md={4}
          onClick={() => {
            // if user is creating a quiz
            if (props.create) {
              dispatch({
                type: "recordCreatorAnswer",
                questionIndex: questionIndex,
                answer: index
              });
            }
            // if user is taking a quiz
            else {
              dispatch({
                type: "recordAnswer",
                questionIndex: questionIndex,
                answer: index
              });
            }
          }}
        >
          <Image src="http://placekitten.com/200/200" fluid />
          {answer}
        </Col>
      );
    });
  };

  const generateQuestionsHTML = questions => {
    return questions.map((question, index) => {
      return (
        <div
          key={index}
          className={`question${
            store.activeQuestionIndex === index ? " active" : ""
          }`}
        >
          <h1>{question.question}</h1>
          <Container>
            <Row>{generateAnswersHTML(question.answers, index)}</Row>
          </Container>
        </div>
      );
    });
  };

  return (
    <>
      <div>{generateQuestionsHTML(store.questions)}</div>

      <ButtonToolbar>
        <Button
          variant="outline-danger"
          onClick={() => dispatch({ type: "reset" })}
        >
          Reset
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => dispatch({ type: "decrementActiveQuestion" })}
        >
          Previous
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => dispatch({ type: "incrementActiveQuestion" })}
        >
          Next
        </Button>
        <Button
          variant="outline-success"
          onClick={() => {
            if (!props.create)
              gradeQuiz(store.creatorAnswers, store.takerAnswers);
          }}
        >
          Submit
        </Button>
      </ButtonToolbar>
    </>
  );
};
