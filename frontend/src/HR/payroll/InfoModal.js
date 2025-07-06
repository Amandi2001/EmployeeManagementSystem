import React from "react";
import { Modal, Button } from "react-bootstrap";

const InfoModal = ({ show, onHide, message }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
