import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon
} from "react-share";
import { Context } from "../store";
import DisplayShare from "./DisplayShare";

const QuizCreated = () => {
  const { store } = useContext(Context);
  let history = useHistory();

  return (
    <>
      <h1>Quiz was successfully created!</h1>
      <h2>Share it with everyone!</h2>
      <DisplayShare url={window.location.href} quizName={store.quizName} />
      <Button variant="outline-success" onClick={() => history.push("/")}>
        Create Another Quiz
      </Button>
    </>
  );
};

export default QuizCreated;
