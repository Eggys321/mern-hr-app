import express from "express";
import { createTask, deleteTask, editTask, getAllTasks, getAssignedTasks, getSingleTask, getTaskById } from "../controllers/taskController.js"; 
import { auth } from "../middleware/auth.js";
import restrict from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/tasks",auth,restrict("admin", "super-admin"), createTask); 
router.get('/',auth,restrict("admin", "super-admin"), getAllTasks);
 
router.delete('/:id',auth,restrict("admin", "super-admin"), deleteTask);

router.patch('/:id',auth,restrict("admin", "super-admin"), editTask);
router.get("/:id",auth,restrict("admin", "super-admin"),getTaskById);
router.get('/tasks/assigned',auth,getAssignedTasks);
router.get("/tasks/:taskId",auth,getSingleTask);
export default router;
