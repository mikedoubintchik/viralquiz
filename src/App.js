import React, { useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Context, initialState, reducer } from "./store";
import { Container, Row, Col, Navbar, Button } from "react-bootstrap";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./custom.scss";
import RegisterUser from "./components/RegisterUser";
import DisplayQuiz from "./components/quiz/DisplayQuiz";
import QuizCreated from "./components/QuizCreated";
import DisplayQuizResults from "./components/DisplayQuizResults";

function App() {
  const [store, dispatch] = useReducer(reducer, initialState);

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
          <Row>
            <Col>
              <Router>
                <Switch>
                  <Route exact path="/">
                    <RegisterUser />
                  </Route>
                  <Route exact path="/results/:quizID">
                    <DisplayQuizResults />
                  </Route>
                  <Route exact path="/success">
                    <QuizCreated />
                  </Route>
                  <Route exact path="/create/:quizID">
                    <DisplayQuiz create={true} />
                  </Route>
                  <Route exact path="/:quizID">
                    <DisplayQuiz />
                  </Route>
                  <Route>
                    <>
                      <h1>You reached a non-existent page</h1>
                      <Button>Return to Home</Button>
                    </>
                  </Route>
                </Switch>
              </Router>
            </Col>
          </Row>
        </Container>
      </div>
    </Context.Provider>
  );
}

export default App;
