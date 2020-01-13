import React, { useContext, useState } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { Context } from "../../store";
import {
  Container,
  Row,
  Col,
  Image,
  ButtonToolbar,
  Button
} from "react-bootstrap";
import Loader from "react-loader-spinner";
import { gradeQuiz } from "./quizHelpers";
import firebase from "../../firestore";

const db = firebase.firestore();

const DisplayQuiz = props => {
  const { store, dispatch } = useContext(Context);
  const [loader, setLoader] = useState(false);
  let history = useHistory();
  const takingQuiz = useRouteMatch("/:quizID").isExact;
  const { quizID } = useParams();

  // set quiz ID, if taking a quiz
  if (takingQuiz) {
    dispatch({
      type: "setQuizID",
      quizID,
      creatorAnswers: db.collection("quizzes").doc(quizID)
    });
  }

  const generateAnswersHTML = (answers, questionIndex) => {
    return answers.map((answer, index) => {
      return (
        <Col
          key={index}
          xs={6}
          md={4}
          onClick={() => {
            // if user is creating a quiz
            if (props.create) {
              dispatch({
                type: "recordCreatorAnswer",
                questionIndex: questionIndex,
                answer: index
              });
            }
            // if user is taking a quiz
            else {
              dispatch({
                type: "recordTakerAnswer",
                questionIndex: questionIndex,
                answer: index
              });
            }
          }}
        >
          <Image src="http://placekitten.com/200/200" fluid />
          {answer}
        </Col>
      );
    });
  };

  const generateQuestionsHTML = questions => {
    return questions.map((question, index) => {
      return (
        <div
          key={index}
          className={`question${
            store.activeQuestionIndex === index ? " active" : ""
          }`}
        >
          <h1>{question.question}</h1>
          <Container>
            <Row>{generateAnswersHTML(question.answers, index)}</Row>
          </Container>
        </div>
      );
    });
  };

  const submitQuiz = async creatorAnswers => {
    console.log("submitted");
    console.log("store: \n", store);

    // build quiz data
    const quizData = {
      quizID: store.quizID,
      userID: store.userID,
      questions: store.questions,
      creatorAnswers: store.creatorAnswers
    };

    // if creating a quiz
    if (props.create) {
      setLoader(true);

      // save quiz to database
      db.collection("users")
        .doc(store.userID)
        .collection("quizzes")
        .add({ id: store.quizID });

      db.collection("quizzes")
        .doc(store.quizID)
        .set(quizData);

      // redirect to created page
      history.push("/success");
    }
    // if taking a quiz
    else {
      setLoader(true);

      // grade quiz
      gradeQuiz(store.creatorAnswers, store.takerAnswers);

      // redirect to results
      history.push(`/results/${store.quizID}`);
    }
  };

  return (
    <>
      {!loader && (
        <>
          <div>{generateQuestionsHTML(store.questions)}</div>

          <ButtonToolbar>
            <Button
              variant="outline-danger"
              onClick={() => dispatch({ type: "reset" })}
            >
              Reset
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => dispatch({ type: "decrementActiveQuestion" })}
            >
              Previous
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => dispatch({ type: "incrementActiveQuestion" })}
            >
              Next
            </Button>
            <Button variant="outline-success" onClick={() => submitQuiz()}>
              Submit
            </Button>
          </ButtonToolbar>
        </>
      )}

      {loader && (
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      )}
    </>
  );
};

export default DisplayQuiz;
