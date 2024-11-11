import React, { useState } from "react";
import { NavLink, Outlet, useMatch,useNavigate } from "react-router-dom";
import Nav from "../../layout/Nav";
import "../../styles/PersonalInfo.css";
import Form from "react-bootstrap/Form";
import exclamationImg from "../../assets/exclamation-sign.svg";
import uploadImg from "../../assets/upload-img.svg";
import MyButton from "../../componenets/MyButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { personalInformation } from "../../utils/ValidationSchema";
import toast from "react-hot-toast";

const PersonalInfo = () => {
  const match = useMatch("/admin-dashboard/employees/personal-info");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(personalInformation),
  });
  const onSubmit = (data) => {
    // Check if a file was selected
    if (data.profileImage && data.profileImage.length > 0) {
      const file = data.profileImage[0]; 
      const reader = new FileReader();
  
      reader.onloadend = () => {
        // Convert the file to base64
        const base64Image = reader.result; 
  
        const formDataWithImage = {
          ...data,
          profileImage: base64Image,
        };
  
        localStorage.setItem("personalInfo", JSON.stringify(formDataWithImage));
        setImagePreview(null);
        navigate("/admin-dashboard/employees/personal-info/professional")
        toast.success("saved successfully")
        reset();
      };
  
      reader.readAsDataURL(file); 
    } else {
      console.error("No file selected");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError("The file is too large (max 2MB)");
        setImagePreview(null);
        return;
      } else {
        setImageError("");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      {match ? (
        <main>
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
                  <Form.Label>First Name <span className="text-danger">*</span> </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    {...register("firstName", { required: true })}
                  />
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.firstName?.message}
                  </span>
                </Form.Group>
                <Form.Group
                  className="mb-3 ps-0 col-lg-6"
                  controlId="exampleForm.ControlInput2"
                >
                  <Form.Label>Last Name <span className="text-danger">*</span> </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    {...register("lastName", { required: true })}
                  />
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.lastName?.message}
                  </span>
                </Form.Group>
              </div>
              {/* mobile and email */}
              <div className="row justify-content-between mb-4">
                <Form.Group
                  className="mb-3 col-lg-6 ps-0 "
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Mobile Number <span className="text-danger">*</span> </Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter Number"
                    {...register("mobileNumber", { required: true })}
                  />
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.mobileNumber?.message}
                  </span>
                </Form.Group>
                <Form.Group
                  className="mb-3 ps-0 col-lg-6"
                  controlId="exampleForm.ControlInput3"
                >
                  <Form.Label> Email Address <span className="text-danger">*</span> </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Email Address"
                    {...register("email", { required: true })}
                  />
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.email?.message}
                  </span>
                </Form.Group>
              </div>
              {/* date of birth and marital status */}
              <div className="row justify-content-between mb-4">
                <Form.Group
                  className="mb-3 col-lg-6 ps-0 "
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Date of Birth <span className="text-danger">*</span> </Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Select Date"
                    {...register("dateOfBirth", { required: true })}
                  />
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.dateOfBirth?.message}
                  </span>
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6 ps-0">
                  <Form.Label htmlFor="">Marital Status <span className="text-danger">*</span> </Form.Label>
                  <Form.Select
                    id=""
                    className="personal-info-wrapper-select"
                    {...register("maritalStatus", { required: true })}
                  >
                    <option disabled selected hidden>
                      Select
                    </option>
                    <option value="married">Married</option>
                    <option value="single">Single</option>
                  </Form.Select>
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.maritalStatus?.message}
                  </span>
                </Form.Group>
              </div>
              {/* gender and address */}
              <div className="row justify-content-between mb-4">
                <Form.Group className="mb-3 col-lg-6 ps-0">
                  <Form.Label htmlFor="">Gender <span className="text-danger">*</span> </Form.Label>
                  <Form.Select
                    id=""
                    className="personal-info-wrapper-select"
                    {...register("gender", { required: true })}
                  >
                    <option disabled selected>
                      Select
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Select>
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.gender?.message}
                  </span>
                </Form.Group>
                <Form.Group
                  className="mb-3 col-lg-6 ps-0"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Address <span className="text-danger">*</span> </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Address"
                    {...register("address", { required: true })}
                  />
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.address?.message}
                  </span>
                </Form.Group>
              </div>
              <div className="row">
                <div className="col-lg-12 ps-0">
                  <h3>Thumbnail <span className="text-danger">*</span> </h3>
                  <div className="d-flex gap-2 align-items-center">
                    <img src={exclamationImg} alt="" />
                    <p className="pt-3">
                      This image will appear in the explore page, upload a
                      square size of 2mb
                    </p>
                  </div>
                  <div className="position-relative">
                    <img
                      src={imagePreview || uploadImg}
                      alt=""
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                    <input
                      required
                      type="file"
                      style={{ maxWidth: "17%", marginTop: "5px" }}
                      className=" position-absolute top-50 start-0 translate-middle-y opacity-0"
                      role="button"
                      {...register("profileImage", { required: true })}
                      onChange={handleImageChange}
                    />
                    <span className="text-danger fs-6 text-start fw-bold">
                      {" "}
                      {errors.profileImage?.message}
                    </span>
                    {imageError && <p className="text-danger">{imageError}</p>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="mt-4 col-lg-12 ps-0 gap-3 d-flex flex-column-reverse flex-md-row gap-1 w-100">
                  <MyButton
                    variant="outline-danger"
                    text="Cancel"
                    className="cancel-btn mb-3"
                    disabled={isSubmitting}
                    onClick={() => {
                      reset(); setImagePreview(null);
                    }}
                  />
                  <MyButton
                    variant="primary"
                    text="Save & Continue"
                    className="save-and-continue-btn"
                    type="submit"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </Form>
          </div>
        </main>
      ) : (
        <div>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default PersonalInfo;
