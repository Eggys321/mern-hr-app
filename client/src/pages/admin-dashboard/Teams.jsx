import React, { useEffect, useState } from "react";
import { departments } from "../../db";
import "../../styles/Teams.css";
import { Link } from "react-router-dom";
import arrowRightImg from "../../assets/arrow-right-dept.svg";
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { Loader } from "../../utils/Loader";
const Teams = () => {
  const [dept, setDept] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading,setIsLoading] = useState(false)
  const token = localStorage.getItem("hr-token");
  const getDepts = async () => {
    try {
      setIsLoading(true)
      const req = await axios.get(
        "https://mern-hr-app.onrender.com/api/department/all-departments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDept(req.data.departments);
    } catch (error) {
    }finally{
      setIsLoading(false)
    }
  };

  // signle dept
  const getDeptById = async (id) => {

    try {
      setIsLoading(true)
      const res = await axios.get(`https://mern-hr-app.onrender.com/api/department/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedDept(res.data.department);
      setShowModal(true); 
      
    } catch (error) {
    }finally{
      setIsLoading(false)
    }
  };


  useEffect(() => {
    getDepts();
  }, []);
  if (isLoading)
    return (
      <div className="d-flex justify-content-center">
        <Loader />
      </div>
    );
  return (
    <>
      <main className="teams-wrapper">
        <div className="container-fluid teams-wrapper-div">
          <div className=" x row justify-content-between gap-5">
            {dept?.map((dept) => {
              return (
                <div key={dept?._id} className="col-lg-5  border p-3 teams-wrapper-map">
                  <div className="d-flex justify-content-between align-items-center border-bottom border-1">
                    <div>
                      <h4> {dept?.name} Department </h4>
                      <p> {dept?.members?.length} Members</p>
                    </div>
                    <Link onClick={() => getDeptById(dept._id)}>View All</Link>
                  </div>
                  {dept.manager && (
                    <div className="manager-info d-flex gap-1 pt-4 ">
                      <div className="teams-wrapper-employees-profile-pic">
                        <img
                          src={dept?.manager?.profileImage}
                          alt={`${dept?.manager?.fullName}'s profile`}
                        />
                      </div>
                      <div>
                        <div className="d-flex flex-column">
                          <span className="teams-wrapper-employees-span-1">{dept?.manager?.fullName}</span>
                          <span className="teams-wrapper-employees-span-2">Manager</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="teams-wrapper-employees">
                      {dept?.members.slice(0,4).map((employee) => {
                        return (
                          <div
                            key={employee?._id}
                            className="d-flex justify-content-between"
                          >
                            <div className="d-flex align-items-center gap-2 my-2">
                              <div className="teams-wrapper-employees-profile-pic">
                                <img
                                  src={employee?.profileImage}
                                  alt=""
                                  className=""
                                />
                              </div>
                              <div className="d-flex flex-column">
                                <span className="teams-wrapper-employees-span-1">
                                  {" "}
                                  {employee?.fullName}
                                </span>
                                <span className="teams-wrapper-employees-span-2">
                                  {" "}
                                  {employee?.jobTitle}{" "}
                                </span>
                              </div>
                            </div>
                            <img
                              className="teams-wrapper-employees-arrow-right"
                              src={arrowRightImg}
                              alt="arrow-right-img"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* modal fro single dept */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered  size="lg">
          <Modal.Header closeButton >
          
            <Modal.Title> 
              <div  className="d-flex justify-content-between gap-5">

              <h6> {selectedDept?.name} Department </h6> <button>Edit</button>
              </div>
              </Modal.Title>
            
          </Modal.Header>
          <Modal.Body>
            
           { selectedDept?.members?.map((depts)=>{
            return(
              <div className="d-flex justify-content-between">
                <div className="teams-wrapper-employees-profile-pic">

                <img src={depts?.profileImage} alt="" />
                </div>
                <h5> {depts?.fullName} </h5>
                <div className="d-flex gap-5">

                <span> {depts?.jobTitle} </span>
                <span> {depts?.status} </span>
                </div>

              </div>
            )
           })}
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
        {/* {selectedDept && (
          <div className={`modal fade ${showModal ? "show" : ""}`} style={{ display: showModal ? "block" : "none" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedDept.name} Department</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="manager-info d-flex align-items-center gap-2">
                    <img
                      src={selectedDept.manager?.profileImage}
                      alt={`${selectedDept.manager?.fullName}'s profile`}
                      className="teams-wrapper-employees-profile-pic"
                    />
                    <div>
                      <p className="m-0"><strong>Manager:</strong> {selectedDept.manager?.fullName}</p>
                    </div>
                  </div>
                  <h6 className="mt-4">Members</h6>
                  {selectedDept.members.length > 0 ? (
                    selectedDept.members.map((member) => (
                      <div key={member._id} className="d-flex align-items-center my-2">
                        <img
                          src={member.profileImage}
                          alt={`${member.fullName}'s profile`}
                          className="teams-wrapper-employees-profile-pic"
                        />
                        <div className="ms-3">
                          <p className="m-0"><strong>{member.fullName}</strong></p>
                          <p className="m-0">{member.jobTitle}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No members in this department.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </main>
    </>
  );
};

export default Teams;
