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
  console.log("TCL: store", store);
  const [loader, setLoader] = useState(false);
  let history = useHistory();
  const takingQuiz = useRouteMatch("/:quizID").isExact;
  const creatingQuiz = props.create;
  const { quizID } = useParams();

  // set quiz ID, if taking a quiz, check that there are no questions in global store to prevent infinite dispatch loop
  if (takingQuiz && store.questions.length === 0) {
    db.collection("quizzes")
      .doc(quizID)
      .get()
      .then(quiz => {
        const { questions, creatorAnswers, quizName } = quiz.data();

        dispatch({
          type: "takingQuiz",
          quizID,
          quizName,
          questions,
          creatorAnswers
        });
      });
  }

  if (creatingQuiz && store.questions.length === 0) {
    db.collection("quizOptions")
      .doc("HowWellDoYouKnowMe?")
      .get()
      .then(quiz => {
        const { data } = quiz.data();

        dispatch({
          type: "createDefaultQuizQuestions",
          questions: data.questions
        });
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
            if (creatingQuiz) {
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
    // build quiz data
    const quizData = {
      quizID: store.quizID,
      userID: store.userID,
      quizName: `How Well Do You Know ${store.userName}?`,
      questions: store.questions,
      creatorAnswers: store.creatorAnswers
    };

    if (creatingQuiz) {
      setLoader(true);

      // save quiz to database
      const user = await db
        .collection("users")
        .doc(store.userID)
        .get();

      // get quizzes for user
      const quizzes = user.quizzes ? JSON.parse(user.quizzes) : [];

      // add new quiz
      quizzes.push(store.quizID);

      // update database record for user with new quiz
      db.collection("users")
        .doc(store.userID)
        .update({ quizzes: JSON.stringify(quizzes) });

      // add quiz to database
      db.collection("quizzes")
        .doc(store.quizID)
        .set(quizData);

      // redirect to created page
      history.push("/success");
    }

    if (takingQuiz) {
      setLoader(true);

      // grade quiz
      const quizScore = gradeQuiz(store.creatorAnswers, store.takerAnswers);

      // save to global store
      dispatch({
        type: "setQuizScore",
        quizScore
      });

      // save to localstorage
      let viralQuizzes = JSON.parse(localStorage.getItem("viralQuizzes"));

      if (viralQuizzes) {
        viralQuizzes.push([{ quizID: store.quizID, quizScore }]);
      } else {
        viralQuizzes = [{ quizID: store.quizID, quizScore }];
      }

      localStorage.setItem("viralQuizzes", JSON.stringify(viralQuizzes));

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
