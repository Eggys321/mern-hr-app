import express from "express";
import { employees, getEmployeeById, getEmployeeProfile, searchUsers, updateEmployee } from "../controllers/employeesController.js";
import { auth } from "../middleware/auth.js";
import restrict from "../middleware/isAdmin.js";
const router = express.Router();


router.patch("/:employeeId",auth,updateEmployee);

router.get("/users",auth,restrict("admin", "super-admin"),employees );
router.get("/users/search", auth,restrict("admin", "super-admin"), searchUsers);
router.get('/:id',auth,restrict("admin", "super-admin"), getEmployeeById);
router.get("/user/profile",auth,getEmployeeProfile);

export default router
