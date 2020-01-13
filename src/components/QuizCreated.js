import React from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  ButtonToolbar,
  Button
} from "react-bootstrap";

const QuizCreated = () => {
  let history = useHistory();

  return (
    <>
      <h1>Quiz was successfully created!</h1>
      <h2>Share your Quiz</h2>
      <Button variant="outline-success" onClick={() => history.push("/")}>
        Create Another Quiz
      </Button>
    </>
  );
};

export default QuizCreated;
