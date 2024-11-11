import React from "react";
import Nav from "../../layout/Nav";
import { NavLink,useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import MyButton from "../../componenets/MyButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { salary } from "../../utils/ValidationSchema";
import toast from "react-hot-toast";

const Salary = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(salary),
  });
  const onSubmit = (data) => {
    localStorage.setItem("salary", JSON.stringify(data));
    navigate("/admin-dashboard/employees/personal-info/user-account")

    toast.success("saved successfully")
    reset()
   
  };

  return (
    <>
      <div>
        <Nav />
        <div className="mt-5 personal-info-wrapper">
            <Form className="container-fluid pt-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="row justify-content-between mb-4">
                <Form.Group
                  className="mb-3 col-lg-6 ps-0 "
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Amount <span className="text-danger">*</span> </Form.Label>
                  <Form.Control type="number" placeholder="Enter" {...register("salary", { required: true })}/>
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.salary?.message}
                  </span>
                </Form.Group>
                <Form.Group
                  className="mb-3 ps-0 col-lg-6"
                  controlId="exampleForm.ControlInput2"
                >
                  <Form.Label>Start Date <span className="text-danger">*</span> </Form.Label>
                  <Form.Control type="text" placeholder="format: day-month-year"{...register("startDate", { required: true })} />
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.startDate?.message}
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
                </div>
              </Form.Group>
            </div>
            </Form>
          </div>
      </div>
    </>
  );
};

export default Salary;
