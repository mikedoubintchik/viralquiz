import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { getQuizScoreFromLocalStorage } from "./quiz/quizHelpers";
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

      const leaderboard = JSON.parse(quiz.data().leaderboard);

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
