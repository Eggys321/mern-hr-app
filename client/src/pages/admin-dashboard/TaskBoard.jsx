import React,{useState, useEffect} from "react";
import "../../styles/TaskBoard.css";
import plusSign from "../../assets/plus.svg";
import TaskTable from "../../componenets/TaskTable";
import NewTaskModal from "../../componenets/NewTaskModal";
import inProgressLogo from "../../assets/in-progress-logo.svg";
import completedLogo from "../../assets/completed-logo.svg";
import plannedLogo from "../../assets/planned-logo.svg";
import apiClient from "../../utils/apiClient";

const STATUS_CARDS = [
  { id: 1, title: "In Progress", status: "In progress", img: inProgressLogo },
  { id: 2, title: "Completed", status: "Completed", img: completedLogo },
  { id: 3, title: "Planned", status: "Planned", img: plannedLogo },
];

const TaskBoard = () => {
  const [modalShow, setModalShow] = useState(false);
  const [counts, setCounts] = useState({});

  const fetchCounts = async () => {
    try {
      const res = await apiClient.get("/api/task");
      const tasks = res.data.tasks || [];
      const byStatus = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
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
      <main className="pt-5 task-board-wrapper">
        <section className="task-board-section-1 pt-1 ">
          <div className="d-md-flex justify-content-between align-items-center">
            <div>
              <h2 className="task-board-section-1-header">Taskboard</h2>
              <h5>Dashboard/Taskboard</h5>
            </div>
            <div>
              <button className="" onClick={() => setModalShow(true)}>
                <img src={plusSign} alt="plus-sign-logo" />
                <span className="ps-1">New Task</span>
              </button>
            </div>
          </div>
          <div className="task-board-section-1-div  pt-5">
            {STATUS_CARDS.map(({ id, title, status, img }) => (
              <div className="task-board-wrapper" key={id}>
                <div className="task-board-wrapper-inner d-flex justify-content-between">
                  <div className="">
                    <h5> {title} </h5>
                    <h1> {counts[status] || 0} </h1>
                  </div>
                  <img src={img} alt="task-img" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
          <NewTaskModal show={modalShow} onHide={() => { setModalShow(false); fetchCounts(); }} />

        </section>
        <section>
          <TaskTable/>
        </section>
      </main>
    </>
  );
};

export default TaskBoard;
