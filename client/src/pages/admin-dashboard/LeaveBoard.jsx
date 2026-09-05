import React,{useState, useEffect} from "react";
import "../../styles/LeaveBoard.css";
import LeaveTable from "../../componenets/LeaveTable";
import plusSign from "../../assets/plus.svg";
import { Link } from "react-router-dom";
import LeaveModal from "../../componenets/employee-component/LeaveModal";
import generalLeaveLogo from "../../assets/general leave logo.webp";
import apiClient from "../../utils/apiClient";

const STATUS_CARDS = [
  { id: 1, title: "Pending", status: "pending" },
  { id: 2, title: "Approved", status: "approved" },
  { id: 3, title: "Declined", status: "declined" },
];

const LeaveBoard = () => {
  const [modalShow, setModalShow] = useState(false);
  const [counts, setCounts] = useState({});

  const fetchCounts = async () => {
    try {
      const res = await apiClient.get("/api/leave/all-leaves");
      const leaves = res.data.formattedLeaves || [];
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
      <main className="pt-5 leave-board-wrapper">
        <section className="leave-board-section-1 pt-1">
          <div className="d-md-flex justify-content-between align-items-center">
            <div>
              <h2 className="task-board-section-1-header">Leaveboard</h2>
              <h5>Dashboard/Leaveboard</h5>
            </div>
            <button onClick={() => setModalShow(true)}  className="request-leave-btn d-flex gap-2 justify-content-center align-items-center">
              <img src={plusSign} alt="" />
              <Link className="request-leave-link">Request Leave</Link>
            </button>
          </div>
          <div className="leave-board-section-1-div  pt-5">
            {STATUS_CARDS.map(({ id, title, status }) => (
              <div className="leave-board-wrapper" key={id}>
                <div className="leave-board-wrapper-inner d-flex justify-content-center">
                  <div className="text-center d-flex gap-5 align-items-center">
                    <div>
                      <h5>{title} </h5>
                      <h1> {counts[status] || 0} </h1>
                    </div>
                    <div>
                      <img src={generalLeaveLogo} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <LeaveModal show={modalShow} onHide={() => { setModalShow(false); fetchCounts(); }} />

        </section>
        <section>
          <LeaveTable />
        </section>
      </main>
    </>
  );
};

export default LeaveBoard;
