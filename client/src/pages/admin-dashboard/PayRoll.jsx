import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import apiClient from "../../utils/apiClient";
import { Loader } from "../../utils/Loader";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const PayRoll = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/employee/users?page=${page}&limit=10`);
        setEmployees(res.data.users || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError(err.response?.data?.errMsg || "Error fetching payroll data");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [page]);

  const totalMonthlySalary = employees.reduce((sum, employee) => sum + (employee.salary || 0), 0);

  return (
    <main className="pt-5 employee-table-wrapper employee-table-container">
      <section className="pb-4">
        <h2>Payroll</h2>
        <h5>Dashboard/Payroll</h5>
      </section>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : employees.length === 0 ? (
        <p className="text-muted py-4">No employees to show payroll for yet.</p>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-lg-4">
              <div className="border rounded p-3">
                <h6 className="text-muted mb-1">Employees (this page)</h6>
                <h3>{employees.length}</h3>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="border rounded p-3">
                <h6 className="text-muted mb-1">Total Monthly Payroll (this page)</h6>
                <h3>{currencyFormatter.format(totalMonthlySalary)}</h3>
              </div>
            </div>
          </div>

          <div className="employee-table">
            <Table responsive="sm" hover>
              <thead className="employee-table-wrapper-head">
                <tr>
                  <th><h5 className="employee-table-wrapper-h5">Name</h5></th>
                  <th><h5 className="employee-table-wrapper-h5">Department</h5></th>
                  <th><h5 className="employee-table-wrapper-h5">Job Title</h5></th>
                  <th><h5 className="employee-table-wrapper-h5">Start Date</h5></th>
                  <th><h5 className="employee-table-wrapper-h5">Status</h5></th>
                  <th><h5 className="employee-table-wrapper-h5">Salary</h5></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <div className="d-flex gap-2 align-items-center">
                        <div className="employee-profile-image">
                          <img src={employee.profileImage} alt="" />
                        </div>
                        <h6 className="employee-table-data pt-1">
                          {employee.firstName} {employee.lastName}
                        </h6>
                      </div>
                    </td>
                    <td><p className="employee-table-data">{employee.department?.name || "-"}</p></td>
                    <td><p className="employee-table-data">{employee.jobTitle}</p></td>
                    <td><p className="employee-table-data">{employee.startDate}</p></td>
                    <td>
                      <p
                        className={
                          employee.employmentStatus === "remote"
                            ? "employee-table-orange"
                            : employee.employmentStatus === "on-site"
                            ? "employee-table-green"
                            : "employee-table-blue"
                        }
                      >
                        {employee.employmentStatus}
                      </p>
                    </td>
                    <td><p className="employee-table-data">{currencyFormatter.format(employee.salary || 0)}</p></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="employee-table-pagination-wrapper row justify-content-between align-items-center">
            <div className="col-lg-6 mt-3">
              <p>Page {page} of {totalPages}</p>
            </div>
            <div className="col-lg-4 d-flex gap-5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-50">
                Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-50">
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default PayRoll;
