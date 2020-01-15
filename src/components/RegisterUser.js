import React, { useState, useContext } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Context } from "../store";
import { useHistory, useParams } from "react-router-dom";
import Loader from "react-loader-spinner";

import { getQuizScoreFromLocalStorage } from "./quiz/quizHelpers";
import firebase from "../firestore";

import quizData from "./quiz/quiz-data/how-well-you-know-me.json";
import DisplayQuizResults from "./DisplayQuizResults";

const db = firebase.firestore();

const createQuiz = () => {
  db.collection("quizOptions")
    .doc("HowWellDoYouKnowMe?")
    .update({
      quizName: "How Well Do You Know Me?",
      data: quizData
    });
};

// createQuiz();

const RegisterUser = props => {
  const { store, dispatch } = useContext(Context);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [loader, setLoader] = useState(false);
  let history = useHistory();
  const { quizID } = useParams();
  const creatingQuiz = props.create;
  const testAlreadyTaken = getQuizScoreFromLocalStorage(quizID);

  // update quiz name
  if (quizID && store.quizName === "Create Your Quiz!") {
    db.collection("quizzes")
      .doc(quizID)
      .get()
      .then(quiz => {
        const { quizName } = quiz.data();

        dispatch({
          type: "updateQuizName",
          quizName
        });
      });
  }

  // if test is already taken redirect to results
  if (quizID && testAlreadyTaken) history.push(`/results/${quizID}`);

  const handleSubmit = async event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    // if all values in form are valid
    if (form.checkValidity() === true) {
      setLoader(true);

      if (creatingQuiz) {
        // save user to database
        const user = await db.collection("users").add({ userName, userEmail });

        // generate quiz ID
        const quizID = Math.floor(
          Math.random() * Math.floor(1000000000)
        ).toString();

        // save user data to global store
        dispatch({
          type: "saveUser",
          userID: user.id,
          quizID,
          userName,
          userEmail
        });

        // show create quiz
        history.push(`/create/${quizID}`);
      }

      if (!creatingQuiz) {
        // save user data to global store
        dispatch({
          type: "saveUser",
          userName
        });
      }

      setLoader(false);
    }
  };

  return (
    <>
      {!loader && (
        <Form
          className="mb-4"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Row>
            <Col>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Name"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Name is required
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            {creatingQuiz && (
              <Col>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Enter email"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid email is required
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
              </Col>
            )}
          </Row>

          <Button type="submit" variant="outline-success">
            {creatingQuiz ? "Create Quiz" : "Take Quiz"}
          </Button>
        </Form>
      )}

      {!loader && !creatingQuiz && <DisplayQuizResults takingQuiz={true} />}

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

export default RegisterUser;
