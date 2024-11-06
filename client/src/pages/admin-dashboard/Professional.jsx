import React,{useState,useEffect} from "react";
import { NavLink } from "react-router-dom";
import Nav from "../../layout/Nav";
import Form from "react-bootstrap/Form";
import MyButton from "../../componenets/MyButton";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { professional } from "../../utils/ValidationSchema";
import toast from "react-hot-toast";

const Professional = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("hr-token")
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(professional),
  });
  const onSubmit = (data) => {
    // Save data to local storage or perform other actions
    localStorage.setItem("professional", JSON.stringify(data));

    console.log(data);
    toast.success("saved successfully")
    // Reset the form after submission
    reset();
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:4040/api/department/all-departments",{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        console.log(response.data.departments);
        
        setDepartments(response.data.departments); 
      } catch (err) {
        setError("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);
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
                  <Form.Label>Office of Employment <span className="text-danger">*</span> </Form.Label>
                  <Form.Control type="text" placeholder="Enter" {...register("officeOfEmployment", { required: true })}
                  />
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.officeOfEmployment?.message}
                  </span>
                </Form.Group>
                <Form.Group
                  className="mb-3 ps-0 col-lg-6"
                  controlId="exampleForm.ControlInput2"
                >
                  <Form.Label>Job Title <span className="text-danger">*</span> </Form.Label>
                  <Form.Select
                    id=""
                    className="personal-info-wrapper-select"
                    {...register("jobTitle", { required: true })}
                  >
                    <option disabled selected hidden>
                      Select
                    </option>
                    <option value="Front-end">Front-end</option>
                    <option value="Back-end">Back-end</option>
                    <option value="Product Designer">Product Designer</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Customer Rep">Customer Rep</option>
                    <option value="Data Analyst">Data Analyst</option>
                  </Form.Select>
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.jobTitle?.message}
                  </span>
                </Form.Group>
              </div>
              
              
              {/* dept and employment status */}
              {/* start ================================================ */}
              <div className="row justify-content-between mb-4">
                <Form.Group className="mb-3 col-lg-6 ps-0">
                  <Form.Label htmlFor="">Department <span className="text-danger">*</span> </Form.Label>
                  <Form.Select id="" className="personal-info-wrapper-select"  {...register("department", { required: true })}>
                    <option disabled selected value="">
                      Select
                    </option>
                    {loading && <option>Loading...</option>}
                    {error && <option>{error}</option>}
                    {departments.map((department) => (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                    {/* <option>Product</option>
                    <option>Admin</option>
                    <option>Marketing</option>
                    <option>Operations</option> */}
                  </Form.Select>
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.department?.message}
                  </span>
                </Form.Group>
                {/* end ====================================================*/}
                <Form.Group className="mb-3 col-lg-6 ps-0">
                  <Form.Label htmlFor="">Employment Status <span className="text-danger">*</span> </Form.Label>
                  <Form.Select id="" className="personal-info-wrapper-select" {...register("employmentStatus", { required: true })}>
                    <option disabled selected>
                      Select
                    </option>
                    <option value="on-site">On-Site</option>
                    <option value= "remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </Form.Select>
                  <span className="text-danger fs-6 text-start fw-bold">
                    {" "}
                    {errors.employmentStatus?.message}
                  </span>
                </Form.Group>
              </div>
           
              {/* <div className="mt-4 d-flex gap-3">
                <MyButton/>
              </div> */}
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

export default Professional;
