import React, { useState } from "react";
import Nav from "../../layout/Nav";
import { NavLink,useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import MyButton from "../../componenets/MyButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { userAccount } from "../../utils/ValidationSchema";
import axios from "axios";
import toast from "react-hot-toast";

const UserAccount = () => {
  const [profileImage, setProfileImage] = useState(null);
const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userAccount),
  });
  const token = localStorage.getItem("hr-token");

  const onSubmit = async (data) => {
    localStorage.setItem("userAccount", JSON.stringify(data));
    console.log(data);
    const personalInfo = JSON.parse(localStorage.getItem("personalInfo"));
    const professionalInfo = JSON.parse(localStorage.getItem("professional"));
    const salaryInfo = JSON.parse(localStorage.getItem("salary"));
    const finalPayload = new FormData();
    finalPayload.append("firstName", personalInfo?.firstName || "");
    finalPayload.append("lastName", personalInfo?.lastName || "");
    finalPayload.append("mobileNumber", personalInfo?.mobileNumber || "");
    finalPayload.append("email", personalInfo?.email || "");
    finalPayload.append("dateOfBirth", personalInfo?.dateOfBirth || "");
    finalPayload.append("maritalStatus", personalInfo?.maritalStatus || "");
    finalPayload.append("gender", personalInfo?.gender || "");
    finalPayload.append("address", personalInfo?.address || "");
    finalPayload.append("profileImage", personalInfo?.profileImage);
    finalPayload.append("jobTitle", professionalInfo?.jobTitle || "");
    finalPayload.append("department", professionalInfo?.department || "");
    finalPayload.append(
      "officeOfEmployment",
      professionalInfo?.officeOfEmployment || ""
    );
    finalPayload.append(
      "employmentStatus",
      professionalInfo?.employmentStatus || ""
    );
    finalPayload.append("salary", salaryInfo?.salary || 0);
    finalPayload.append("startDate", salaryInfo?.startDate || "");
    finalPayload.append("password", data?.password || "");
    finalPayload.append("confirmPassword", data?.confirmPassword || "");

    console.log("Final Payload:", finalPayload);
  
    try {
      const response = await axios.post(
        "https://mern-hr-app.onrender.com/api/auth/signup",
        finalPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if(response.data.success){
        toast.success(response.data.message);
        navigate("/admin-dashboard/employees/allemployees")
      }
     
      console.log("Signup successful:", response.data);
      // localStorage.removeItem("personalInfo");
      // localStorage.removeItem("professionalInfo");
      // localStorage.removeItem("salaryInfo");
      // localStorage.removeItem("userAccountData");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.errMsg || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Signup error:", error);
    }

    reset();
  };
  return (
    <>
      <div>
        <Nav />
        <div className="mt-5 personal-info-wrapper">
          <Form
            className="container-fluid pt-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="row justify-content-between mb-4">
              <Form.Group
                className="mb-3 col-lg-6 ps-0 "
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Password <span className="text-danger">*</span> </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Password"
                  {...register("password", { required: true })}
                />
                <span className="text-danger fs-6 text-start fw-bold">
                  {" "}
                  {errors.password?.message}
                </span>
              </Form.Group>
              <Form.Group
                className="mb-3 ps-0 col-lg-6"
                controlId="exampleForm.ControlInput2"
              >
                <Form.Label>Confirm Password <span className="text-danger">*</span> </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Re Enter Password"
                  {...register("confirmPassword", { required: true })}
                />
                <span className="text-danger fs-6 text-start fw-bold">
                  {" "}
                  {errors.confirmPassword?.message}
                </span>
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="col-lg-12  ps-0">
                <div className="mt-4 col-lg-12 ps-0 gap-3 d-flex flex-column-reverse flex-md-row gap-1 w-100">
                  <MyButton
                    variant="outline-danger"
                    text="Cancel"
                    className="cancel-btn mb-3"
                    disabled={isSubmitting}
                    onClick={() => {
                      reset();
                    }}
                  />
                  <MyButton
                    variant="primary"
                    text="Save & Continue"
                    className="save-and-continue-btn"
                    type="submit"
                    disabled={isSubmitting}
                  />
                </div>{" "}
              </Form.Group>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UserAccount;
