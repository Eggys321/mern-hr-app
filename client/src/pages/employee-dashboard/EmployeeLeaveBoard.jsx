import React,{useState, useEffect} from "react";
import plusSign from "../../assets/plus.svg";
import { Link } from "react-router-dom";
import "../../styles/EmployeeLeaveBoard.css";
import EmployeeLeaveTable from "../../componenets/employee-component/EmployeeLeaveTable";
import LeaveModal from "../../componenets/employee-component/LeaveModal";
import annualLeave from "../../assets/annual leave.jpeg";
import sickLeave from "../../assets/sickleave.jpg";
import casualLeave from "../../assets/casual leave.png";
import apiClient from "../../utils/apiClient";

const STATUS_CARDS = [
  { id: 1, title: "Pending Requests", status: "pending", img: annualLeave },
  { id: 2, title: "Approved Requests", status: "approved", img: sickLeave },
  { id: 3, title: "Declined Requests", status: "declined", img: casualLeave },
];

const EmployeeLeaveBoard = () => {
  const [modalShow, setModalShow] = useState(false);
  const [counts, setCounts] = useState({});

  const fetchCounts = async () => {
    try {
      const res = await apiClient.get("/api/leave/employee/leaves");
      const leaves = Array.isArray(res.data) ? res.data : [];
      const byStatus = leaves.reduce((acc, leave) => {
        acc[leave.status] = (acc[leave.status] || 0) + 1;
        return acc;
      }, {});
      setCounts(byStatus);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <>
      <main className="pt-5  employee-leave-board-wrapper">
        <section className=" employee-leave-board-section-1 pt-1 ">
          <div className="d-flex justify-content-between flex-wrap align-items-center">
            <h2 className=" employee-leave-board-section-1-header">
              Leaveboard
            </h2>
            <button onClick={() => setModalShow(true)} className="request-leave-btn d-flex gap-2 justify-content-center align-items-center">
              <img src={plusSign} alt="" />
              <Link className="request-leave-link">Request Leave</Link>
            </button>
          </div>
          <div className="employee-leave-section-1-div justify-content-between align-items-center pt-5">
            {STATUS_CARDS.map(({ id, title, status, img }) => (
              <div className="employee-leave-event-wrapper" key={id}>
                <div className="employee-leave-event-wrapper-inner d-flex justify-content-between align-items-center">
                  <div className="text-center">
                    <h5> {title} </h5>
                    <h1> {counts[status] || 0} </h1>
                  </div>
                  <div>
                    <img src={img} alt="" />
                  </div>
                </div>
              </div>
            ))}

          </div>
          <LeaveModal show={modalShow} onHide={() => { setModalShow(false); fetchCounts(); }} />
        </section>
        <section className="employee-leave-board-section-2">
                        <h2 className="py-4">Leave History</h2>
          <EmployeeLeaveTable/>
        </section>
      </main>
    </>
  );
};

export default EmployeeLeaveBoard;
