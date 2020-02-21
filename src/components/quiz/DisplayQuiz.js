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
import Picker from "react-giphy-picker-advanced";
import AddAnswer from "../modals/AddAnswer";
import AddQuestion from "../modals/AddQuestion";
import { gradeQuiz } from "./quizHelpers";
import firebase from "../../firestore";
import QuizTracker from "../QuizTracker";

const db = firebase.firestore();

const DisplayQuiz = props => {
  const { store, dispatch } = useContext(Context);
  const [loader, setLoader] = useState(false);
  const [validatedAnswer, setValidatedAnswer] = useState(false);
  const [validatedQuestion, setValidatedQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [activeAnswer, setActiveAnswer] = useState(null);
  const [question, setQuestion] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionResponse, setQuestionResponse] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  let history = useHistory();
  const takingQuiz = useRouteMatch("/:quizID").isExact;
  const creatingQuiz = props.create;
  const { quizID } = useParams();

  // if taking a quiz, set quiz ID
  // check that there are no questions in global store to prevent infinite dispatch loop
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

  // if creating a quiz, get default questions from DB and populate global store
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

  const selectImage = gif => {
    const image = gif.downsized_large.url;

    // save image to global store
    dispatch({
      type: "updateAnswerImage",
      questionIndex: store.activeQuestionIndex,
      answer: activeAnswer,
      image
    });

    setShowPicker(false);
  };

  const generateAnswersHTML = (answers, questionIndex) => {
    return answers.map((answer, index) => {
      const selected = index === questionResponse.answer ? " selected" : "";
      const answered =
        (takingQuiz && index === store.takerAnswers[questionIndex]) ||
        (creatingQuiz && index === store.creatorAnswers[questionIndex])
          ? " answered"
          : "";

      return (
        <Col key={index} xs={6} md={4}>
          <Card className={`answer text-center mb-4${selected}${answered}`}>
            {creatingQuiz && (
              <Button
                variant="danger answer-delete"
                onClick={() =>
                  dispatch({
                    type: "deleteAnswer",
                    questionIndex: questionIndex,
                    answerIndex: index
                  })
                }
              >
                ×
              </Button>
            )}
            <Card.Img
              variant="top"
              src={
                store.questions[questionIndex].images[index]
                  ? store.questions[questionIndex].images[index]
                  : creatingQuiz
                  ? "https://static.thenounproject.com/png/187803-200.png"
                  : ""
              }
              onClick={() => {
                if (creatingQuiz) {
                  setActiveAnswer(index);
                  setShowPicker(!showPicker);
                }

                if (takingQuiz) {
                  recordAnswer(questionIndex, index);
                }
              }}
            />

            <Card.Body onClick={() => recordAnswer(questionIndex, index)}>
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
          <Container className="mb-4">
            {creatingQuiz && (
              <Row className="mb-4 justify-content-end">
                <Button onClick={showQuestionModal}>Add Custom Question</Button>
              </Row>
            )}
            <Row className="justify-content-between">
              <h1 className="mb-4">{question.question}</h1>
              {creatingQuiz && (
                <Button onClick={() => showAnswerModal(index)}>
                  Add Custom Answer
                </Button>
              )}
            </Row>
          </Container>

          <Container>
            <Row className="justify-content-center">
              {generateAnswersHTML(question.answers, index).length === 0 && (
                <h4 className="">Add some answers</h4>
              )}
            </Row>
          </Container>
          <Row>{generateAnswersHTML(question.answers, index)}</Row>
        </div>
      );
    });
  };

  const showAnswerModal = questionIndex => {
    // show modal
    setShowAnswer(true);
  };

  const showQuestionModal = () => {
    // show modal
    setShowQuestion(true);
  };

  const closeModal = type => {
    // reset answer, reset validation, hide loader, hide modal
    setLoader(false);

    if (type === "answer") {
      setAnswer("");
      setValidatedAnswer(false);
      setShowAnswer(false);
    }

    if (type === "question") {
      setQuestion("");
      setValidatedQuestion(false);
      setShowQuestion(false);
    }
  };

  const submitAnswerModal = async event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidatedAnswer(true);

    // if all values in form are valid
    if (form.checkValidity() === true) {
      // hide modal and show loader
      setShowAnswer(false);
      setLoader(true);

      dispatch({
        type: "addCustomAnswer",
        questionIndex: store.activeQuestionIndex,
        answer
      });

      // reset answer, reset validation, hide loader
      setAnswer("");
      setValidatedAnswer(false);
      setLoader(false);
    }
  };

  const submitQuestionModal = async event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidatedQuestion(true);

    // if all values in form are valid
    if (form.checkValidity() === true) {
      // hide modal and show loader
      setShowQuestion(false);
      setLoader(true);

      dispatch({
        type: "addQuestion",
        questionIndex: store.activeQuestionIndex,
        question
      });

      // update active question
      dispatch({
        type: "setActiveQuestion",
        questionIndex: store.questions.length - 1
      });

      // reset question, reset validation, hide loader
      setQuestion("");
      setValidatedQuestion(false);
      setLoader(false);
    }
  };

  const handlePrev = () => {
    // reset local state answer tracker
    setQuestionResponse({});
    dispatch({ type: "decrementActiveQuestion" });
  };

  const handleNext = () => {
    // reset local state answer tracker
    setQuestionResponse({});
    dispatch({ type: "incrementActiveQuestion" });
  };

  const recordAnswer = (questionIndex, answer) => {
    // save answer in local state
    setQuestionResponse({
      question: questionIndex,
      answer
    });

    // store answer in global store
    dispatch({
      type: creatingQuiz ? "recordCreatorAnswer" : "recordTakerAnswer",
      questionIndex,
      answer
    });

    // after 1 second
    setTimeout(() => {
      // display next question
      dispatch({
        type: "incrementActiveQuestion"
      });

      // reset local state
      setQuestionResponse({});
    }, 1000);
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
        creatorAnswers: {
          ...store.creatorAnswers
        },
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
      const allAnswers = {
        ...store.takerAnswers,
        [questionResponse.question]: questionResponse.answer
      };

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
          <QuizTracker setQuestionResponse={setQuestionResponse} />

          <div className="mt-4">{generateQuestionsHTML(store.questions)}</div>

          <ButtonToolbar className="mt-4 mb-4 justify-content-between">
            {/*  <Button
              variant="outline-danger"
              onClick={() => {
                // add are you sure modal?
                // dispatch({ type: "reset" });
              }}
            >
              Reset
            </Button>*/}
            {store.activeQuestionIndex > 0 && (
              <Button variant="outline-primary" onClick={handlePrev}>
                Previous
              </Button>
            )}
            {store.activeQuestionIndex < store.questions.length - 1 && (
              <Button variant="outline-secondary" onClick={handleNext}>
                Next Question
              </Button>
            )}
            {(store.questions.length ===
              Object.keys(store.takerAnswers).length ||
              store.questions.length ===
                Object.keys(store.creatorAnswers).length) && (
              <Button variant="outline-success" onClick={submitQuiz}>
                {creatingQuiz ? "Finish Quiz" : "Submit Quiz"}
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

      <Picker
        apiKey="NeMyiU4oXyLBHnSQVpjCG65hfeqCTk6t"
        onSelected={selectImage.bind(this)}
        modal={true}
        visible={showPicker}
        handleClose={() => setShowPicker(false)}
      />

      <AddQuestion
        question={question}
        setQuestion={setQuestion}
        validated={validatedQuestion}
        show={showQuestion}
        submitQuestionModal={submitQuestionModal}
        closeModal={closeModal}
      />

      <AddAnswer
        answer={answer}
        setAnswer={setAnswer}
        validated={validatedAnswer}
        show={showAnswer}
        submitAnswerModal={submitAnswerModal}
        closeModal={closeModal}
      />
    </>
  );
};

export default DisplayQuiz;
