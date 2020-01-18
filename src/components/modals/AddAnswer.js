import React from "react";
import { Button, Modal, Form } from "react-bootstrap";

const AddAnswer = props => {
  // Props are coming from DisplayQuiz component
  const { show, closeAnswerModal, validated, answer, setAnswer } = props;

  return (
    <Modal show={show} onHide={closeAnswerModal}>
      <Form noValidate validated={validated} onSubmit={closeAnswerModal}>
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
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAnswerModal}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddAnswer;
