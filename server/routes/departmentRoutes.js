import express from "express";
import { createDepartment, getDepartments, getSingleDepartment, searchDept, updateDept } from "../controllers/departmentController.js";
import { auth } from "../middleware/auth.js";
import restrict from "../middleware/isAdmin.js";
const router = express.Router();

router.post("/create",auth, restrict("admin", "super-admin") ,createDepartment);
router.get("/all-departments",auth,restrict("admin", "super-admin"),getDepartments);
router.get("/departments/:id", auth, restrict("admin", "super-admin"), getSingleDepartment); 
router.get("/dept/search", auth,restrict("admin", "super-admin"), searchDept);
router.patch("/:deptId",auth,restrict("admin", "super-admin"),updateDept);
export default router
