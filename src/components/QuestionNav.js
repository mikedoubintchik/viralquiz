import React, { useContext } from "react";
import { ButtonGroup, Button, ProgressBar } from "react-bootstrap";
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

  if (props.create) {
    return (
      <ButtonGroup className="mb-4">
        <ButtonGroup className="w-100">{questionButtons}</ButtonGroup>
      </ButtonGroup>
    );
  } else {
    return (
      <ProgressBar
        now={(store.activeQuestionIndex / store.questions.length) * 100}
      />
    );
  }
};

export default QuestionNav;
