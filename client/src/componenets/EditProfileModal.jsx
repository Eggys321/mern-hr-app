import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from 'axios';
import toast from 'react-hot-toast';

const EditProfileModal = (props) => {
    const [firstname,setFirstName] = useState(props.selectedEmployee?.firstName);
    const [lastName, setLastName] = useState(props.selectedEmployee?.lastName);
    const [email,setEmail] = useState(props.selectedEmployee?.email);
    const [maritalStatus,setMaritalStatus] = useState(props.selectedEmployee?.maritalStatus);
    const [role,setRole] = useState(props.selectedEmployee?.role);
    const token = localStorage.getItem("hr-token");
    const updateProfile = async(e,employeeId)=>{
        e.preventDefault()
        try {
            const req = await axios.patch(`https://mern-hr-app.onrender.com/api/employee/${employeeId}`,{
                firstname,
                lastName,email,maritalStatus
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(req.data.success){
                toast.success(req.data.message)
            }
            console.log(req.data.message);
            
        } catch (error) {
            
        }
    }
  return (
    <>
     <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        // centered
        backdrop="static"
        keyboard={false}
        className="new-team-wrapper"
        
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span> Edit Profile</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => updateProfile(e, props.selectedEmployee._id)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Name" autoFocus value={firstname} onChange={(e)=>setFirstName(e.target.value)} />
            </Form.Group>
            {/* last name */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Name" autoFocus value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            </Form.Group>
            {/* email */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter Name" autoFocus value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </Form.Group>
            {/* gender */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="">Gender</Form.Label>
              <Form.Select id="" className="new-team-wrapper-select" value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}>
                <option disabled selected>
                  Select
                </option>
                <option value="single">single</option>
                <option value="married">married</option>
              </Form.Select>
            </Form.Group>
            {/* start and end date */}
            {/* <div className="container-fluid mb-4">
            <div className='row justify-content-between'>

                <Form.Group
                  className="mb-3 col-lg-6 ps-0"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" placeholder="Select Date" />
                </Form.Group>
                <Form.Group
                  className="mb-3 col-lg-6 px-0 "
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" placeholder="Select Date" />
                </Form.Group>
            </div>
              </div> */}
            {/* task status */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="">Role</Form.Label>
              <Form.Select id="" className="new-team-wrapper-select" value={role}
            onChange={(e) => setRole(e.target.value)}>
                <option disabled selected>
                  Select
                </option>
                <option value="employee">employee</option>
                <option value="admin">admin</option>
                <option value="super-admin">super admin</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex flex-column-reverse flex-md-row gap-3 w-100">
              <Button variant="outline-danger" className="cancel-btn mb-2">
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="save-and-continue-btn"
              
              >
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>

        {/* <Button onClick={props.onHide}>Close</Button> */}
      </Modal>
    </>
  )
}

export default EditProfileModal