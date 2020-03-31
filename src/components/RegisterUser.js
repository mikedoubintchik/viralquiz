import React, { useState, useEffect, useCallback, useContext } from "react";
import { Card, Col, Button, Form, Toast } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import { Context } from "../store";
import { getQuizScoreFromLocalStorage, createQuiz } from "./quiz/quizHelpers"; // eslint-disable-line no-unused-vars
import firebase, { onAuthStateChange, login, logout } from "../firestore";
import DisplayQuizResults from "./DisplayQuizResults";

const db = firebase.firestore();

// createQuiz(db);

const RegisterUser = props => {
  const [user, setUser] = useState({ loggedIn: false, uid: null });
  const [error, setError] = useState();
  const [showErrorToast, setShowErrorToast] = useState(false);

  const { store, dispatch } = useContext(Context);
  const [userName, setUserName] = useState("");
  // const [userEmail, setUserEmail] = useState("");
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
      const { uid } = user;
      setLoader(true);

      if (creatingQuiz) {
        // save user to database
        await db
          .collection("users")
          .doc(user.uid)
          .set({ userName, uid });

        // generate quiz ID
        const quizID = Math.floor(
          Math.random() * Math.floor(1000000000)
        ).toString();

        // save user data to global store
        dispatch({
          type: "saveUser",
          userID: uid,
          quizID,
          userName
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

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);

    return () => unsubscribe();
  }, []);

  const requestLogin = useCallback(async method => {
    try {
      await login(method);
    } catch (error) {
      setError(error.message);
      setShowErrorToast(true);
    }
  }, []);

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  return (
    <>
      {showErrorToast && (
        <Toast
          style={{
            position: "fixed",
            top: 5,
            right: 5,
            zIndex: 1
          }}
          show={showErrorToast}
          onClose={() => setShowErrorToast(false)}
        >
          <Toast.Header>
            <FontAwesomeIcon
              color="#ffc107"
              size="2x"
              icon={faExclamationTriangle}
            />{" "}
            <strong className="mr-auto">Error Signing In</strong>
          </Toast.Header>
          <Toast.Body>{error}</Toast.Body>
        </Toast>
      )}

      {!loader && (
        <Card className="mb-4">
          <Card.Header className="text-center">
            <h3>{creatingQuiz ? "Create Quiz" : "Take Quiz"}</h3>
          </Card.Header>
          <Card.Body className="text-center">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Row>
                <Col>
                  <Form.Group controlId="formBasicName">
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

                  {/* {creatingQuiz && (
                  <Col>
                    <Form.Group controlId="formBasicEmail">
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
                )} */}

                  {!user.loggedIn && creatingQuiz && (
                    <>
                      <Button
                        block
                        variant="info"
                        onClick={() => requestLogin("google")}
                      >
                        <FontAwesomeIcon icon={["fab", "google"]} />
                        {" Login with Google"}
                      </Button>
                      <Button block onClick={() => requestLogin("facebook")}>
                        <FontAwesomeIcon icon={["fab", "facebook"]} />
                        {" Login with Facebook"}
                      </Button>
                    </>
                  )}
                  {user.loggedIn && creatingQuiz && (
                    <Button block type="submit" variant="success">
                      Start Making Quiz
                    </Button>
                  )}
                  {!creatingQuiz && (
                    <Button block type="submit" variant="success">
                      Start Quiz
                    </Button>
                  )}
                  {user.loggedIn && (
                    <Button
                      block
                      variant="outline-primary"
                      onClick={requestLogout}
                    >
                      Logout
                    </Button>
                  )}
                </Col>
              </Form.Row>
            </Form>
          </Card.Body>
        </Card>
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
