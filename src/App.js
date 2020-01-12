import React, { useReducer, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Context, initialState, reducer } from "./store";
import { Container, Row, Col, Navbar, Button, Form } from "react-bootstrap";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";
import { DisplayQuiz } from "./components/quiz/DisplayQuiz";
import { createQuiz } from "./components/quiz/quizHelpers";

function App() {
  const [store, dispatch] = useReducer(reducer, initialState);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [validated, setValidated] = useState(false);
  let history = useHistory();
  // determine if user is creating or taking a test
  const create = useRouteMatch("/create/:quizID");

  // console.log("Store:\n", store);

  const handleSubmit = async event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === true) {
      const quizID = await createQuiz({ userName, userEmail });
      history.push(`/create/${quizID}`);
    }
  };

  return (
    <Context.Provider value={{ store, dispatch }}>
      <div className="App">
        <Container>
          <Navbar bg="dark" variant="dark" className="mb-4">
            <Navbar.Brand href="/">
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              {store.quizName}
            </Navbar.Brand>
          </Navbar>
          {!create && (
            <Row>
              <Col>
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
              </Col>
            </Row>
          )}
          {create && (
            <Row>
              <Col>
                <DisplayQuiz create={create}></DisplayQuiz>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </Context.Provider>
  );
}

export default App;
