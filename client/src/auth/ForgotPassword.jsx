import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import navLogo from "../assets/nav-logo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../utils/ValidationSchema";
import { useForm } from "react-hook-form";
import "../styles/ForgotPassword.css";
import { Loader } from "../utils/Loader";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";
const ForgotPassword = () => {
  const [isClicked,setIsClicked] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const handleForgotPwd = async (data) => {
    setIsClicked(true)

   try {
    const res = await apiClient.post("/api/auth/forgotpassword", data);
    if (res.data.success) {
      toast.success(res.data.message)
    } else {
      toast.error(res.data.errMsg)
    }
   } catch (error) {
    toast.error(error.response?.data?.errMsg || "Failed to send reset email");
   }finally{
    setIsClicked(false)

   }
  };
  const btnText = isClicked ? <Loader/> : "Request Password Reset"

  return (
    <>
      <main className="main-auth forgot-password-container d-flex justify-content-center align-items-center">
        <Form
          className="forgot-password-inner shadow-lg"
          onSubmit={handleSubmit(handleForgotPwd)}
        >
          <div className="">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div>
                <img src={navLogo} alt="nav-logo" width="46" height="45" />
              </div>
              <h1 className="pt-2">HR Manager</h1>
            </div>
          </div>
          <Form.Group className="" controlId="formBasicEmail">
            <h2 className="py-2">Forgot password <span className="text-danger fs-5">*</span></h2>
            <Form.Control
              className="input"
              type="email"
              placeholder="Enter your email address to reset your password."
              {...register("email", { required: true })}
            />
          <span className="text-danger fs-6 text-start fw-bold"> {errors.email?.message}</span>
          </Form.Group>

          <Button
            className="forgot-password-btn"
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {btnText}
          </Button>
        </Form>
      </main>
    </>
  );
};

export default ForgotPassword;
