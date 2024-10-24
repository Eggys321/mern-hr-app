import React from "react";
import { departments } from "../../db";
import "../../styles/Teams.css";
import {Link} from "react-router-dom";
import arrowRightImg from "../../assets/arrow-right-dept.svg"

const Teams = () => {
  console.log(departments);

  return (
    <>
      <main className="teams-wrapper">
        <div className="container-fluid teams-wrapper-div">
          <div className="row justify-content-between gap-5">
            {departments?.map((dept) => {
              return (
                <div className="col-lg-5  border p-3 teams-wrapper-map" >
                  <div className="d-flex justify-content-between align-items-center border-bottom border-1">
                    <div>
                      <h4> {dept?.name} Department </h4>
                      <p> {dept?.employees?.length} Members</p>
                    </div>
                    <Link>View All</Link>
                  </div>
                  <div>
                    <div className="teams-wrapper-employees">
                      {dept?.employees.map((employee) => {
                        return (
                          <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center gap-2 my-2">
                              <div className="teams-wrapper-employees-profile-pic">
                                <img src={employee?.img} alt="" className=""/>
                              </div>
                              <div className="d-flex flex-column">
                                <span className="teams-wrapper-employees-span-1"> {employee?.name}</span>
                                <span className="teams-wrapper-employees-span-2"> {employee?.position} </span>
                              </div>
                            </div>
                            <img className="teams-wrapper-employees-arrow-right" src={arrowRightImg} alt="arrow-right-img" />
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
      </main>
    </>
  );
};

export default Teams;
