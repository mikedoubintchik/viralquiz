import React, { useReducer } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Context, initialState, reducer } from "./store";
import { Container, Row, Col, Navbar, Button } from "react-bootstrap";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";
import { DisplayQuiz } from "./components/quiz/DisplayQuiz";
import { createQuiz } from "./components/quiz/quizHelpers";

function App() {
  const [store, dispatch] = useReducer(reducer, initialState);
  let history = useHistory();
  // determine if user is creating or taking a test
  const create = useRouteMatch("/create/:quizID");

  console.log("Store:\n", store);

  const handleCreate = () => {
    const quizID = createQuiz();
    history.push(`/create/${quizID}`);
  };

  return (
    <Context.Provider value={{ store, dispatch }}>
      <div className="App">
        <Container>
          <Navbar bg="dark" variant="dark">
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
              <Button variant="outline-success" onClick={() => handleCreate()}>
                Create Quiz
              </Button>
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
