import React, { useContext } from "react";
import {
  Container,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  Button,
  Card,
  Modal,
  Form
} from "react-bootstrap";
import { Context } from "../store";

const QuizTracker = () => {
  const { store, dispatch } = useContext(Context);
  const questionsCount = store.questions.length;

  let questionButtons = [];

  for (let i = 1; i <= questionsCount; i++) {
    questionButtons.push(
      <Button
        key={i}
        variant={store.activeQuestionIndex === i - 1 ? "success" : "primary"}
        onClick={() =>
          dispatch({ type: "setActiveQuestion", questionIndex: i - 1 })
        }
      >
        {i}
      </Button>
    );
  }

  return (
    <ButtonToolbar className="mb-4">
      <ButtonGroup className="w-100">{questionButtons}</ButtonGroup>
    </ButtonToolbar>
  );
};

export default QuizTracker;
