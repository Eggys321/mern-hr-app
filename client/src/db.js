import dashboardImg from "./assets/dashboardimg.svg";
import employeesImg from "./assets/employeesimg.svg";
import taskboardImg from './assets/taskboardimg.svg';
import leaveboardImg from "./assets/leaveboardimg.svg";
import payrollImg from "./assets/payrollimg.svg";
import settingsImg from "./assets/settingsimg.svg";

export const sidebarLinks = [
  {
    id: 1,
    Icon: dashboardImg,
    name: "Dashboard",
    path: "",
  },
  {
    id: 2,
    Icon: employeesImg,
    name: "Employees",
    path: "employees",
  },
  {
    id: 3,
    Icon: taskboardImg,
    name: "Taskboard",
    path: "taskboard",
  },
  {
    id: 4,
    Icon: leaveboardImg,
    name: "Leaveboard",
    path: "leaveboard",
  },
  {
    id: 5,
    Icon: payrollImg,
    name: "Payroll",
    path: "payroll",
  },
  {
    id: 6,
    Icon: settingsImg,
    name: "Settings",
    path: "settings",
  },
];

export const employeeSidebarLinks = [
  {
    id: 1,
    Icon: dashboardImg,
    name: "Dashboard",
    path: "",
  },
  {
    id: 2,
    Icon: taskboardImg,
    name: "Taskboard",
    path: "taskboard",
  },
  {
    id: 3,
    Icon: leaveboardImg,
    name: "Leaveboard",
    path: "leaveboard",
  },
  {
    id: 4,
    Icon: settingsImg,
    name: "Settings",
    path: "settings",
  },
];

export const employeeRecentActTableData = [
  {
    id:1,
    activity:"New Task Assigned",
    description:"Website Project Update On Slack",
    date:"Sep 21, 2024",
    status:"Pending"
  },
  {
    id:2,
    activity:"Leave Request Approval",
    description:"Leave approved for Sep 30 - Oct",
    date:"Sep 21, 2024",
    status:"In Progress"
  },
  {
    id:3,
    activity:"Leave Request Approval",
    description:"Leave requested for Sep 30 - Oct",
    date:"Sep 21, 2024",
    status:"Approved"
  },
  {
    id:4,
    activity:"Leave Request",
    description:"Leave requested for Sep 30 - Oct",
    date:"Sep 21, 2024",
    status:"In Progress"
  },
  {
    id:5,
    activity:"New Task Assigned",
    description:"Website Project Update On Slack",
    date:"Sep 21, 2024",
    status:"Pending"
  },
  {
    id:6,
    activity:"New Task Assigned",
    description:"Website Project Update On Slack",
    date:"Sep 21, 2024",
    status:"Approved"
  },
  {
    id:7,
    activity:"Leave Request",
    description:"Leave requested for Sep 30 - Oct",
    date:"Sep 21, 2024",
    status:"In Progress"
  }
];
