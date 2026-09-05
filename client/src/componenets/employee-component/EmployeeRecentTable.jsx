import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from "react-bootstrap/Table";
import { employeeRecentActTableData } from '../../db';
import "../../styles/EmployeeRecentTable.css"
import chevronRight from "../../assets/chevron right.svg";
import chevronLeft from "../../assets/chevron-left.svg"
const EmployeeRecentTable = () => {
  return (
    <>
      <main className="my-5 employee-recent-activity-table-wrapper employee-recent-activity-table-container">
       <h1 className="pb-4">Recent Activities</h1>
       <div className="employee-recent-activity-table">
         <Table role="button" hover  responsive>
           <thead className="employee-recent-activity-table-wrapper-head">
             <tr>
               <th>
                 <h5 className="employee-recent-activity-table-wrapper-h5"># </h5>
               </th>
               <th>
                 <h5 className="employee-recent-activity-table-wrapper-h5"> Activity </h5>
               </th>
               <th>
                 <h5 className="employee-recent-activity-table-wrapper-h5">Description</h5>
               </th>
               <th>
                 <h5 className="employee-recent-activity-table-wrapper-h5">Date</h5>
               </th>
               <th>
                 <h5 className="employee-recent-activity-table-wrapper-h5">Status</h5>
               </th>
             </tr>
           </thead>
           {employeeRecentActTableData.map((task) => {
             return (
               <tbody key={task.id} className="employee-recent-activity-table-body">

                 <tr>
                   <td>
                     <input
                       type="checkbox"
                       className="employee-recent-activity-table-body-check-box"
                       role="button"
                     />
                   </td>
                   <td>
                     <h6 className="employee-recent-activity-table-title pt-1">{task?.activity}</h6>
                   </td>
                   <td>
                     <div>
                         <h6>{task?.description} </h6>
                     </div>
                   </td>
                   <td className="">
                     <h6 id="employee-recent-activity-table-body-start">
                       {task?.date}
                     </h6>
                   </td>
                   <td>
                     <p
                       className={`${
                         task.status === "Pending"
                           ? "task-table-ation-orange"
                           : task.status === "Approved"
                           ? "task-table-ation-green"
                           : "task-table-ation-blue"
                       }`}
                     >
                       {task?.status}
                     </p>
                   </td>

                 </tr>
               </tbody>
             );
           })}
         </Table>
       </div>
       <div className="employee-recent-activity-table-pagination-wrapper row justify-content-between align-items-center">
           <div className="col-lg-6 mt-3 d-flex justify-content-between ">
             <p>10 Entries per page</p>
             <p>
               Page 1 of 1
             </p>
           </div>
           <div className="col-lg-4 d-flex gap-5">
             <button>
               {" "}
               <span className="me-2 ">
                 <img src={chevronLeft} alt="" />
               </span>{" "}
               Prev
             </button>
             <button>
               Next{" "}
               <span className="ms-2">
                 <img src={chevronRight} alt="" />
               </span>{" "}
             </button>
           </div>
         </div>
     </main>
    </>
  );
}

export default EmployeeRecentTable
