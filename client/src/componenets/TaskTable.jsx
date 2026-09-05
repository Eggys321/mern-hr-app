import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "../styles/TaskTable.css";
import { Loader } from "../utils/Loader";
import apiClient from "../utils/apiClient";
import Modal from 'react-bootstrap/Modal';
import ConfirmModal from "./ConfirmModal";
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
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const {getCounts} = useAuth()

  const getTasks = async()=>{
    try {
      setIsLoading(true)
      setError(null);

      const req = await apiClient.get("/api/task")
      setData(req.data.tasks)
    } catch (error) {
      setError('Error fetching tasks');
    }finally{
      setIsLoading(false)
    }
  }

  const getTaskById = async (id)=>{
    try {
      setIsLoading(true);
      setError(null);
      const req = await apiClient.get(`/api/task/${id}`)
      setSelectedTask(req.data.task);
      setShowModal(true);

    } catch (error) {
      toast.error("Failed to load task details");
    }finally {
      setIsLoading(false);
    }
  }
  const confirmDeleteTask = async()=>{
    if (!taskPendingDelete) return;
    setIsDeleting(true);
    try {
      const req = await apiClient.delete(`/api/task/${taskPendingDelete}`)
      if (req.data.success){
       toast.success(req.data.message)
      }
      setData(data.filter((existingDatum) => existingDatum._id !== taskPendingDelete));
      getCounts()
    } catch (error) {
      toast.error(error.response?.data?.errMsg || "Failed to delete task");
    } finally {
      setIsDeleting(false);
      setTaskPendingDelete(null);
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
        {data.length === 0 ? (
          <p className="text-muted py-4">No tasks yet. Create one with "New Task" above.</p>
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
                <h5 className="task-table-wrapper-h5">Status</h5>
              </th>
              <th>
                <h5 className="task-table-wrapper-h5">Action </h5>
              </th>
            </tr>
          </thead>
          {data?.map((task) => {
            return (
              <tbody key={task?._id} className="task-table-body">

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
                  <td className="d-flex gap-2">
                  <p className="text-success" role="button" onClick={() => getTaskById(task._id)}>
                  <MdGridView fontSize={22}/>

                  </p>
                  <p className="text-danger" role="button" onClick={()=>setTaskPendingDelete(task._id)}><MdDelete  fontSize={22} />
                  </p>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </Table>
        )}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered       size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="modal-header ps-0">Task Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="container modal-wrapper">
            {selectedTask ? (
              <>
              <div className="row">

                <p className="col-lg-6 modal-wrapper-title">Task Name: <span className="modal-wrapper-value">{selectedTask.title} </span> </p>
                <div className="col-lg-6">
                <div className="d-flex gap-2">

                <p className=" modal-wrapper-title">Team: </p>
                {selectedTask.assignedMembers.map((img)=>{
                  return(
                    <div className="task-profile-img" key={img?._id || img?.profileImage}>
                <img src={img?.profileImage} alt="" className="" />
                    </div>
                  )
                })}
                </div>
              </div>
                </div>
                <div className="row">

                <p className="col-lg-6 modal-wrapper-title">Start Date: <span className="modal-wrapper-value">{selectedTask.startDate.slice(0, 10)} </span> </p>
                <p className="col-lg-6 modal-wrapper-title">End Date: <span className="modal-wrapper-value">{selectedTask.endDate.slice(0, 10)} </span> </p>
                </div>
                <div className="row">

                <p className="col-lg-6 modal-wrapper-title">Description: <span className="modal-wrapper-value">{selectedTask?.description} </span> </p>
                <p className="col-lg-6 modal-wrapper-title">Status: <span className="modal-wrapper-status">{selectedTask.status}</span></p>
                </div>
              </>
            ) : (
              <Loader />
            )}
          </Modal.Body>
        </Modal>
        <ConfirmModal
          show={!!taskPendingDelete}
          title="Delete this task?"
          message="This can't be undone. The task will be permanently removed."
          confirmText="Delete Task"
          onConfirm={confirmDeleteTask}
          onCancel={() => setTaskPendingDelete(null)}
          isConfirming={isDeleting}
        />
      </div>
    </main>
  );
};

export default TaskTable;
