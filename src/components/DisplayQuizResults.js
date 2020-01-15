import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import {
  getQuizScoreFromLocalStorage,
  createAnswerGuide
} from "./quiz/quizHelpers";
import firebase from "../firestore";
import { Context } from "../store";
import DisplayShare from "./DisplayShare";

const db = firebase.firestore();

const DisplayQuizResults = props => {
  const { store, dispatch } = useContext(Context);
  let history = useHistory();
  const { quizID } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const quiz = await db
        .collection("quizzes")
        .doc(quizID)
        .get();

      const leaderboard = quiz.data().leaderboard;

      setData(leaderboard);

      dispatch({
        type: "updateQuizName",
        quizName: quiz.data().quizName
      });
    }
    fetchData();
  }, [dispatch, quizID]);

  return (
    <>
      {!props.takingQuiz && (
        <h2>
          You got <strong>{getQuizScoreFromLocalStorage(quizID)}%</strong>
        </h2>
      )}
      <DisplayShare url={window.location.href} quizName={store.quizName} />
      <Button
        className="mb-4"
        variant="outline-success"
        onClick={() => history.push("/")}
      >
        Create Your Own Quiz
      </Button>

      {store.quizScore && (
        <div>
          <h2>Your Answers Breakdown</h2>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Your Answer</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {createAnswerGuide(store.creatorAnswers, store.takerAnswers).map(
                (answer, index) => (
                  <tr
                    key={index}
                    className={answer.correct ? "bg-success" : "bg-danger"}
                  >
                    <td>{answer.taker}</td>
                    <td>{answer.creator}</td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </div>
      )}

      <h2>Leaderboard</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name}</td>
              <td>{entry.quizScore}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default DisplayQuizResults;
