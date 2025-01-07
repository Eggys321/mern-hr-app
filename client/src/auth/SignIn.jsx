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

const apiUrl = import.meta.env.VITE_API_URL
const SignIn = () => {
  const [isReveal, setIsReveal] = useState(false);
  const [isClicked,setIsClicked] = useState(false)
  const [isError,setIsError] = useState(null)
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
    signInSchema
  });
  async function handleSignIn(data) {
    setIsClicked(true)
    try {
      const req = await fetch(`${apiUrl}/api/auth/signin`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      })
      const res = await req.json();
    
      if(!res.success){
        toast.error(res.errMsg)
      }
      if(res.success){
        toast.success(res.message)
        login(res.user)
        localStorage.setItem("hr-token",res.user.token)
        if(res.user.role === "super-admin" || res.user.role === "admin"){
          navigate("/admin-dashboard")
        }else{
          navigate("/employee-dashboard")
        }
      }
      
    } catch (error) {
    if (error.message === "Failed to fetch") {
      setIsError("Unable to connect to the server. Please check your network.");
    } else if (error.message.startsWith("HTTP Error")) {
      setIsError(error.message);  
    } else {
      setIsError("An unexpected error occurred. Please try again.");
    }
    toast.error(isError);
      
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
                <img src={navLogo} alt="nav-logo" />
              </div>
              <h1 className="pt-2">HR Manager</h1>
            </div>
            <h3 className="pt-4">
              Welcome to HR Manager - Where Creativity Meets Opportunity!
            </h3>
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
