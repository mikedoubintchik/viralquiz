import React, { useState, useContext } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Context } from "../store";
import { useHistory } from "react-router-dom";

import firebase from "../firestore";

const db = firebase.firestore();

const RegisterUser = () => {
  const { store, dispatch } = useContext(Context);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [validated, setValidated] = useState(false);
  let history = useHistory();

  const handleSubmit = async event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    // if all values in form are valid
    if (form.checkValidity() === true) {
      // save user to database
      const user = await db.collection("users").add({ userName, userEmail });

      // save user data to global store
      dispatch({
        type: "saveUser",
        userID: user.id,
        userName,
        userEmail
      });

      // show create quiz
      history.push(`/create/${store.quizID}`);
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
      </Row>

      <Button type="submit" variant="outline-success">
        Create Quiz
      </Button>
    </Form>
  );
};

export default RegisterUser;
