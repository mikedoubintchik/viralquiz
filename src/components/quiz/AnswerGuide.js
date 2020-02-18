import React from "react";
import { Table } from "react-bootstrap";
import { createAnswerGuide } from "./quizHelpers";

export const AnswerGuide = ({ store, data }) => (
  <>
    <h2>Your Answers Breakdown</h2>
    <Table bordered hover>
      <thead>
        <tr>
          <th>Question</th>
          <th>Your Answer</th>
          <th>Correct Answer</th>
        </tr>
      </thead>
      <tbody>
        {createAnswerGuide(
          store.questions,
          store.creatorAnswers,
          store.takerAnswers
        ).map((data, index) => (
          <tr key={index} className={data.correct ? "bg-success" : "bg-danger"}>
            <td>{data.question}</td>
            <td>{data.taker}</td>
            <td>{data.creator}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
);
