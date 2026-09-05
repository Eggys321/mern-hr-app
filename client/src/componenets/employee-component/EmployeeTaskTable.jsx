import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from "react-bootstrap/Table";
import { MdGridView } from "react-icons/md";
import apiClient from "../../utils/apiClient";
import "../../styles/TaskTable.css"

const EmployeeTaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await apiClient.get("/api/task/tasks/assigned");
        setTasks(response.data.tasks);
      } catch (err) {
        if (err.response?.status === 404) {
          setTasks([]);
        } else {
          setError(err.response?.data?.errMsg || 'An error occurred while fetching tasks.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTasks();
  }, []);
  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <main className="my-5 task-table-wrapper task-table-container">
      <h1 className="pb-4">Taskboards</h1>
     <div>
     {tasks.length === 0 ? (
       <p className="text-muted py-4">No tasks assigned to you yet.</p>
     ) : (
     <Table role="button"  responsive>
          <thead className="task-table-wrapper-head">
            <tr>

              <th>
                <h5 className="task-table-wrapper-h5"> Task </h5>
              </th>
              <th>
                <h5 className="task-table-wrapper-h5">Team</h5>
              </th>
              <th>
                <h5 className="task-table-wrapper-h5">Duration</h5>
              </th>
              <th>
                <h5 className="task-table-wrapper-h5">Action</h5>
              </th>
            </tr>
          </thead>
          {tasks?.map((task) => {
            return (
              <tbody key={task._id} className="task-table-body">

                <tr>

                  <td>
                    <h6 className="task-table-title pt-1">{task?.title}</h6>
                  </td>
                  <td>
                    <div className="d-flex">

                      {task?.assignedMembers.slice(0,2).map((img)=>{
                        return(
                          <div key={img?._id}>
                            <div className="task-profile-img">

                            <img src={img?.profileImage} alt=""   />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </td>
                  <td className="d-flex flex-column">
                    <h6 id="task-table-body-start">
                      Start:  {new Date(task.startDate).toLocaleDateString()}
                    </h6>
                    <h6 id="task-table-body-end">End: {new Date(task.endDate).toLocaleDateString()}</h6>
                  </td>
                  <td>
                    <p
                      className={`${
                        task.status === "Planned"
                          ? "task-table-ation-orange"
                          : task.status === "Completed"
                          ? "task-table-ation-green"
                          : "task-table-ation-blue"
                      }`}
                    >
                      {task?.status}
                    </p>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <p className="text-success" role="button" > <MdGridView fontSize={30}/></p>
                    </div>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </Table>
     )}
     </div>
    </main>
    </>
  );
}

export default EmployeeTaskBoard
