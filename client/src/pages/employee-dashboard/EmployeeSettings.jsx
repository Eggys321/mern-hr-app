import React,{useEffect,useState} from "react";
import "../../styles/Settings.css";
import Form from "react-bootstrap/Form";
import profilePic from "../../assets/taskTeamPhotoLady.svg";
import MyButton from "../../componenets/MyButton";
import toast from "react-hot-toast";
import apiClient from "../../utils/apiClient";

const EmployeeSettings = () => {
  const [profile, setProfile] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      const req = await apiClient.get("/api/employee/user/profile");

      if (req.data.success) {
        setProfile(req.data.employee);
      } else {
        console.error(req.data.errMsg);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function resetProfileForm() {
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!photoFile) {
      toast.error("Choose a new photo before saving.");
      return;
    }
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", photoFile);
      const req = await apiClient.patch(
        `/api/employee/${profile._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (req.data.success) {
        toast.success("Profile photo updated");
        setProfile((prev) => ({ ...prev, profileImage: req.data.employee.profileImage }));
        resetProfileForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.errMsg || "Failed to update photo");
    } finally {
      setSavingProfile(false);
    }
  }

  function resetPasswordForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const req = await apiClient.patch(
        "/api/auth/change-password",
        { currentPassword, newPassword, confirmNewPassword }
      );
      if (req.data.success) {
        toast.success(req.data.message);
        resetPasswordForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.errMsg || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <>
      <main className="pt-5 settings-wrapper">
        <section className="settings-section-1 pt-1">
          <h2 className="settings-section-1-header">Settings</h2>
          <h5>Dashboard/Settings</h5>
        </section>
        <section className="container settings-section-2 mt-4">
          <Form onSubmit={handleSaveProfile}>
            <div className="row justify-content-between">
              <div className="col-md-4">
                <h2 className="settings-section-2-h2">Profile Information</h2>
                <h5 className="settings-section-2-h5">
                  Edit your profile information
                </h5>
              </div>
              <div className="col-md-7">
                <div>
                  <Form.Group
                    className="mb-3"
                    controlId="fullName"
                  >
                    <Form.Label className="settings-form-label">
                      Full Name
                    </Form.Label>
                    <Form.Control
                      className="section-form-input"
                      type="text"
                      placeholder="Eggys"
                      value={profile.fullName || ''}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="email"
                  >
                    <div className="d-flex justify-content-between">
                      <Form.Label className="settings-form-label">
                        Email Address
                      </Form.Label>
                    </div>
                    <Form.Control
                      className="section-form-input"
                      type="email"
                      placeholder="demo@account.com"
                      value={profile.email || ''}
                      disabled
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="row pt-4 justify-content-between">
              <div className="col-md-4">
                <h2 className="settings-section-2-h2">Security</h2>
                <h5 className="settings-section-2-h5">Change your password</h5>
              </div>
              <div className="col-md-7">
                <div>
                  <Form.Group className="mb-3" controlId="currentPassword">
                    <Form.Label className="settings-form-label">
                      Current Password
                    </Form.Label>
                    <Form.Control
                      className="section-form-input"
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label className="settings-form-label">
                      New Password
                    </Form.Label>
                    <Form.Control
                      className="section-form-input"
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmNewPassword">
                    <Form.Label className="settings-form-label">
                      Confirm New Password
                    </Form.Label>
                    <Form.Control
                      className="section-form-input"
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </Form.Group>
                  <div className="row mt-2">
                    <div className="col-lg-12 ps-0 gap-3 d-flex flex-column-reverse flex-md-row gap-1 w-100">
                      <MyButton
                        type="button"
                        variant="outline-danger"
                        text="Cancel"
                        className="cancel-btn mb-3"
                        onClick={resetPasswordForm}
                      />
                      <MyButton
                        type="button"
                        variant="primary"
                        text={changingPassword ? "Updating..." : "Update Password"}
                        className="save-and-continue-btn"
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row pt-4 justify-content-between">
              <div className="col-md-4">
                <h2 className="settings-section-2-h2">Upload Photo</h2>
              </div>
              <div className="col-md-7">
                <div>
                  <h6>Profile pic</h6>
                  <img src={photoPreview || profile.profileImage || profilePic} alt="Profile picture" />
                  <p>
                    Your profile pic will be visible next to your name in your
                    profile. Your image should be at least 200x200px and must be
                    in JPG or PNG format.
                  </p>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>

                  <div className="row mt-4">
                    <div className="mt-4 col-lg-12 ps-0 gap-3 d-flex flex-column-reverse flex-md-row gap-1 w-100">
                      <MyButton
                        type="button"
                        variant="outline-danger"
                        text="Cancel"
                        className="cancel-btn mb-3"
                        onClick={resetProfileForm}
                      />
                      <MyButton
                        variant="primary"
                        text={savingProfile ? "Saving..." : "Save & Continue"}
                        className="save-and-continue-btn"
                        type="submit"
                        disabled={savingProfile}
                      />
                    </div>
                  </div>

              </div>
            </div>
          </Form>
        </section>
      </main>{" "}
    </>
  );
};

export default EmployeeSettings;
