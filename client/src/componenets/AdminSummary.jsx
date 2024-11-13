import React, { useEffect, useState } from "react";
import "../styles/AdminSummary.css";
import { allEmployeesList, eventLenght } from "../db";
import TaskTable from "./TaskTable";
import axios from "axios";
import totalEmployeesImg from "../assets/allEmployees.svg";
import totalTasksImg from "../assets/allTasks.svg";
import totalLeaves from "../assets/allLeaves.svg";
import { useAuth } from "../context/AuthContext";

const AdminSummary = () => {
  const [data,setData] = useState([])
  const token = localStorage.getItem("hr-token")

//  const {data} = useAuth()
 const getCounts = async ()=>{
  try {
    const req = await axios.get("https://mern-hr-app.onrender.com/api/count",{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    })
    // const res = await req.json();

    setData(req.data.eventLenght)
    
  } catch (error) {
    
  }
}

useEffect(()=>{
  getCounts()
},[])
  return (
    <>
      <main className="pt-5 admin-summary-wrapper">
        <section className="admin-summary-section-1 pt-1 ">
          <h1 className="admin-summary-section-1-header">Dashboard</h1>
          <div className="admin-summary-section-1-div justify-content-between align-items-center pt-5">
            {data.map((event) => {
              const {id,title,count,img} = event
              return (
                <div className="admin-summary-event-wrapper" key={id}>
                  <div className="admin-summary-event-wrapper-inner d-flex justify-content-between align-items-center">
                    <div className="">
                      <h5> {title} </h5>
                      <h1> {count} </h1>
                    </div>
                    <div>
                      {title === "Total Employees" ?   <img src={totalEmployeesImg} alt="event-img" loading="lazy" /> :title === "Total Tasks" ? <img src={totalTasksImg} alt="event-img" loading="lazy" /> :<img src={totalLeaves} alt="event-img" loading="lazy" /> }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section>
          <TaskTable/>
        </section>
      </main>
    </>
  );
};

export default AdminSummary;
