import React,{useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const LeaveModal = (props) => {
  const {createLeave} = useAuth()
  const [leaveType, setLeaveType] = useState("select");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function reset() {
    setLeaveType("select");
    setStartDate("");
    setEndDate("");
    setDescription("");
  }

  const handleLeaveSubmit = async () => {
    if (leaveType === "select" || !startDate || !endDate || !description) {
      toast.error("All fields are required");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date can't be before the start date");
      return;
    }
    const leaveData = {
      leaveType,
      startDate,
      endDate,
      description,
    };
    setIsSubmitting(true);
    try {
      const succeeded = await createLeave(leaveData);
      if (succeeded) {
        reset();
        props.onHide();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
    return (
      <>
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="new-team-wrapper"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <span> Leave Request</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>

              <Form.Group className="mb-3" controlId="leaveType">
                <Form.Label>Leave Type</Form.Label>
                <Form.Select className="new-team-wrapper-select"   value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}>
                  <option value="select" disabled selected>
                    Select
                  </option>
                  <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
                </Form.Select>
              </Form.Group>


              <div className="container-fluid mb-4">
              <div className='row justify-content-between'>
  
                  <Form.Group
                    className="mb-3 col-lg-6 ps-0"
                    controlId="leaveStartDate"
                  >
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" placeholder="Select Date"  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}/>
                  </Form.Group>
                  <Form.Group
                    className="mb-3 col-lg-6 px-0 "
                    controlId="leaveEndDate"
                  >
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="date" placeholder="Select Date" value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}/>
                  </Form.Group>
              </div>
                </div>
              <Form.Group
            className="mb-3"
            controlId="leaveDescription"
          >
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description}
            onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>

              <div className="d-flex flex-column-reverse flex-md-row justify-content-between w-100">
                <Button
                  type="button"
                  variant="outline-danger"
                  className="cancel-btn mb-2"
                  onClick={() => {
                    reset();
                    props.onHide();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleLeaveSubmit}
                  className="save-and-continue-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </Form>
          </Modal.Body>


        </Modal>
      </>
    );
  };

export default LeaveModal
