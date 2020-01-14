import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { getQuizScoreFromLocalStorage } from "./quiz/quizHelpers";
import firebase from "../firestore";

const db = firebase.firestore();

const DisplayQuizResults = () => {
  let history = useHistory();
  const { quizID } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const quiz = await db
        .collection("quizzes")
        .doc(quizID)
        .get();

      setData(JSON.parse(quiz.data().leaderboard));
    }
    fetchData();
  }, [quizID]);

  return (
    <>
      <h1>Quiz Results</h1>
      <h2>
        You got <strong>{getQuizScoreFromLocalStorage(quizID)}%</strong>
      </h2>
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
      <Button variant="outline-success" onClick={() => history.push("/")}>
        Create Your Own Quiz
      </Button>
    </>
  );
};

export default DisplayQuizResults;
