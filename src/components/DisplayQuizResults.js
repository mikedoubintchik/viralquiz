import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  // Container,
  // Row,
  // Col,
  // Image,
  // ButtonToolbar,
  Button
} from "react-bootstrap";
import { Context } from "../store";

const DisplayQuizResults = () => {
  const { store } = useContext(Context);
  let history = useHistory();

  return (
    <>
      <h1>Quiz Results</h1>
      <h2>
        You got{" "}
        <strong>{(store.quizScore / store.questions.length) * 100}%</strong>
      </h2>
      <h2>Add leaderboard</h2>
      <Button variant="outline-success" onClick={() => history.push("/")}>
        Create Your Own Quiz
      </Button>
    </>
  );
};

export default DisplayQuizResults;
