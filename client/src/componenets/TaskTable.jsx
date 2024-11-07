import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { taskBoardTableData } from "../db";
import "../styles/TaskTable.css";
import axios from "axios";
import { Loader } from "../utils/Loader";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext";
import { MdGridView } from "react-icons/md";
import { MdDelete } from "react-icons/md";



const TaskTable = () => {
  const [data,setData] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const {getCounts} = useAuth()

  const token = localStorage.getItem("hr-token");

  const getTasks = async()=>{
    try {
      setIsLoading(true)
      setError(null); 

      const req = await axios.get("https://mern-hr-app.onrender.com/api/task",{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      })
      console.log(req.data.tasks);
      setData(req.data.tasks)
    } catch (error) {
      setError('Error fetching tasks');
      console.error(error);
    }finally{
      setIsLoading(false)
    }
  }

  const getTaskById = async (id)=>{
    try {
      setIsLoading(true);
      setError(null);
      const req = await axios.get(`https://mern-hr-app.onrender.com/api/task/${id}`,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      })
      setSelectedTask(req.data.task);
      setShowModal(true);
      console.log(req.data.task);
   
    } catch (error) {
    
    }finally {
      setIsLoading(false);
    }
  }
  const deleteTask = async(id)=>{
    try {
      setIsLoading(true);
      setError(null);
      const req = await axios.delete(`https://mern-hr-app.onrender.com/api/task/${id}`,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      })
    
      console.log(req);
      if (req.data.success){
       toast.success(req.data.message) 
      }
      setData(data.filter((existingDatum) => existingDatum._id !== id));
      getCounts()
   
    } catch (error) {
    
    }finally {
      setIsLoading(false);
    }
  }
  useEffect(()=>{
    getTasks()
  },[])
  if (isLoading) {
    return <div className="vh-100 d-flex justify-content-center"> <Loader/> </div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  return (
    <main className="my-5 task-table-wrapper task-table-container">
      <h1 className="pb-4">Taskboard</h1>
      <div className="task-table">
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
          {data?.map((task) => {
            return (
              <tbody key={task?._id} className="task-table-body">
                
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
                      Start: {task?.startDate.slice(0,10)}
                    </h6>
                    <h6 id="task-table-body-end">End: {task?.endDate.slice(0,10)}</h6>
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

                  <p className="text-success" role="button" onClick={() => getTaskById(task._id)}>
                  <MdGridView fontSize={22}/>

                  </p>
                  <p className="text-danger" role="button" onClick={()=>deleteTask(task._id)}><MdDelete  fontSize={22} />
                  </p>
                  </div>
                </tr>
              </tbody>
            );
          })}
        </Table>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered       size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Task Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTask ? (
              <>
                <p><strong>Title:</strong> {selectedTask.title}</p>
                <p><strong>Status:</strong> {selectedTask.status}</p>
                {/* <p><strong>Assigned Members:</strong> {selectedTask.assignedMembers.map(member => `${member.firstName} ${member.lastName}`).join(', ')}</p> */}
                
                <p><strong>Start Date:</strong> {selectedTask.startDate.slice(0, 10)}</p>
                <p><strong>End Date:</strong> {selectedTask.endDate.slice(0, 10)}</p>
                {selectedTask.assignedMembers.map((img)=>{
                  return(
                    <div className="task-profile-img">
                  <img src={img?.profileImage} alt="" className="" />
                    </div>
                  )
                })}
              </>
            ) : (
              <Loader />
            )}
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
      </div>
    </main>
  );
};

export default TaskTable;
