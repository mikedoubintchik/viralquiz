import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Context } from "../store";
import DisplayShare from "./DisplayShare";

const QuizCreated = () => {
  const { store } = useContext(Context);
  let history = useHistory();

  return (
    <>
      <h1>Quiz was successfully created!</h1>
      <h2>Share it with everyone!</h2>
      <DisplayShare quizID={store.quizID} quizName={store.quizName} />
      <Button variant="primary" onClick={() => history.push("/")}>
        Create Another Quiz
      </Button>
    </>
  );
};

export default QuizCreated;
