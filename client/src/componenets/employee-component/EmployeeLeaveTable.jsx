import React, { useEffect, useState } from 'react';
import Table from "react-bootstrap/Table";
import { employeeLeaveHistory } from '../../db';
import "../../styles/EmployeeLeaveTable.css"
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
const EmployeeLeaveTable = () => {
  const {leave} = useAuth()

  return (
    <>
 <main className="employee-leave-table-wrapper employee-table-container mt-4">
        <div className="employee-leave-table">
          <Table responsive="sm" hover role="button">
            <thead className="employee-leave-table-wrapper-head">
              <tr>
                <th>
                  {" "}
                  <h5 className="employee-leave-table-wrapper-h5">Leave Type</h5>{" "}
                </th>
                <th>
                  <h5 className="employee-leave-table-wrapper-h5">Start Date</h5>{" "}
                </th>
                <th>
                  <h5 className="employee-leave-table-wrapper-h5">End Date</h5>{" "}
                </th>
                <th>
                  <h5 className="employee-leave-table-wrapper-h5">Days</h5>{" "}
                </th>
                <th>
                  <h5 className="employee-leave-table-wrapper-h5">Status</h5>{" "}
                </th>
              </tr>
            </thead>
            {leave.map((employee) => {
              return (
                <tbody key={employee.id} className="employee-leave-table-body">
                  <tr>
                    <td>
                      <div className="d-flex gap-2 align-items-center ">
                    
                        <h6
                          id="employee-table-name"
                          className="employee-leave-table-data pt-1"
                        >
                          {employee.leaveType} Leave
                        </h6>
                      </div>
                    </td>
                    <td>
                      <p
                        id="employee-leave-table-email"
                        className="employee-table-data"
                      >
                        {" "}
                        {employee.startDate.slice(0,10)}{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        id="employee-leave-table-team"
                        className="employee-leave-table-data"
                      >
                        {" "}
                        {employee?.endDate.slice(0,10)}{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        id="employee-leave-table-supervisor"
                        className="employee-leave-table-data"
                      >
                        {" "}
                        {employee?.Days} Days
                      </p>
                    </td>
                    <td>
                      <p
                        className={`${
                          employee.status === "pending"
                            ? "employee-leave-table-orange"
                            : employee.status === "appproved"
                            ? "employee-leave-table-green"
                            : "employee-leave-table-blue"
                        }`}
                      >
                        {" "}
                        {employee.status}{" "}
                      </p>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </Table>
         
        </div>
      </main>    </>
  )
}

export default EmployeeLeaveTable