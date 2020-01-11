import React, { useReducer } from "react";
import { Context, initialState, reducer } from "./stores/counterStore";
import { Container, Row, Col, Navbar } from "react-bootstrap";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";
import { DisplayQuiz } from "./components/quiz/DisplayQuiz";

function App() {
  const [store, dispatch] = useReducer(reducer, initialState);

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
              Viral Quiz
            </Navbar.Brand>
          </Navbar>
          <Row>
            <Col>
              <DisplayQuiz></DisplayQuiz>
            </Col>
          </Row>
          <Row></Row>
        </Container>
      </div>
    </Context.Provider>
  );
}

export default App;
