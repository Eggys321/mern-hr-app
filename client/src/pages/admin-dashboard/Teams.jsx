import React, { useEffect, useState } from "react";
import "../../styles/Teams.css";
import { Link, useNavigate } from "react-router-dom";
import arrowRightImg from "../../assets/arrow-right-dept.svg";
import Modal from 'react-bootstrap/Modal';
import { Loader } from "../../utils/Loader";
import apiClient from "../../utils/apiClient";
const Teams = () => {
  const [dept, setDept] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading,setIsLoading] = useState(false)
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const getDepts = async () => {
    try {
      setIsLoading(true)
      const req = await apiClient.get("/api/department/all-departments");
      setDept(req.data.departments);
    } catch (error) {
      setDept([]);
    }finally{
      setIsLoading(false)
    }
  };

  const searchDepts = async (query) => {
    try {
      setIsLoading(true)
      const req = await apiClient.get(`/api/department/dept/search?query=${encodeURIComponent(query)}`);
      setDept(req.data.departments);
    } catch (error) {
      setDept([]);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setSearchQuery(searchInput.trim()), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const getDeptById = async (id) => {

    try {
      setIsLoading(true)
      const res = await apiClient.get(`/api/department/departments/${id}`);
      setSelectedDept(res.data.department);
      setShowModal(true); 
      
    } catch (error) {
    }finally{
      setIsLoading(false)
    }
  };


  useEffect(() => {
    if (searchQuery) {
      searchDepts(searchQuery);
    } else {
      getDepts();
    }
    window.addEventListener("department-created", getDepts);
    return () => window.removeEventListener("department-created", getDepts);
  }, [searchQuery]);
  return (
    <>
      <main className="teams-wrapper">
        <div className="container-fluid teams-wrapper-div">
          <div className="d-flex justify-content-end mb-3">
            <input
              type="search"
              className="form-control"
              style={{ maxWidth: 280 }}
              placeholder="Search departments..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Loader />
            </div>
          ) : dept.length === 0 ? (
            <p className="text-muted py-4">
              {searchQuery ? `No departments match "${searchQuery}".` : "No departments yet."}
            </p>
          ) : (
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
          )}
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered  size="lg">
          <Modal.Header closeButton >
          
            <Modal.Title>
              <div  className="d-flex justify-content-between gap-5">

              <h6> {selectedDept?.name} Department </h6>
              <button
                onClick={() =>
                  navigate("/admin-dashboard/employees/edit-team", {
                    state: { departmentId: selectedDept?._id },
                  })
                }
              >
                Edit
              </button>
              </div>
              </Modal.Title>
            
          </Modal.Header>
          <Modal.Body>
            
           { selectedDept?.members?.map((depts, index)=>{
            return(
              <div className="d-flex justify-content-between" key={depts?._id || index}>
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
        </Modal>
      </main>
    </>
  );
};

export default Teams;
