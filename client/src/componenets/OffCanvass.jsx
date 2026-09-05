import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { sidebarLinks, employeeSidebarLinks } from "../db";
import appLogo from "../assets/nav-logo.png";
import arrowUp from "../assets/arrow-up-logo.svg";
import arrowDown from "../assets/arrow-down-logo.svg";
import { NavLink } from "react-router-dom";
import menuImg from "../assets/menu.svg";
import { useAuth } from "../context/AuthContext";
import { IoMdLogOut } from "react-icons/io";


const OffCanvass = ({ name, ...props }) => {
  const [show, setShow] = useState(false);
  const { user, logout } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <main className="">
        <img
          src={menuImg}
          alt="nav-menu"
          onClick={handleShow}
          className="border border-primary"
        />
        <Offcanvas show={show} onHide={handleClose} {...props} className="w-75">
          <Offcanvas.Body>

            <section className="d-flex flex-column gap-5 admin-dashboard-section-">
              <div className="d-flex gap-5 align-items-center">
                <div className="d-flex  gap-2 admin-dashboard-section-1-div-1">
                  <div>
                    <img src={appLogo} alt="app-logo" className="img-fluid" />
                  </div>
                  <div className="">
                    <h1 className="mb-0">HR Manager</h1>
                    <p className="">{user && user?.email}</p>
                  </div>
                </div>
                <div>
                  <div>
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
                  {user.role === "employee" ? (
                    <>
                      {employeeSidebarLinks.map((sidebarLink) => {
                        const { id, path, Icon, name } = sidebarLink;
                        return (
                          <NavLink key={id} to={path} end onClick={handleClose}>
                            {({ isActive, isPending }) => (
                              <span
                                className={`ps-2 d-flex align-items-center gap-2 mb-3 ${
                                  isPending
                                    ? "pending"
                                    : isActive
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <img src={Icon} alt={name} />
                                <h6 className="pt-2 nav-link-header">{name}</h6>
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {sidebarLinks.map((sidebarLink) => {
                        const { id, path, Icon, name } = sidebarLink;
                        return (
                          <NavLink key={id} to={path} end onClick={handleClose}>
                            {({ isActive, isPending }) => (
                              <span
                                className={`d-flex align-items-center gap-2 mb-3 ${
                                  isPending ? "pending" : isActive ? "active" : ""
                                }`}
                              >
                                <img src={Icon} alt={name} className="" />
                                <h6 className="pt-1 nav-link-header">{name}</h6>
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </section>
            <p
              role="button"
              onClick={logout}
              className="ps-4 pt-5 text-danger fs-4"
            >
             <IoMdLogOut className="mb-1"/>
             Logout
            </p>
          </Offcanvas.Body>
        </Offcanvas>
      </main>
    </>
  );
};

export default OffCanvass;
