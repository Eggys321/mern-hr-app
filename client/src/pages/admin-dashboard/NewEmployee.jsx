import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../utils/Loader';

const NewEmployee = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin-dashboard/employees/personal-info", { replace: true });
  }, [navigate]);

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Loader />
    </div>
  );
}

export default NewEmployee
