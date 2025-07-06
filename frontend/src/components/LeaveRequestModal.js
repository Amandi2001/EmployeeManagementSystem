import React from "react";
import { Modal, Button } from "react-bootstrap";

const LeaveRequestModal = ({ show, onHide, leave, onUpdateStatus }) => {
  if (!leave) return null;

  const isPending = leave.status === "PENDING";

  const handleApprove = () => onUpdateStatus(leave.id, "APPROVED");
  const handleReject = () => onUpdateStatus(leave.id, "REJECTED");

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Leave Request Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Username:</strong> {leave.username}</p>
        <p><strong>From:</strong> {leave.fromDate}</p>
        <p><strong>To:</strong> {leave.toDate}</p>
        <p><strong>Reason:</strong> {leave.reason}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`badge bg-${
              leave.status === "APPROVED"
                ? "success"
                : leave.status === "REJECTED"
                ? "danger"
                : "warning"
            }`}
          >
            {leave.status}
          </span>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="success"
          disabled={!isPending}
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button
          variant="danger"
          disabled={!isPending}
          onClick={handleReject}
        >
          Reject
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeaveRequestModal;
