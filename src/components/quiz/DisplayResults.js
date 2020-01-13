import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../../store";
import {
  Container,
  Row,
  Col,
  Image,
  ButtonToolbar,
  Button
} from "react-bootstrap";
import firebase from "../../firestore";

const db = firebase.firestore();

const DisplayQuiz = props => {
  // const { store, dispatch } = useContext(Context);
  return (
    <>
      <h1>Meow</h1>
    </>
  );
};

export default DisplayQuiz;
