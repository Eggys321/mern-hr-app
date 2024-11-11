import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { allLeaveList } from "../db";
import "../styles/LeaveTable.css";
import axios from "axios";
import "../styles/EmployeeTable.css";
import { Loader } from "../utils/Loader";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import MyButton from "./MyButton";
import toast from "react-hot-toast";

const LeaveTable = ({ Name, Email, Team, Supervisor, Status }) => {
  const [data, setData] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("hr-token");
  const getLeaveById = async (leaveId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://mern-hr-app.onrender.com/api/leave/${leaveId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedLeave(response.data);
      setShowModal(true);
    } catch (error) {
      setError("Error fetching leave details");
    } finally {
      setLoading(false);
    }
  };
  const fetchLeave = async () => {
    try {
      setLoading(true);
      const req = await axios.get(
        "https://mern-hr-app.onrender.com/api/leave/all-leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(req.data);

      setData(req.data.formattedLeaves);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (leaveId) => {
      if (!leaveId) {
      console.error("No leaveId provided");
      setError("No leave ID provided.");
      return;
    }
    try {
      const req = await fetch(
        `https://mern-hr-app.onrender.com/api/leave/${leaveId}/approve`,
        
        {
          method:"PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":"application/json"
          },
        }
      );
      const res = await req.json();
      if(res.success){
        toast.success(res.message)
        fetchLeave()
        setShowModal(false);

      }
    } catch (error) {}
  };
  const declineLeave = async (leaveId) => {
   
    try {
      const req = await fetch(
        `https://mern-hr-app.onrender.com/api/leave/${leaveId}/decline`,
        
        {
          method:"PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":"application/json"
          },
        }
      );
      const res = await req.json();
      if(res.success){
        toast.success(res.message)
        fetchLeave()
        setShowModal(false);

      }
    } catch (error) {}
  };
    useEffect(() => {
  
    fetchLeave();
  }, []);
  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <Loader />
      </div>
    );
  const handleRowClick = (leaveId) => {
    if (!leaveId) {
      return;
    }
    getLeaveById(leaveId);
    
  };
  return (
    <>
      <main className="leave-table-wrapper leave-table-container my-5 w-100">
        <div className="leave-table">
          <Table responsive hover role="button">
            <thead className="leave-table-wrapper-head">
              <tr>
                <th>
                  <h5 className="leave-table-wrapper-h5">Name</h5>{" "}
                </th>
                <th className="">
                  <h5 className="leave-table-wrapper-h5 leave-tabel-sm">
                    Leave Type
                  </h5>{" "}
                </th>
                <th>
                  <h5 className="leave-table-wrapper-h5">Duration</h5>{" "}
                </th>
                <th>
                  <h5 className="leave-table-wrapper-h5">Days</h5>{" "}
                </th>
                <th>
                  <h5 className="leave-table-wrapper-h5">Status</h5>{" "}
                </th>
              </tr>
            </thead>
            {data?.map((leave) => {
              return (
                <tbody key={leave?._id} className="leave-table-body">
                  <tr onClick={() => handleRowClick(leave?._id)}>
                    <td>
                      <div className="d-flex gap-2 align-items-center ">
                        <div className="employee-profile-image">
                          <img src={leave?.profileImage} alt="" className="" />
                        </div>
                        <h6
                          id="leave-table-name"
                          className="employee-table-data pt-1"
                        >
                          {" "}
                          {leave?.fullName}{" "}
                        </h6>
                      </div>
                    </td>
                    <td>
                      <p
                        id="employee-table-email"
                        className="employee-table-data"
                      >
                        {" "}
                        {leave?.leaveType} Leave
                      </p>
                    </td>
                    <td className="d-flex flex-column">
                      <h6 id="leave-table-body-start">
                        Start: {leave?.startDate.slice(0, 10)}
                      </h6>
                      <h6 id="leave-table-body-end">
                        End: {leave?.endDate.slice(0, 10)}
                      </h6>
                    </td>
                    <td>
                      <p
                        id="employee-table-supervisor"
                        className="employee-table-data"
                      >
                        {" "}
                        {leave?.Days} Days
                      </p>
                    </td>
                    <td>
                      <p
                        className={`${
                          leave.status === "pending"
                            ? "leave-table-orange"
                            : leave.status === "approved"
                            ? "leave-table-green"
                            : "leave-table-red"
                        }`}
                      >
                        {" "}
                        {leave?.status}{" "}
                      </p>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </Table>
          {/* Modal for Leave Details */}
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Leave Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {loading ? (
                <Loader />
              ) : selectedLeave ? (
                <>
                  <p>
                    <strong>Name:</strong> {selectedLeave.employee.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedLeave.employee.email}
                  </p>
                  <p>
                    <strong>Leave Type:</strong> {selectedLeave.leaveType}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {selectedLeave.startDate.slice(0, 10)}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {selectedLeave.endDate.slice(0, 10)}
                  </p>
                  <p>
                    <strong>Duration:</strong> {selectedLeave.duration} Days
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedLeave.description}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedLeave.status}
                  </p>
                { <p>
                  <strong>  {selectedLeave?.status === "declined" ? "Declined by" : selectedLeave?.status === "approved" ? "Approved by" : ""} </strong> {selectedLeave?.status === "pending" ? " " : ": " + selectedLeave.approvedBy}
                </p>}
                  <div className="employee-profile-image">
                    <img
                      className="img-fluid rounded-5"
                      src={selectedLeave?.employee?.profileImage}
                      alt=""
                    />
                  </div>
                  <div className="container row">
                    <div className="mt-4 col-lg-12 ps-0 gap-3 d-flex flex-column-reverse flex-md-row gap-1 w-100">
                      {selectedLeave.status === "pending" && (

                        <>
                        <MyButton
                          onClick={() =>
                            approveLeave(selectedLeave?.leaveId)
                          }
                          variant="primary"
                          className="save-and-continue-btn"
                          text="Approve"
                          // disabled={isSubmitting}
                        />
                        <MyButton
                          onClick={() =>
                            declineLeave(selectedLeave?.leaveId)
                          }
                          variant="outline-danger"
                          text="Decline"
                          className="cancel-btn mb-3"
                          type="submit"
                          // disabled={isSubmitting}
                        />
                        
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p>No leave details available.</p>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </>
  );
};

export default LeaveTable;
