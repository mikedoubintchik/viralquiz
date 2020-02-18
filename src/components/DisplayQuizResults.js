import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getQuizScoreFromLocalStorage } from "./quiz/quizHelpers";
import firebase from "../firestore";
import { Context } from "../store";
import DisplayShare from "./DisplayShare";
import { Leaderboard } from "./quiz/Leaderboard";
import { AnswerGuide } from "./quiz/AnswerGuide";

const db = firebase.firestore();

const DisplayQuizResults = ({ takingQuiz }) => {
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

      const quizData = quiz.data();

      // if no quizData, redirect to home page
      if (!quizData) history.push("/");

      const leaderboard = quizData.leaderboard;

      setData(leaderboard);

      dispatch({
        type: "updateQuizName",
        quizName: quiz.data().quizName
      });
    }
    fetchData();
  }, [dispatch, history, quizID]);

  return (
    <>
      {!takingQuiz && (
        <h2>
          You got <strong>{getQuizScoreFromLocalStorage(quizID)}%</strong>
        </h2>
      )}

      <DisplayShare quizID={quizID} quizName={store.quizName} />

      {store.quizScore && <AnswerGuide store={store} data={data} />}

      <Leaderboard data={data} />
    </>
  );
};

export default DisplayQuizResults;
