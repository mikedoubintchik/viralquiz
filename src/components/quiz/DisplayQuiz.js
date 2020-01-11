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

export const DisplayQuiz = () => {
  const { store, dispatch } = useContext(Context);

  const generateAnswersHTML = (answers, questionIndex) => {
    return answers.map((answer, index) => {
      return (
        <Col
          key={index}
          xs={6}
          md={4}
          onClick={() =>
            dispatch({
              type: "recordAnswer",
              questionIndex: questionIndex,
              answer: index
            })
          }
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
        <div key={index}>
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
        <Button variant="outline-primary">Previous</Button>
        <Button variant="outline-success">Next</Button>
      </ButtonToolbar>
    </>
  );
};
