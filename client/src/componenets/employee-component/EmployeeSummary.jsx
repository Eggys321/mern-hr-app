import React, { useEffect, useState } from "react";
import "../../styles/EMployeeSummary.css";
import plusSign from "../../assets/plus.svg";
import { Link } from "react-router-dom";
import EmployeeRecentTable from "./EmployeeRecentTable";
import plannedTasks from "../../assets/planned-tasks.svg";
import inProgress from "../../assets/in-progress.svg";
import remainingLeaves from "../../assets/remaining-leaves.svg";
import apiClient from "../../utils/apiClient";

const EmployeeSummary = () => {
  const [counts, setCounts] = useState({ planned: 0, inProgress: 0, pendingLeaves: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [tasksRes, leavesRes] = await Promise.allSettled([
        apiClient.get("/api/task/tasks/assigned"),
        apiClient.get("/api/leave/employee/leaves"),
      ]);

      const tasks = tasksRes.status === "fulfilled" ? tasksRes.value.data.tasks || [] : [];
      const leaves = leavesRes.status === "fulfilled" && Array.isArray(leavesRes.value.data)
        ? leavesRes.value.data
        : [];

      setCounts({
        planned: tasks.filter((t) => t.status === "Planned").length,
        inProgress: tasks.filter((t) => t.status === "In progress").length,
        pendingLeaves: leaves.filter((l) => l.status === "pending").length,
      });
    };
    fetchCounts();
  }, []);

  const cards = [
    { id: 1, title: "Planned Tasks", count: counts.planned, img: plannedTasks },
    { id: 2, title: "In Progress", count: counts.inProgress, img: inProgress },
    { id: 3, title: "Pending Leaves", count: counts.pendingLeaves, img: remainingLeaves },
  ];

  return (
    <>
      <main className="pt-5 employee-summary-wrapper">
        <section className="employee-summary-section-1 pt-1 ">
          <div className="d-flex justify-content-between flex-wrap align-items-center">

          <h1 className="employee-summary-section-1-header">Dashboard</h1>
          <button className="request-leave-btn d-flex gap-2 justify-content-center align-items-center">
            <img src={plusSign} alt="" />
            <Link  className="request-leave-link">
              Request Leave
            </Link>
          </button>
          </div>
          <div className="employee-summary-section-1-div justify-content-between align-items-center pt-5">
            {cards.map(({ id, title, count, img }) => (
              <div className="employee-summary-event-wrapper" key={id}>
                <div className="employee-summary-event-wrapper-inner d-flex justify-content-between align-items-center">
                  <div className="">
                    <h5> {title} </h5>
                    <h1> {count} </h1>
                  </div>
                  <div>
                    <img src={img} alt="" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <EmployeeRecentTable/>
        </section>
      </main>
    </>
  );
};

export default EmployeeSummary;
