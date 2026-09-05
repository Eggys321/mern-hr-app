import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ConfirmModal = ({
  show,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  isConfirming = false,
}) => (
  <Modal show={show} onHide={onCancel} centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onCancel} disabled={isConfirming}>
        {cancelText}
      </Button>
      <Button variant={variant} onClick={onConfirm} disabled={isConfirming}>
        {isConfirming ? "Please wait..." : confirmText}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal;
