import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from "react-bootstrap/Table";
import { employeetaskBoardTableData } from '../../db';
import { MdGridView } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import "../../styles/TaskTable.css"

const EmployeeTaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem("hr-token");

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await axios.get('https://mern-hr-app.onrender.com/api/task/tasks/assigned', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(response.data.tasks);
        // console.log(response.data.tasks);
        
      } catch (err) {
        setError(err.response?.data?.errMsg || 'An error occurred while fetching tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTasks();
  }, [token]);
  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;
  return (
    <>
      <main className="my-5 task-table-wrapper task-table-container">
      <h1 className="pb-4">Taskboards</h1>
     <div>
     <Table role="button"  responsive>
          <thead className="task-table-wrapper-head">
            <tr>
              {/* <th>
                <h5 className="task-table-wrapper-h5"># </h5>
              </th> */}
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
                  {/* <td>
                    <input
                      type="checkbox"
                      className="task-table-body-check-box"
                      role="button"
                    />
                  </td> */}
                  <td>
                    <h6 className="task-table-title pt-1">{task?.title}</h6>
                  </td>
                  <td>
                    <div className="d-flex">
                      {/* <img src={task.teamPhoto.teamPhoto1} alt="" />
                      <img src={task.teamPhoto.teamPhoto2} alt="" />
                      <img src={task.teamPhoto.teamPhoto3} alt="" />
                      <img src={task.teamPhoto.teamPhoto4} alt="" /> */}
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
                  <div className="d-flex gap-2">

                  <p className="text-success" role="button" > <MdGridView fontSize={30}/></p>
                  {/* <p className="text-danger" role="button"><MdDelete  fontSize={30} /></p> */}
                  </div>
                </tr>
              </tbody>
            );
          })}
        </Table>
     </div>
    </main>
    </>
  )
}

export default EmployeeTaskBoard