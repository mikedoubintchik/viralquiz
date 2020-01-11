import React, { useReducer } from "react";
import { Context, initialState, reducer } from "./store";
import { Container, Row, Col, Navbar } from "react-bootstrap";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";
import { DisplayQuiz } from "./components/quiz/DisplayQuiz";

function App() {
  const [store, dispatch] = useReducer(reducer, initialState);

  console.log(store);

  return (
    <Context.Provider value={{ store, dispatch }}>
      <div className="App">
        <Container>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
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
          <Row>
            <Col>
              <DisplayQuiz></DisplayQuiz>
            </Col>
          </Row>
        </Container>
      </div>
    </Context.Provider>
  );
}

export default App;
