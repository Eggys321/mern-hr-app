import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connect } from "../lib/db.js";
import USER from "../models/userModel.js";
import DEPARTMENT from "../models/departmentModel.js";

// Keep these in sync with the defaultValues in client/src/auth/SignIn.jsx.
const DEMO_EMAIL = "demoaccount2@gmail.cooom";
const DEMO_PASSWORD = "12345678";
const DEMO_DEPARTMENT_NAME = "Demo Department";

async function seed() {
  await connect();

  let demoUser = await USER.findOne({ email: DEMO_EMAIL });

  if (!demoUser) {
    demoUser = await USER.create({
      firstName: "Demo",
      lastName: "Admin",
      mobileNumber: "08000000000",
      email: DEMO_EMAIL,
      dateOfBirth: new Date("1990-01-01"),
      maritalStatus: "single",
      gender: "female",
      address: "123 Demo Street",
      profileImage:
        "https://res.cloudinary.com/eguono/image/upload/v1728864403/hr-manager/nav-logo_wzlhdy.png",
      role: "admin",
      officeOfEmployment: "Head Office",
      jobTitle: "Product Designer",
      department: new mongoose.Types.ObjectId(),
      employmentStatus: "remote",
      salary: 100000,
      startDate: "01-01-2024",
      password: DEMO_PASSWORD,
    });
    console.log(`Created demo user ${DEMO_EMAIL}`);
  } else {
    demoUser.password = DEMO_PASSWORD;
    await demoUser.save();
    console.log(`Demo user ${DEMO_EMAIL} already existed - password reset to the default.`);
  }

  let demoDept = await DEPARTMENT.findOne({ name: DEMO_DEPARTMENT_NAME });
  if (!demoDept) {
    demoDept = await DEPARTMENT.create({
      name: DEMO_DEPARTMENT_NAME,
      manager: demoUser._id,
      members: [demoUser._id],
    });
    console.log(`Created "${DEMO_DEPARTMENT_NAME}"`);
  }

  if (String(demoUser.department) !== String(demoDept._id)) {
    demoUser.department = demoDept._id;
    await demoUser.save();
  }

  console.log("\nDemo account ready:");
  console.log(`  email:    ${DEMO_EMAIL}`);
  console.log(`  password: ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Failed to seed demo account:", error);
  process.exit(1);
});
