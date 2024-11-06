import * as yup from "yup";

// for sign in
export const signInSchema = yup
  .object({
    email: yup
      .string()
      .required("email is required")
      .email("Invalid email format"),
    password: yup
      .string()
      .required("password is required")
      .min(8, "min lenght of password should be at least 8 chrs"),
  })
  .required();


  // for forgot password
export const forgotPasswordSchema = yup
.object({
  email: yup
    .string()
    .required("email is required")
    .email("Invalid email format"),
})
.required();

// for resetpasswordlink
export const resetPwdLinkSchema = yup
  .object({
    password: yup
      .string()
      .required("password is required")
      .min(8, "min lenght of password should be at least 8 chrs"),

    confirmPassword: yup
      .string()
      .required("confirm password is required")
      .min(8, "min lenght of password should be at least 8 chrs")
      .oneOf([yup.ref("password")], "Password do not match"),
  })
  .required();
  // for personal info

  export const personalInformation = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    mobileNumber: yup.string().required("Mobile Number is required").max(10, "max lenght of phone number should be at least 10")
    ,
    email: yup.string().email("Invalid email").required("Email is required"),
    dateOfBirth: yup.date().nullable() 
    .required("Date of Birth is required")
    .typeError("Date of Birth must be a valid date"),
    maritalStatus: yup.string().oneOf(["married", "single"], "Marital Status is required")
    .required("Marital Status is required"),
    gender: yup.string().oneOf(["male", "female"], "Gender is required")
    .required("Gender is required"),
    address: yup.string().required("Address is required"),
    profileImage: yup.mixed().required("Profile Image is required").nullable(),
  });

  export const professional = yup.object().shape({
    officeOfEmployment: yup.string().required("Office of Employment is required"),
    jobTitle: yup.string().oneOf(["Product Designer","Front-end","Back-end","Cyber Security", "Customer Rep", "Data Analyst"], "Employment Status is required"),
    department: yup.string().required("Department is required"),
    employmentStatus: yup.string().oneOf(["on-site",  "remote","hybrid"], "Employment Status is required"),
  });

  export const salary = yup.object().shape({
    salary: yup.number().required("Amount is required").positive("Amount must be positive").nullable() 
    .typeError("Amount must be positive"),
    startDate: yup.string().required("Start date is required"),
  });

 export const userAccount = yup.object().shape({
    password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], "Passwords must match").required("Confirm Password is required"),
  });