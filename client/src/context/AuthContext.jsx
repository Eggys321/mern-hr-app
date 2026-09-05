import React, { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import apiClient from "../utils/apiClient";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [leave,setLeave] = useState([]);
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("hr-token");

  function login(user) {
    setUser(user);
  }
  const logout = () => {
    setUser(null);
    localStorage.removeItem("hr-token");
  };

  const getCounts = async () => {
    try {
      const req = await apiClient.get("/api/count");
      setData(req.data.eventLenght);
    } catch (error) {}
  };

  const createLeave = async (leaveData) => {
    try {
      const res = await apiClient.post("/api/leave/apply", leaveData);
      if (res.data.success) {
        toast.success(res.data.message);
        getLeaveHistory();
        return true;
      }
      toast.error(res.data.errMsg);
      return false;
    } catch (error) {
      toast.error(error.response?.data?.errMsg || "Failed to apply for leave");
      return false;
    }
  };

  async function getLeaveHistory() {
    try {
      const req = await apiClient.get("/api/leave/employee/leaves");
      setLeave(req.data);
    } catch (error) {}
  }

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (token) {
          const request = await apiClient.get("/api/auth/verify");

          if (request.data.success) {
            setUser(request.data.user);
          }
        } else {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    verifyUser();
    // Both of these hit endpoints that need a logged-in user (one is even
    // admin-only) - calling them unconditionally meant every visit to the
    // sign-in page (no token yet) fired two doomed requests that just
    // logged CORS/401 errors to the console for nothing.
    if (token) {
      getCounts();
      getLeaveHistory();
    }
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
