import React, { useState } from "react";
import "../styles/SignIn.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import navLogo from "../assets/nav-logo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { signInSchema } from "../utils/ValidationSchema";
import { Link, useNavigate } from "react-router-dom";
import vissibilityOnIcon from "../assets/visibility_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import vissibilityOffIcon from "../assets/visibility_off_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
  import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";
import { Loader } from "../utils/Loader";
import apiClient from "../utils/apiClient";

const SignIn = () => {
  const [isReveal, setIsReveal] = useState(false);
  const [isClicked,setIsClicked] = useState(false)
  const {login} = useAuth()
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "demoaccount2@gmail.cooom",
      password: "12345678",
    },
  });
  async function handleSignIn(data) {
    setIsClicked(true)
    try {
      const res = await apiClient.post("/api/auth/signin", data);

      if (res.data.success) {
        toast.success(res.data.message)
        login(res.data.user)
        localStorage.setItem("hr-token", res.data.user.token)
        if(res.data.user.role === "super-admin" || res.data.user.role === "admin"){
          navigate("/admin-dashboard")
        }else{
          navigate("/employee-dashboard")
        }
      } else {
        toast.error(res.data.errMsg)
      }
    } catch (error) {
      const message = error.response
        ? error.response.data?.errMsg || "Email or Password is Incorrect"
        : "Unable to connect to the server. Please check your network.";
      toast.error(message);
    }finally{
      setIsClicked(false)
    }

  }
  function toggleReveal() {
    if (isReveal) {
      setIsReveal(false);
    } else {
      setIsReveal(true);
    }
  }

  const btnText = isClicked ? <Loader/> : "Sign In"
  return (
    <>
      <main className="main-auth sign-in d-flex justify-content-center align-items-center">
        <Form
          className="sign-in-inner shadow-lg"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <div className="text-center">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div>
                <img src={navLogo} alt="nav-logo" width="46" height="45" />
              </div>
              <h1 className="pt-2">HR Manager</h1>
            </div>
            <h2 className="pt-4">
              Welcome to HR Manager - Where Creativity Meets Opportunity!
            </h2>
            <p className="text-muted small mb-0">
              Demo account pre-filled below - just click Sign In to explore the app.
            </p>
          </div>
          <Form.Group className="" controlId="formBasicEmail">
            <Form.Label className="label">Email <span className="text-danger fs-5">*</span></Form.Label>
            <Form.Control
              className="input"
              type="email"
              placeholder="Enter email"
              {...register("email", { required: true })}
            />
            <span className="text-danger fs-6 text-start fw-bold"> {errors.email?.message}</span>
          </Form.Group>
          <Form.Group className="" controlId="formBasicPassword">
            <div className="d-flex justify-content-between">
              <Form.Label className="label">Password <span className="text-danger fs-5">*</span></Form.Label>
              <Link to="/auth/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
            <div className="position-relative">
              <img
                onClick={toggleReveal}
                role="button"
                className=" position-absolute end-0 pt-2 pe-1"
                src={isReveal ? vissibilityOnIcon : vissibilityOffIcon }
                alt="eye-open-logo"
              />
              <Form.Control
                className="input"
                type={isReveal ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: true })}
              />
              <span className="text-danger fs-6 text-start fw-bold"> {errors.password?.message}</span>
            </div>
          </Form.Group>
          <Button className="sign-in-btn" variant="primary" type="submit" disabled={isSubmitting}>
            {btnText}
          </Button>
        </Form>
      </main>
    </>
  );
};

export default SignIn;
