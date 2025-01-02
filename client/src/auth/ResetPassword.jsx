import React, { useState } from "react";
import "../styles/ResetPassword.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import navLogo from "../assets/nav-logo.png";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPwdLinkSchema } from "../utils/ValidationSchema";
import vissibilityOnIcon from "../assets/visibility_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import vissibilityOffIcon from "../assets/visibility_off_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
import toast from "react-hot-toast";
import { Loader } from "../utils/Loader";

const ResetPassword = () => {
  const [isReveal, setIsReveal] = useState(false);
  const [isReveal2, setIsReveal2] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPwdLinkSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data) => {
    setIsClicked(true);

    try {
      const req = await fetch(
        `https://mern-hr-app.onrender.com/api/auth/resetpassword/${resetToken}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const res = await req.json();
      if (!res.success) {
        toast.error(res.message);
      }
      if (res.success) {
        toast.success(res.message);
        navigate("/auth/sign-in");
      }
    } catch (error) {
    } finally {
      setIsClicked(false);
    }
  };
  function toggleReveal() {
    if (isReveal) {
      setIsReveal(false);
    } else {
      setIsReveal(true);
    }
  }
  function toggleReveal2() {
    if (isReveal2) {
      setIsReveal2(false);
    } else {
      setIsReveal2(true);
    }
  }
  const btnText = isClicked ? <Loader /> : "Reset Password";

  return (
    <>
      <main className="main-auth sign-in reset-password d-flex justify-content-center align-items-center">
        <Form
          className="reset-password-inner shadow-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-center">
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div>
                <img src={navLogo} alt="nav-logo" />
              </div>
              <h1 className="pt-2">HR Manager</h1>
            </div>
          </div>
          <h3 className="py-2">Reset password</h3>
          <Form.Group className="" controlId="formBasicPassword">
            <div className="position-relative">
              <img
                onClick={toggleReveal}
                role="button"
                className="position-absolute end-0 pt-2 pe-1"
                src={isReveal ? vissibilityOnIcon : vissibilityOffIcon}
                alt="eye-open-logo"
              />
              <Form.Control
                className="input"
                type={isReveal ? "text" : "password"}
                placeholder="Enter New Password"
                {...register("password", { required: true })}
              />
              <span className="text-danger fs-6 text-start fw-bold">
                {errors.password?.message}
              </span>{" "}
            </div>
          </Form.Group>
          <Form.Group className="" controlId="formBasicConfirmPassword">
            <div className="position-relative">
              <img
                onClick={toggleReveal2}
                role="button"
                className=" position-absolute end-0 pt-2 pe-1"
                src={isReveal2 ? vissibilityOnIcon :  vissibilityOffIcon}
                alt="eye-open-logo"
              />
              <Form.Control
                className="input"
                type={isReveal2 ? "text" : "password"}
                placeholder="Re-enter Password"
                {...register("confirmPassword", { required: true })}
              />
              <span className="text-danger fs-6 text-start fw-bold">
                {errors.confirmPassword?.message}
              </span>{" "}
            </div>
          </Form.Group>
          <Button
            className="reset-password-btn"
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

export default ResetPassword;
