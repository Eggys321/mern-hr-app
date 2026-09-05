import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { connect } from "./lib/db.js";
import authRoute from "./routes/authRoute.js";
import departmentRoute from "./routes/departmentRoutes.js";
import employeeRoute from "./routes/employeesRoutes.js";
import taskRoute from "./routes/taskRoute.js";
import allSchemaCount from "./routes/allSchemaLength.js";
import leaveRoute from "./routes/leaveRoute.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import cors from "cors"
const app = express();

const port = process.env.PORT || 4040;

// CLIENT_URL can be a single origin or a comma-separated list (e.g. a
// Vercel production domain plus its preview-deployment domains). Trailing
// slashes are stripped since "https://foo.com/" and "https://foo.com" are
// the same origin but would otherwise fail a strict string match.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean)
  .concat(["http://localhost:5173", "http://localhost:3000"]);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Logged so a rejected production origin shows up in the Render logs
    // instead of just failing silently as a "network error" in the browser.
    console.warn(`CORS: rejected request from origin "${origin}". Allowed: ${allowedOrigins.join(", ")}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}))
app.use(express.json())
app.use(fileUpload({ useTempFiles: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, errMsg: "Too many attempts, please try again later." },
});

app.use("/api/auth/signin", authLimiter);
app.use("/api/auth/forgotpassword", authLimiter)
app.use("/api/auth/resetpassword", authLimiter)
app.use("/api/auth",authRoute)
app.use("/api/department",departmentRoute);
app.use("/api/employee",employeeRoute);
app.use("/api/task",taskRoute);
app.use("/api",allSchemaCount);
app.use("/api/leave",leaveRoute)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRETE,
});
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "server is live" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, errMsg: "route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    errMsg: err.message || "Server error.",
  });
});

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("invalid database connection: " + error.message);
    process.exit(1);
  });
