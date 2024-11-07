import React, { useEffect,useState } from "react";
import "../../styles/Settings.css";
import Form from "react-bootstrap/Form";
import profilePic from "../../assets/taskTeamPhotoLady.svg";
import MyButton from "../../componenets/MyButton";
import {Link} from "react-router-dom";
import axios from "axios";


const Settings = () => {
  const [profile, setProfile] = useState({});
  const token = localStorage.getItem("hr-token")
  useEffect(() => {
    async function userProfile() {
      try {
        const req = await axios.get("https://mern-hr-app.onrender.com/api/employee/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (req.data.success) {
          setProfile(req.data.employee);
        } else {
          console.error(req.data.errMsg);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    userProfile();
  }, [token]);
  return (
    <>
      <main className="pt-5 settings-wrapper">
        <section className="settings-section-1 pt-1">
          <h2 className="settings-section-1-header">Settings</h2>
          <h5>Dashboard/Settings</h5>
        </section>
        <section className="container settings-section-2 mt-4">
            <Form>
          <div className="row justify-content-between">
            <div className="col-md-4">
              <h2 className="settings-section-2-h2">Profile Information</h2>
              <h5 className="settings-section-2-h5">Edit your profile information</h5>
            </div>
            <div className="col-md-7">
              <div>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label className="settings-form-label">Full Name</Form.Label>
                  <Form.Control className="section-form-input" type="text" placeholder="Eggys" disabled  value={profile.fullName || ''}/>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <div className="d-flex justify-content-between">

                  <Form.Label className="settings-form-label">Email Address</Form.Label>
                  {/* <Link>Change Account Email</Link> */}
                  </div>
                  <Form.Control className="section-form-input" type="email" placeholder="demo@account.com" disabled value={profile.email || ''} />
                </Form.Group>
               
                </div>
            </div>
          </div>
          {/* security */}
          <div className="row pt-4 justify-content-between">
            {/* <div className="col-md-4">
              <h2 className="settings-section-2-h2">Security</h2>
            </div>
            <div className="col-md-7">
              <div>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                  >
                  <div className="d-flex justify-content-between">

                  <Form.Label className="settings-form-label" >Password</Form.Label>
                  <Link>Change Password</Link>
                  </div>
                  <Form.Control className="section-form-input" type="password" placeholder="xxxxxxxxxxx"  value={profile.password || ''}/>
                </Form.Group>
              </div>
            </div> */}
          </div>
          {/* upload photo */}
          <div className="row pt-4 justify-content-between">
            <div className="col-md-4">
              <h2 className="settings-section-2-h2">Upload Photo</h2>
            </div>
            <div className="col-md-7">
              <div>
                <h6>Profile pic</h6>
                <img src={profile.profileImage || profilePic} alt="profile-pic" />
                <p>Your profile pic will be visible next to your name in your profile.  Your image should be at least 200x200px and must be in JPG or PNG format.</p>
              </div>
              
              <div className="row mt-4">
                    <div className="mt-4 col-lg-12 ps-0 gap-3 d-flex flex-column-reverse flex-md-row gap-1 w-100">
                      <MyButton
                        variant="outline-danger"
                        text="Cancel"
                        className="cancel-btn mb-3"
                      />
                      <MyButton
                        variant="primary"
                        text="Save & Continue"
                        className="save-and-continue-btn"
                        type="submit"
                      />
                    </div>
                  </div>
              
            </div>
          </div>

          </Form>
        </section>
      </main>
    </>
  );
};

export default Settings;
