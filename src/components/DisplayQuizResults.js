import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  // Container,
  // Row,
  // Col,
  // Image,
  // ButtonToolbar,
  Button
} from "react-bootstrap";
import { Context } from "../store";
import { getQuizScoreFromLocalStorage } from "./quiz/quizHelpers";

const DisplayQuizResults = () => {
  let history = useHistory();
  const { quizID } = useParams();

  console.log(getQuizScoreFromLocalStorage(quizID));

  return (
    <>
      <h1>Quiz Results</h1>
      <h2>
        You got <strong>{getQuizScoreFromLocalStorage(quizID)}%</strong>
      </h2>
      <h2>Add leaderboard</h2>
      <Button variant="outline-success" onClick={() => history.push("/")}>
        Create Your Own Quiz
      </Button>
    </>
  );
};

export default DisplayQuizResults;
