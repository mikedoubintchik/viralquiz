import React from "react";
import { Button, Modal, Form } from "react-bootstrap";

const AddQuestion = props => {
  // Props are coming from DisplayQuiz component
  const { show, closeQuestionModal, validated, question, setQuestion } = props;

  return (
    <Modal show={show} onHide={closeQuestionModal}>
      <Form noValidate validated={validated} onSubmit={closeQuestionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formBasicQuestion">
            <Form.Control
              type="Question"
              placeholder="Enter Question"
              required
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeQuestionModal}>
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

export default AddQuestion;
