import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";
import "../styles/NewTeamModal.css";
import apiClient from "../utils/apiClient";

const NewTeamModal = (props) => {
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!props.show) return;
    const fetchEmployees = async () => {
      try {
        const res = await apiClient.get("/api/employee/users?limit=100");
        setEmployees(res.data.users || []);
      } catch (error) {}
    };
    fetchEmployees();
  }, [props.show]);

  function reset() {
    setName("");
    setManager("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !manager) {
      toast.error("Department name and manager are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiClient.post("/api/department/create", { name, manager });
      if (res.data.success) {
        toast.success(res.data.message || "Department created");
        reset();
        window.dispatchEvent(new Event("department-created"));
        props.onHide?.();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.errMsg || "Failed to create department");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="new-team-wrapper"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span> Create New Department</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="departmentName">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="deptManager">
              <Form.Label>Dept Manager</Form.Label>
              <Form.Select
                className="new-team-wrapper-select"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
              >
                <option disabled value="">
                  Select
                </option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex flex-column-reverse flex-md-row gap-3 w-100">
              <Button
                type="button"
                variant="outline-danger"
                className="cancel-btn mb-2"
                onClick={() => {
                  reset();
                  props.onHide?.();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="save-and-continue-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewTeamModal;
