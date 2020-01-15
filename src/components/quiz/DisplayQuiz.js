import React, { useContext, useState } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { Context } from "../../store";
import {
  Container,
  Row,
  Col,
  ButtonToolbar,
  Button,
  Card
} from "react-bootstrap";
import Loader from "react-loader-spinner";
import { gradeQuiz } from "./quizHelpers";
import firebase from "../../firestore";

const db = firebase.firestore();

const DisplayQuiz = props => {
  const { store, dispatch } = useContext(Context);
  const [loader, setLoader] = useState(false);
  const [questionResponse, setQuestionResponse] = useState({});
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
        const {
          questions,
          creatorAnswers,
          quizName,
          leaderboard
        } = quiz.data();

        dispatch({
          type: "takingQuiz",
          quizID,
          quizName,
          questions,
          creatorAnswers,
          leaderboard
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
        <Col key={index} xs={6} md={4}>
          <Card
            className={`answer text-center mb-4${
              index === questionResponse.answer ? " active" : ""
            }`}
            onClick={() => {
              setQuestionResponse({ question: questionIndex, answer: index });
            }}
          >
            <Card.Img variant="top" src="http://placekitten.com/200/100" />
            <Card.Body>
              <Card.Title>{answer}</Card.Title>
            </Card.Body>
          </Card>
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

  const handleNext = () => {
    // reset local state answer tracker
    setQuestionResponse({});

    // if user is creating a quiz
    if (creatingQuiz) {
      dispatch({
        type: "recordCreatorAnswer",
        questionIndex: questionResponse.question,
        answer: questionResponse.answer
      });
    }
    // if user is taking a quiz
    else {
      dispatch({
        type: "recordTakerAnswer",
        questionIndex: questionResponse.question,
        answer: questionResponse.answer
      });
    }
    dispatch({ type: "incrementActiveQuestion" });
  };

  const submitQuiz = async creatorAnswers => {
    const quizName = `How Well Do You Know ${store.userName}?`;
    // update quiz name in global store
    dispatch({
      type: "updateQuizName",
      quizName
    });

    if (creatingQuiz) {
      setLoader(true);

      // record last answer
      dispatch({
        type: "recordCreatorAnswer",
        questionIndex: questionResponse.question,
        answer: questionResponse.answer
      });

      // build quiz data
      const quizData = {
        quizID: store.quizID,
        userID: store.userID,
        quizName,
        questions: store.questions,
        creatorAnswers: [
          ...store.creatorAnswers,
          {
            question: questionResponse.question,
            answer: questionResponse.answer
          }
        ],
        leaderboard: []
      };

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
        .update({
          quizzes: JSON.stringify(quizzes)
        });

      // add quiz to database
      db.collection("quizzes")
        .doc(store.quizID)
        .set(quizData);

      // redirect to created page
      history.push("/success");
    }

    if (takingQuiz) {
      setLoader(true);

      // record last answer
      dispatch({
        type: "recordTakerAnswer",
        questionIndex: questionResponse.question,
        answer: questionResponse.answer
      });

      // generate answers array with last answer
      const allAnswers = [
        ...store.takerAnswers,
        {
          question: questionResponse.question,
          answer: questionResponse.answer
        }
      ];

      // grade quiz
      const quizScore = gradeQuiz(store.creatorAnswers, allAnswers);

      // save to global store
      dispatch({
        type: "setQuizScore",
        quizScore
      });

      // save to localstorage
      let viralQuizzes = JSON.parse(localStorage.getItem("viralQuizzes"));

      if (viralQuizzes) {
        viralQuizzes.push({
          quizID: store.quizID,
          quizScore
        });
      } else {
        viralQuizzes = [
          {
            quizID: store.quizID,
            quizScore
          }
        ];
      }

      localStorage.setItem("viralQuizzes", JSON.stringify(viralQuizzes));

      // save to leaderboard database
      const quiz = await db
        .collection("quizzes")
        .doc(store.quizID)
        .get();

      // get leaderboard for quiz
      const leaderboard = quiz.data() ? quiz.data().leaderboard : [];

      // add quiz score to leaderboard
      leaderboard.push({
        name: store.userName,
        quizScore
      });

      // update database record for quiz with new leaderboard
      db.collection("quizzes")
        .doc(store.quizID)
        .update({
          leaderboard
        });

      // redirect to results
      history.push(`/results/${store.quizID}`);
    }
  };

  return (
    <>
      {!loader && (
        <>
          <div>{generateQuestionsHTML(store.questions)}</div>

          <ButtonToolbar className="mt-4 d-flex justify-content-between">
            {/* <Button
              variant="outline-danger"
              onClick={() => dispatch({ type: "reset" })}
            >
              Reset
            </Button> */}
            {/* <Button
              variant="outline-primary"
              onClick={() => dispatch({ type: "decrementActiveQuestion" })}
            >
              Previous
            </Button> */}
            {store.activeQuestionIndex < store.questions.length - 1 && (
              <Button variant="outline-secondary" onClick={() => handleNext()}>
                Next
              </Button>
            )}
            {store.activeQuestionIndex === store.questions.length - 1 && (
              <Button variant="outline-success" onClick={() => submitQuiz()}>
                Submit
              </Button>
            )}
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
