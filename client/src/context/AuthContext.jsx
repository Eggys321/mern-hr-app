import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [leave,setLeave] = useState([]);
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const token = localStorage.getItem("hr-token");

  const getEmployeeById = async (id) => {
    try {
      setIsLoading(true);
      const req = await axios.get(`https://mern-hr-app.onrender.com/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedEmployee(req.data.employee);
      // setShowModal(true);
    } catch (error) {
      setError("Error fetching task details");
    } finally {
      setIsLoading(false);
    }
  };
  const handleRowClick = (employeeId) => {
    getEmployeeById(employeeId);
  };
  function login(user) {
    setUser(user);
  }
  // logout ftn
  const logout = () => {
    setUser(null);
    localStorage.removeItem("hr-token");
  };

  const getCounts = async () => {
    try {
      const req = await axios.get(
        "https://mern-hr-app.onrender.com/api/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // const res = await req.json();
      // console.log(req.data.eventLenght);

      setData(req.data.eventLenght);
    } catch (error) {}
  };

  //  apply for leave ftn

  const createLeave = async (leaveData) => {
    try {
      
      const req = await fetch("https://mern-hr-app.onrender.com/api/leave/apply", {
        method:"POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`,
  
        },
        body: JSON.stringify(leaveData),
      });
      const res = await req.json()
      if(!res.success){
        toast.error(res.errMsg)
      }
      if(res.success){
        toast.success(res.message)
        getLeaveHistory()
      }
      // console.log(token);
      
    } catch (error) {
      console.error("Error applying for leave:", error.response ? error.response.data : error.message);

    }
  };
// employee History
 async function getLeaveHistory (){
    try {
      const req = await axios.get("https://mern-hr-app.onrender.com/api/leave/employee/leaves",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      setLeave(req.data)
    
      
    } catch (error) {
      
    }
  }

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (token) {
          const request = await axios.get(
            "https://mern-hr-app.onrender.com/api/auth/verify",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (request.data.success) {
            setUser(request.data.user);
          }
        } else {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        if (error.request && !error.request.error) {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    verifyUser();
    getCounts();
    getLeaveHistory()

  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        isLoading,
        data,
        getCounts,
        createLeave,
        leave
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
