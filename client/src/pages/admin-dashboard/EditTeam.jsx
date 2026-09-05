import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import MyButton from "../../componenets/MyButton";
import toast from "react-hot-toast";
import { Loader } from "../../utils/Loader";
import apiClient from "../../utils/apiClient";

const EditTeam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const departmentId = location.state?.departmentId;

  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!departmentId) {
      toast.error("No department selected to edit");
      navigate("/admin-dashboard/employees/teams");
      return;
    }

    const fetchData = async () => {
      try {
        const [deptRes, employeesRes] = await Promise.all([
          apiClient.get(`/api/department/departments/${departmentId}`),
          apiClient.get("/api/employee/users?limit=100"),
        ]);
        setName(deptRes.data.department?.name || "");
        setManager(deptRes.data.department?.manager?._id || "");
        setEmployees(employeesRes.data.users || []);
      } catch (error) {
        toast.error("Failed to load department");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [departmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !manager) {
      toast.error("Department name and manager are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiClient.patch(`/api/department/${departmentId}`, { name, manager });
      if (res.data.success) {
        toast.success(res.data.message || "Department updated");
        navigate("/admin-dashboard/employees/teams");
      }
    } catch (error) {
      toast.error(error.response?.data?.errMsg || "Failed to update department");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center pt-5">
        <Loader />
      </div>
    );
  }

  return (
    <main className="pt-5 teams-wrapper">
      <div className="container-fluid">
        <h2>Edit Department</h2>
        <Form className="pt-3" onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
          <Form.Group className="mb-3">
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
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
              onClick={() => navigate("/admin-dashboard/employees/teams")}
            />
            <MyButton
              variant="primary"
              text={isSubmitting ? "Saving..." : "Save Changes"}
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

export default EditTeam
