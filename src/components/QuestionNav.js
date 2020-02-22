import React, { useContext } from "react";
import { ButtonToolbar, ButtonGroup, Button } from "react-bootstrap";
import { Context } from "../store";

const QuestionNav = props => {
  const { store, dispatch } = useContext(Context);
  const initialQuestionCount = store.questions.length;
  let count = 1;
  let questionButtons = [];

  for (let i = 0; i < initialQuestionCount; i++) {
    if (store.questions[i]) {
      questionButtons.push(
        <Button
          key={i}
          variant={store.activeQuestionIndex === i ? "success" : "primary"}
          onClick={() => {
            props.setQuestionResponse({});
            dispatch({ type: "setActiveQuestion", questionIndex: i });
          }}
        >
          {count}
        </Button>
      );
      count++;
    }
  }

  return (
    <ButtonToolbar className="mb-4">
      <ButtonGroup className="w-100">{questionButtons}</ButtonGroup>
    </ButtonToolbar>
  );
};

export default QuestionNav;
