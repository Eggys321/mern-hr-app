import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { allEmployeesList } from "../db";
import "../styles/EmployeeTable.css";
import chevronRight from "../assets/chevron right.svg";
import chevronLeft from "../assets/chevron-left.svg";
import axios from "axios";
import { Loader } from "../utils/Loader";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import MyButton from "./MyButton";
import EditProfileModal from "./EditProfileModal";

const EmployeeTable = ({ Name, Email, Team, Supervisor, Status }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const token = localStorage.getItem("hr-token");
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://mern-hr-app.onrender.com/api/employee/users?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data.errMsg || "Error fetching employees");
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const getEmployeeById = async (id) => {
    try {
      setLoading(true);
      const req = await axios.get(`https://mern-hr-app.onrender.com/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedEmployee(req.data.employee);
      // console.log(req.data.employee);
      setShowModal(true);
    } catch (error) {
      setError("Error fetching task details");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, [page]);
  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <Loader />
      </div>
    );
  if (error) return <p>{error}</p>;
  const handleRowClick = (employeeId) => {
    getEmployeeById(employeeId);
  };
  return (
    <>
      <main className="employee-table-wrapper employee-table-container">
        <div className="employee-table">
          <Table responsive="sm" hover role="button">
            <thead className="employee-table-wrapper-head">
              <tr>
                <th>
                  {" "}
                  <h5 className="employee-table-wrapper-h5">Name</h5>{" "}
                </th>
                <th>
                  <h5 className="employee-table-wrapper-h5">Email</h5>{" "}
                </th>
                <th>
                  <h5 className="employee-table-wrapper-h5">Dept</h5>{" "}
                </th>
                <th>
                  <h5 className="employee-table-wrapper-h5">Supervisor</h5>{" "}
                </th>
                <th>
                  <h5 className="employee-table-wrapper-h5">Status</h5>{" "}
                </th>
              </tr>
            </thead>
            {employees.map((employee) => {
              return (
                <tbody key={employee._id} className="employee-table-body">
                  <tr onClick={() => handleRowClick(employee._id)}>
                    <td>
                      <div className="d-flex gap-2 align-items-center ">
                        <div className="employee-profile-image">
                          <img
                            src={employee.profileImage}
                            alt=""
                            className=""
                          />
                        </div>
                        <h6
                          id="employee-table-name"
                          className="employee-table-data pt-1"
                        >
                          {`${employee.firstName} ${employee.lastName}`}
                        </h6>
                      </div>
                    </td>
                    <td>
                      <p
                        id="employee-table-email"
                        className="employee-table-data"
                      >
                        {" "}
                        {employee.email}{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        id="employee-table-team"
                        className="employee-table-data"
                      >
                        {" "}
                        {employee?.department?.name}{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        id="employee-table-supervisor"
                        className="employee-table-data"
                      >
                        {" "}
                        {employee?.department?.manager?.firstName +
                          " " +
                          employee?.department?.manager?.lastName}{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        className={`${
                          employee.employmentStatus === "remote"
                            ? "employee-table-orange"
                            : employee.employmentStatus === "on-site"
                            ? "employee-table-green"
                            : "employee-table-blue"
                        }`}
                      >
                        {" "}
                        {employee.employmentStatus}{" "}
                      </p>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </Table>
          {/* Modal for Employee Details */}
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="employment-modal-header ps-2">Employee’s Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body className="container employment-modal-wrapper">
              {selectedEmployee ? (
                <>
                  <section className="container py-3">
                    <div className="d-flex gap-4 flex-wrap justify-content-between" >
                      <div className="d-flex flex-wrap gap-3">

                      <div className="employee-modal-profile-image">
                        <img
                          src={selectedEmployee?.profileImage}
                          alt=""
                        />
                      </div>
                      <div className="employment-modal-contact">
                        <h6 className="employment-modal-fullname"> {`${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`}  </h6>
                        <p className="employment-modal-email"> {selectedEmployee?.email} </p>
                      </div>
                      </div>
                      <div>
                        <MyButton className="employment-modal-edit-btn" text="Edit Profile" onClick={() => setShowEditModal(true)}/>
                      </div>
                    </div>
                    <h2 className="py-4">Personal Information</h2>
                  <div>
                    <div className="row">
                      <div className="col-lg-4">

                      <h5 className="employment-modal-h5"> Mobile Number </h5>
                      <p className="employment-modal-ptag"> {selectedEmployee?.mobileNumber} </p>
                      </div>
                      <div className="col-lg-4">

                      <h5 className="employment-modal-h5"> Date of Birth </h5>
                      <p className="employment-modal-ptag"> {selectedEmployee?.dateOfBirth.slice(0,10)} </p>
                      </div>
                      <div className="col-lg-4">

                      <h5 className="employment-modal-h5"> Marital Status</h5>
                      <p className="employment-modal-ptag"> {selectedEmployee?.maritalStatus} </p>
                      </div>
                      <div className="col-lg-4 mt-3">

                      <h5 className="employment-modal-h5"> Gender </h5>
                      <p className="employment-modal-ptag"> {selectedEmployee?.gender} </p>
                      </div>
                      <div className="col-lg-4 mt-3">

                      <h5 className="employment-modal-h5">Address</h5>
                      <p className="employment-modal-ptag"> {selectedEmployee?.address} </p>
                      </div>
                    </div>
                    
                  </div>
                  <div>
                    <h2 className="py-4">Job Information</h2>
                    <div className="row">
                      <div className="col-lg-4">
                        <h5 className="employment-modal-h5">Office Of Employment</h5>
                        <p className="employment-modal-ptag"> {selectedEmployee?.officeOfEmployment} </p>
                      </div>
                      <div className="col-lg-4">
                        <h5 className="employment-modal-h5">Job Title</h5>
                        <p className="employment-modal-ptag"> {selectedEmployee?.jobTitle} </p>
                      </div>
                      <div className="col-lg-4">
                        <h5 className="employment-modal-h5">Department</h5>
                        <p className="employment-modal-ptag"> {selectedEmployee?.department?.name} </p>
                      </div>
                      <div className="col-lg-4">
                        <h5 className="employment-modal-h5 mt-3">Employment Type</h5>
                        <p className="employment-modal-ptag"> {selectedEmployee?.employmentStatus} </p>
                      </div>
                    </div>
                  </div>
                  </section>
                </>
              ) : (
                <Loader />
              )}
            </Modal.Body>
          </Modal>
          <EditProfileModal selectedEmployee={selectedEmployee} show={showEditModal} onHide={() => setShowEditModal(false)}/>
        </div>
        <div className="employee-table-pagination-wrapper row justify-content-between align-items-center">
          <div className="col-lg-6 mt-3 d-flex justify-content-between ">
            <p>10 Entries per page</p>
            <p>
              Page {page} of {totalPages}
            </p>
          </div>
          <div className="col-lg-4 d-flex gap-5">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`w-50 ${page === 1 && "disbale"}`}
              role={` ${page === 1 ? "" : "button"}`}
            >
              {" "}
              <span className="me-2 ">
                <img src={chevronLeft} alt="" />
              </span>{" "}
              Prev
            </button>
            <button
              role={` ${page === totalPages ? "" : "button"}`}
              onClick={handleNext}
              disabled={page === totalPages}
              className={`w-50 ${page === totalPages && "disbale"}`}
            >
              Next{" "}
              <span className="ms-2">
                <img src={chevronRight} alt="" />
              </span>{" "}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default EmployeeTable;
