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

const DisplayQuizResults = () => {
  let history = useHistory();

  return (
    <>
      <h1>Quiz Results</h1>
      <h2>Results go here</h2>
      <Button variant="outline-success" onClick={() => history.push("/")}>
        Create Your Own Quiz
      </Button>
    </>
  );
};

export default DisplayQuizResults;
