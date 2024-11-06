import {createTransport} from "nodemailer";
import { createLeaveRequestEmailTemplate, createLeaveStatusUpdateEmailTemplate, createWelcomeEmailTemplate,resetPasswordEmailTemplate,sendTaskAssignmentEmail } from "./emailTemplate.js";

export const sendWelcomeEmail = (options)=>{

    const transporter = createTransport({
        host:process.env.EMAIL_SERVICE,
        port:process.env.EMAIL_PORT,
        secure:false,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from:process.env.EMAIL_FROM,
        to:options.to,
        subject:"Welcome to Hr-Manager",
        html: createWelcomeEmailTemplate(options.firstName, options.clientUrl),
        category: "welcome",

    };

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    })

}
export const sendForgotPasswordMail = (options)=>{

    const transporter = createTransport({
        host:process.env.EMAIL_SERVICE,
        port:process.env.EMAIL_PORT,
        secure:false,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from:process.env.EMAIL_FROM,
        to:options.to,
        subject:"Reset Password",
        html: resetPasswordEmailTemplate(options.firstName, options.resetUrl),
        category: "Reset Password",

    };

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    })

}
export const sendTaskMail = (options)=>{

    const transporter = createTransport({
        host:process.env.EMAIL_SERVICE,
        port:process.env.EMAIL_PORT,
        secure:false,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from:process.env.EMAIL_FROM,
        to:options.to,
        subject:"New Task Assigned!",
        html: sendTaskAssignmentEmail(  options.firstName, 
            options.taskTitle,
            options.taskDescription,
            options.startDate,
            options.endDate,
            options.clientUrl ,
            options.assignedMembers,),
        category: "New Task",

    };

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    })

}
export const sendLeaveRequestMail = (options)=>{

    const transporter = createTransport({
        host:process.env.EMAIL_SERVICE,
        port:process.env.EMAIL_PORT,
        secure:false,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from:process.env.EMAIL_FROM,
        to:options.to,
        subject:"Leave Request!",
        html: createLeaveRequestEmailTemplate(  options.employeeName, 
            options.leaveType,
            options.startDate,
            options.endDate,
            options.duration,
            options.clientUrl
        ),
        category: "New Leave Request",

    };

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    })

}

export const sendLeaveStatusUpdateMail = (options) => {
    const transporter = createTransport({
      host: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
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
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Failed to send status update email:", error);
      } else {
        console.log("Status update email sent successfully: " + info.response);
      }
    });
  };
  





