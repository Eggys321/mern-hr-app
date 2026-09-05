import React from "react";
import messageImg from "../assets/messageImg.png";
import searchImg from "../assets/searchIcon.svg";
import notificationImg from "../assets/notificationImg.svg";
import "../styles/Navbar.css";
import OffCanvass from "../componenets/OffCanvass";
import Dropdown from "react-bootstrap/Dropdown";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="d-flex justify-content-between gap-5 sticky-top bg-light main-nav">
        <div className="d-md-none">
          {["start"].map((placement, idx) => (
            <OffCanvass key={idx} placement={placement} name={placement} />
          ))}
        </div>
        <form className="nav-form position-relative d-none d-md-block" role="search">
          <input
            type="search"
            aria-label="Search"
            placeholder="Search"
          />
          <img
            className="position-absolute top-50 end-0 translate-middle-y pe-2"
            src={searchImg}
            alt=""
          />
        </form>
        <div className="nav-div d-flex gap-4 align-items-center">
          <div className="d-none d-lg-block">
            <img src={notificationImg} alt="Notifications" />
          </div>
          <div className="d-none d-lg-block">
            <img src={messageImg} alt="Messages" />
          </div>
          <div className="d-flex gap-2 align-items-center">
            <div>
              <img
                src={searchImg}
                alt=""
                className="me-3 d-md-none"
              />
              <img
                src={user.profileImage}
                alt={user ? `${user.firstName} ${user.lastName}'s profile picture` : "Profile picture"}
                className=""
                style={{width:"20px",height:"25px" , borderRadius:"100%"}}
              />
            </div>

            <Dropdown className="d-none d-lg-block">
              <Dropdown.Toggle
                variant=""
                id="dropdown-basic"
                className="drop-down-header"
              >

                {user && user?.firstName + ' ' + user.lastName }
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  href="#"
                  className="text-danger"
                  onClick={logout}
                >
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </div>
        </div>
      </nav>

    </>
  );
};

export default Navbar;
