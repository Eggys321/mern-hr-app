import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import MyButton from "../../componenets/MyButton";
import toast from "react-hot-toast";
import apiClient from "../../utils/apiClient";

const NewTeam = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiClient.get("/api/employee/users?limit=100");
        setEmployees(res.data.users || []);
      } catch (error) {
        // The manager dropdown just stays empty.
      }
    };
    fetchEmployees();
  }, []);

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
        window.dispatchEvent(new Event("department-created"));
        navigate("/admin-dashboard/employees/teams");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.errMsg || "Failed to create department");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-5 teams-wrapper">
      <div className="container-fluid">
        <h2>New Department</h2>
        <Form className="pt-3" onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
          <Form.Group className="mb-3">
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Department Manager</Form.Label>
            <Form.Select value={manager} onChange={(e) => setManager(e.target.value)}>
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
            <MyButton
              type="button"
              variant="outline-danger"
              text="Cancel"
              className="cancel-btn mb-3"
              onClick={() => {
                reset();
                navigate("/admin-dashboard/employees/teams");
              }}
            />
            <MyButton
              variant="primary"
              text={isSubmitting ? "Saving..." : "Save"}
              className="save-and-continue-btn"
              type="submit"
              disabled={isSubmitting}
            />
          </div>
        </Form>
      </div>
    </main>
  )
}

export default NewTeam
