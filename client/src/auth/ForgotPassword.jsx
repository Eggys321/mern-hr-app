import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import navLogo from "../assets/nav-logo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "../utils/ValidationSchema";
import { useForm } from "react-hook-form";
import "../styles/ForgotPassword.css";
import axios from "axios";
import { Loader } from "../utils/Loader";
import toast from "react-hot-toast";
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
    const req = await fetch("https://mern-hr-app.onrender.com/api/auth/forgotpassword",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    })
    const res = await req.json();
    console.log(res);
    
    if(!res.success){
      toast.error(res.errMsg)
    }
    if(res.success){
      toast.success(res.message)

    }
    console.log(res);
    
   } catch (error) {
    
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
                <img src={navLogo} alt="nav-logo" />
              </div>
              <h1 className="pt-2">HR Manager</h1>
            </div>
          </div>
          <Form.Group className="" controlId="formBasicEmail">
            <h3 className="py-2">Forgot password <span className="text-danger fs-5">*</span></h3>
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
