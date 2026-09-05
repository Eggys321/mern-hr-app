import {createTransport} from "nodemailer";
import {
    createLeaveRequestEmailTemplate,
    createLeaveStatusUpdateEmailTemplate,
    createWelcomeEmailTemplate,
    resetPasswordEmailTemplate,
    sendTaskAssignmentEmail,
} from "./emailTemplate.js";

const transporter = createTransport({
    host: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

function sendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Email sent: " + info.response);
                resolve(info);
            }
        });
    });
}

export const sendWelcomeEmail = (options) => {
    return sendMail({
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: "Welcome to Hr-Manager",
        html: createWelcomeEmailTemplate(options.firstName, options.clientUrl),
        category: "welcome",
    });
}

export const sendForgotPasswordMail = (options) => {
    return sendMail({
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: "Reset Password",
        html: resetPasswordEmailTemplate(options.firstName, options.resetUrl),
        category: "Reset Password",
    });
}

export const sendTaskMail = (options) => {
    return sendMail({
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: "New Task Assigned!",
        html: sendTaskAssignmentEmail(
            options.firstName,
            options.taskTitle,
            options.taskDescription,
            options.startDate,
            options.endDate,
            options.clientUrl,
            options.assignedMembers,
        ),
        category: "New Task",
    });
}

export const sendLeaveRequestMail = (options) => {
    return sendMail({
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: "Leave Request!",
        html: createLeaveRequestEmailTemplate(
            options.employeeName,
            options.leaveType,
            options.startDate,
            options.endDate,
            options.duration,
            options.clientUrl
        ),
        category: "New Leave Request",
    });
}

export const sendLeaveStatusUpdateMail = (options) => {
    return sendMail({
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: `Your Leave Request is ${options.status}`,
        html: createLeaveStatusUpdateEmailTemplate(
            options.employeeName,
            options.leaveType,
            options.startDate,
            options.endDate,
            options.duration,
            options.status
        ),
    });
};
