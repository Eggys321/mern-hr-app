import React, { Suspense } from "react";
import { sidebarLinks } from "../db";
import appLogo from "../assets/nav-logo.png";
import arrowUp from "../assets/arrow-up-logo.svg";
import arrowDown from "../assets/arrow-down-logo.svg";
import { NavLink, Outlet } from "react-router-dom";
import "../styles/AdminDashboard.css";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../utils/Loader";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <main className="container-fluid  admin-dashoard ">

        <section className="admin-dashoard-main">

          <section className="d-flex flex-column gap-5 admin-dashboard-section-1">
            <div className="d-flex gap-5 align-items-center">
              <div className="d-flex  gap-2 admin-dashboard-section-1-div-1 ">
                <div>
                  <img src={appLogo} alt="app-logo" className="img-fluid" />
                </div>
                <div className="">
                  <h1 className="mb-0">HR Manager</h1>
                  <p className="mt-2" style={{width:"60px"}}> {user && user?.email} </p>
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <div>
                    <img src={arrowUp} alt="arrow-up-logo" className="" />
                  </div>
                  <div>
                    <img
                      src={arrowDown}
                      alt="arrow-down-logo"
                      className="pb-4"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-4 admin-dashboard-section-1-div-2">
              <h2>MAIN MENU</h2>
              <div className="ms-3 sidebar">
                {sidebarLinks.map((sidebarLink) => {
                  const { id, path, Icon, name } = sidebarLink;
                  return (
                    <NavLink key={id} to={path} end>
                      {({ isActive, isPending }) => (
                        <span
                          className={`ps-2 d-flex align-items-center gap-2 mb-3 ${
                            isPending ? "pending" : isActive ? "active" : ""
                          }`}
                        >
                          <img src={Icon} alt={name} className="" />
                          <h6 className="pt-2 nav-link-header">{name}</h6>
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="admin-dashboard-section-2 ">
            <Navbar />
            <Suspense fallback={<div className="py-5 d-flex justify-content-center"><Loader /></div>}>
              <Outlet />
            </Suspense>
          </section>
        </section>
      </main>
    </>
  );
};

export default AdminDashboard;
