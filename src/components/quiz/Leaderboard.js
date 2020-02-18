import React from "react";
import { Table } from "react-bootstrap";

export const Leaderboard = ({ data }) => (
  <>
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
            <td>{Math.round(entry.quizScore)}%</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
);
