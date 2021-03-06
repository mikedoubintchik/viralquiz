import React from "react";
import { Button, Modal, Form } from "react-bootstrap";

const AddAnswer = props => {
  // Props are coming from DisplayQuiz component
  const {
    show,
    closeModal,
    submitAnswerModal,
    validated,
    answer,
    setAnswer
  } = props;

  return (
    <Modal show={show} onHide={() => closeModal("answer")}>
      <Form noValidate validated={validated} onSubmit={submitAnswerModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Custom Answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formBasicAnswer">
            <Form.Control
              type="Answer"
              placeholder="Enter answer"
              required
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Answer cannot be blank
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => closeModal("answer")}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddAnswer;
