import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeSalaryHistory.css";

const EmployeeSalaryHistory = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId"); // Set this on login

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const res = await axios.get(`/api/v1/salaries/employee/${userId}`);
        setSalaries(res.data);
      } catch (err) {
        console.error("Error loading salary data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-salary-container">
      <h2>Your Salary History</h2>
      {salaries.length === 0 ? (
        <p>No salary records found.</p>
      ) : (
        <table className="salary-table">
          <thead>
            <tr>
              <th>Pay Grade</th>
              <th>Gross Salary</th>
              <th>Net Salary</th>
              <th>Pay Date</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((sal) => (
              <tr key={sal.id}>
                <td>{sal.payGrade?.gradeName || "-"}</td>
                <td>{sal.grossSalary}</td>
                <td>{sal.netSalary}</td>
                <td>{new Date(sal.payDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeSalaryHistory;
