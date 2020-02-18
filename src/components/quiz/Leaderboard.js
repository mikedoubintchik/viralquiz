import React from "react";
import { Card, Table } from "react-bootstrap";

export const Leaderboard = ({ data }) => (
  <Card>
    <Card.Header className="text-center">
      <h3>Leaderboard</h3>
    </Card.Header>
    <Card.Body>
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
    </Card.Body>
  </Card>
);
