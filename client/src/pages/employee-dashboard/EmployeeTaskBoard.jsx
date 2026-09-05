import React, { useEffect, useState } from 'react';
import "../../styles/EmployeeTaskBoard.css";
import EmployeeTaskTable from '../../componenets/employee-component/EmployeeTaskTable';
import plannedTasks from "../../assets/planned-tasks.svg";
import inProgress from "../../assets/in-progress.svg";
import totalTasksImg from "../../assets/allTasks.svg";
import apiClient from "../../utils/apiClient";

const STATUS_CARDS = [
  { id: 1, title: "Planned Tasks", status: "Planned", img: plannedTasks },
  { id: 2, title: "In Progress", status: "In progress", img: inProgress },
  { id: 3, title: "Completed Tasks", status: "Completed", img: totalTasksImg },
];

const EmployeeTaskBoard = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await apiClient.get("/api/task/tasks/assigned");
        const tasks = res.data.tasks || [];
        const byStatus = tasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {});
        setCounts(byStatus);
      } catch (error) {}
    };
    fetchCounts();
  }, []);

  return (
    <>
      <main className="pt-5  employee-task-board-wrapper">
        <section className=" employee-task-board-section-1 pt-1 ">
          <div className="d-md-flex justify-content-between align-items-center">
            <div>
              <h2 className=" employee-task-board-section-1-header">Taskboard</h2>
            </div>
          </div>
          <div className="employee-task-section-1-div justify-content-between align-items-center pt-5">
            {STATUS_CARDS.map(({ id, title, status, img }) => (
              <div className="employee-task-event-wrapper" key={id}>
                <div className="employee-task-event-wrapper-inner d-flex justify-content-between align-items-center">
                  <div>
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

        </section>
        <section>
          <EmployeeTaskTable/>
        </section>
      </main>
    </>
  )
}

export default EmployeeTaskBoard
