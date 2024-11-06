import express from "express";
import { auth } from "../middleware/auth.js";
import { applyForLeave, approveLeave, approveOrDeclineLeave, declineLeave, getAllLeaves, getEmployeeLeaves, getSingleLeave } from "../controllers/leaveController.js";
import restrict from "../middleware/isAdmin.js";
const router = express.Router();



router.post("/apply", auth, applyForLeave);
router.put("/:leaveId/status", auth,restrict("admin", "super-admin"), approveOrDeclineLeave);
router.get("/all-leaves",auth,restrict("admin", "super-admin"), getAllLeaves);
router.get("/:leaveId", auth,restrict("admin", "super-admin"),getSingleLeave);


router.patch("/:leaveId/approve",auth,restrict("admin", "super-admin"),  approveLeave);
router.patch("/:leaveId/decline", auth,restrict("admin", "super-admin"), declineLeave);
router.get("/employee/leaves", auth, getEmployeeLeaves);

export default router;
