import React, { useContext } from "react";
import {
  ButtonGroup,
  Button,
  ProgressBar,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faQuestion } from "@fortawesome/free-solid-svg-icons";

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
          variant={store.activeQuestionIndex === i ? "primary" : "secondary"}
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

  questionButtons.push(
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="add-question">Add Custom Question</Tooltip>}
    >
      <Button variant="success" onClick={props.showQuestionModal}>
        <FontAwesomeIcon icon={faPlus} /> <FontAwesomeIcon icon={faQuestion} />
      </Button>
    </OverlayTrigger>
  );

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
