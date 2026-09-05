import React, { useEffect, useState } from 'react';
import Table from "react-bootstrap/Table";
import "../../styles/EmployeeLeaveTable.css"
import apiClient from "../../utils/apiClient";
import { Loader } from '../../utils/Loader';
const EmployeeLeaveTable = () => {
  const [leave,setLeave] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const getLeaveHistory = async()=>{
      try {
        setLoading(true);
        const req = await apiClient.get("/api/leave/employee/leaves")
        setLeave(req.data)
      } catch (error) {}finally{
        setLoading(false);

      }
    }
    getLeaveHistory()
  },[])
  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <Loader />
      </div>
    );
  return (
    <>
 <main className="employee-leave-table-wrapper employee-table-container mt-4">
        <div className="employee-leave-table">
          {leave.length === 0 ? (
            <p className="text-muted py-4">You haven't applied for any leave yet.</p>
          ) : (
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
            {leave.map((employee, index) => {
              return (
                <tbody key={employee._id || index} className="employee-leave-table-body">
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
                            : employee.status === "approved"
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
          )}
        </div>
      </main>    </>
  )
}

export default EmployeeLeaveTable
