import React, { useContext } from "react";
import { ButtonToolbar, ButtonGroup, Button } from "react-bootstrap";
import { Context } from "../store";

const QuizTracker = props => {
  const { store, dispatch } = useContext(Context);
  const questionsCount = store.questions.length;

  let questionButtons = [];

  for (let i = 1; i <= questionsCount; i++) {
    if (store.questions[i - 1]) {
      questionButtons.push(
        <Button
          key={i}
          variant={store.activeQuestionIndex === i - 1 ? "success" : "primary"}
          onClick={() => {
            props.setQuestionResponse({});
            dispatch({ type: "setActiveQuestion", questionIndex: i - 1 });
          }}
        >
          {i}
        </Button>
      );
    }
  }

  return (
    <ButtonToolbar className="mb-4">
      <ButtonGroup className="w-100">{questionButtons}</ButtonGroup>
    </ButtonToolbar>
  );
};

export default QuizTracker;
