import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaSignOutAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./UserDashboard.css";
import "./EmployeeSalaryHistory.css";

const COLORS = ["#4f46e5", "#16a34a"]; // Indigo and Green

const UserDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [leaveSummary, setLeaveSummary] = useState({ totalApplied: 0, totalApproved: 0 });
  const [loading, setLoading] = useState(true);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!userId) {
      setError("No logged-in user found.");
      setLoading(false);
      return;
    }

    // First fetch employee info by userId
    axios
      .get(`http://localhost:9090/api/v1/employees/by-userid/${userId}`)
      .then((res) => {
        const empData = res.data;
        setEmployee(empData);

        // Then fetch leave summary and salary by employee.id (numeric id)
        return Promise.all([
          axios.get(`http://localhost:9090/api/leaves/summary/${empData.id}`), // <-- use numeric id here
          axios.get(`http://localhost:9090/api/v1/salaries/employee/${empData.id}`),
        ]);
      })
      .then(([leaveRes, salaryRes]) => {
        setLeaveSummary(leaveRes.data);
        setSalaryRecords(salaryRes.data);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Failed to fetch dashboard data.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!employee) return <div className="error-msg">Employee not found.</div>;

  // Calculate total net salary paid
  const totalNetSalary = salaryRecords.reduce((sum, sal) => sum + sal.netSalary, 0);
  const leavesPending = leaveSummary.totalApplied - leaveSummary.totalApproved;

  const leaveChartData = [
    { name: "Leaves Applied", value: leaveSummary.totalApplied },
    { name: "Leaves Approved", value: leaveSummary.totalApproved },
  ];

  // Get today's date string for welcome message
  const todayString = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">EmpowerDesk User</div>
        <nav>
          <Link to="/user/dashboard" className="nav-item active">
            Dashboard
          </Link>
          <Link to="/user/profile" className="nav-item">
            My Profile
          </Link>
          <Link to="/user/apply-leave" className="nav-item">
            Apply Leave
          </Link>
          <Link to="/user/leave-status" className="nav-item">
            Leave Status
          </Link>
          <Link to="/user/attendance" className="nav-item">
            Attendance
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="main-content"
        style={{
          flexGrow: 1,
          padding: "30px 40px",
          backgroundColor: "#f9fafb",
          overflowY: "auto",
          minHeight: "100vh",
        }}
      >
        {/* Welcome + Date */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ fontWeight: "700", fontSize: "1.8rem" }}>
            Welcome, {employee.firstName} {employee.lastName}
          </h2>
          <span style={{ fontWeight: "600", color: "#64748b" }}>{todayString}</span>
        </header>

        {/* Info Cards Grid */}
        <div
          className="card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {/* Department */}
          <div
            className="card"
            style={{
              backgroundColor: "#dcfce7",
              color: "#166534",
              boxShadow: "0 4px 12px rgb(22 101 52 / 0.25)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <FaBriefcase size={40} />
            <div>
              <h3 style={{ margin: 0, fontWeight: "700" }}>{employee.department}</h3>
              <p style={{ margin: 0, fontWeight: "500", fontSize: "0.9rem" }}>Department</p>
            </div>
          </div>

          {/* Leaves Applied */}
          <div
            className="card"
            style={{
              backgroundColor: "#ede9fe",
              color: "#6b21a8",
              boxShadow: "0 4px 12px rgb(107 33 168 / 0.25)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <FaFileAlt size={40} />
            <div>
              <h3 style={{ margin: 0, fontWeight: "700" }}>{leaveSummary.totalApplied}</h3>
              <p style={{ margin: 0, fontWeight: "500", fontSize: "0.9rem" }}>Leaves Applied</p>
            </div>
          </div>

          {/* Leaves Approved */}
          <div
            className="card"
            style={{
              backgroundColor: "#d1fae5",
              color: "#065f46",
              boxShadow: "0 4px 12px rgb(6 95 70 / 0.25)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <FaCheckCircle size={40} />
            <div>
              <h3 style={{ margin: 0, fontWeight: "700" }}>{leaveSummary.totalApproved}</h3>
              <p style={{ margin: 0, fontWeight: "500", fontSize: "0.9rem" }}>Leaves Approved</p>
            </div>
          </div>

          {/* Pending Leaves */}
          <div
            className="card"
            style={{
              backgroundColor: "#fff7ed",
              color: "#c2410c",
              boxShadow: "0 4px 12px rgb(194 65 12 / 0.25)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <FaFileAlt size={40} />
            <div>
              <h3 style={{ margin: 0, fontWeight: "700" }}>{leavesPending}</h3>
              <p style={{ margin: 0, fontWeight: "500", fontSize: "0.9rem" }}>Leaves Pending</p>
            </div>
          </div>

          {/* Total Salary Paid */}
          <div
            className="card"
            style={{
              backgroundColor: "#e0f2fe",
              color: "#0369a1",
              boxShadow: "0 4px 12px rgb(3 105 161 / 0.25)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <FaMoneyBillWave size={40} />
            <div>
              <h3 style={{ margin: 0, fontWeight: "700" }}>Rs. {totalNetSalary.toFixed(2)}</h3>
              <p style={{ margin: 0, fontWeight: "500", fontSize: "0.9rem" }}>Total Net Salary Paid</p>
            </div>
          </div>
        </div>

        {/* Charts and Calendar Section */}
        <div
          className="content-row"
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "40px",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {/* Leave Bar Chart */}
          <div
            style={{
              flex: "2 1 600px",
              minWidth: "320px",
              backgroundColor: "white",
              borderRadius: "14px",
              boxShadow: "0 8px 20px rgb(0 0 0 / 0.08)",
              padding: "25px 30px",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                fontWeight: "700",
                color: "#1e293b",
                textAlign: "center",
              }}
            >
              Leave Comparison
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={leaveChartData}
                margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
                barCategoryGap="40%"
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontWeight: "600" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#64748b", fontWeight: "600" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", borderColor: "#94a3b8" }}
                  cursor={{ fill: "#e0e7ff" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="value" fill={COLORS[0]} radius={[8, 8, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Calendar */}
          <div
            className="calendar-container"
            style={{
              flex: "1 1 280px",
              borderRadius: "14px",
              padding: "20px",
              backgroundColor: "white",
              boxShadow: "0 8px 20px rgb(0 0 0 / 0.08)",
              height: "fit-content",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "15px",
                fontWeight: "700",
                color: "#334155",
              }}
            >
              Calendar
            </h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date }) =>
                date.toDateString() === selectedDate.toDateString()
                  ? "react-calendar__tile--active"
                  : null
              }
            />
            <p
              style={{
                textAlign: "center",
                marginTop: "10px",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              Selected date: {selectedDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Salary History */}
        <div
          className="user-salary-container mt-4"
          style={{
            marginTop: "50px",
            backgroundColor: "white",
            padding: "25px 30px",
            borderRadius: "14px",
            boxShadow: "0 8px 20px rgb(0 0 0 / 0.08)",
          }}
        >
          <h2
            style={{
              fontWeight: "700",
              marginBottom: "20px",
              color: "#1e293b",
            }}
          >
            <FaMoneyBillWave className="me-2" /> Your Salary History
          </h2>
          {salaryRecords.length === 0 ? (
            <p style={{ fontSize: "1rem", color: "#64748b" }}>
              No salary records found.
            </p>
          ) : (
            <table
              className="salary-table"
              style={{
                width: "100%",
                marginTop: "10px",
                borderCollapse: "collapse",
                fontSize: "0.95rem",
                color: "#475569",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f1f5f9",
                    textAlign: "left",
                    borderBottom: "2px solid #cbd5e1",
                  }}
                >
                  <th style={{ padding: "12px 15px" }}>Pay Grade</th>
                  <th style={{ padding: "12px 15px" }}>Gross Salary</th>
                  <th style={{ padding: "12px 15px" }}>Net Salary</th>
                  <th style={{ padding: "12px 15px" }}>Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {salaryRecords.map((sal) => (
                  <tr
                    key={sal.id}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f0f9ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td style={{ padding: "10px 15px" }}>{sal.payGradeName || "-"}</td>
                    <td style={{ padding: "10px 15px" }}>{sal.grossSalary}</td>
                    <td style={{ padding: "10px 15px" }}>{sal.netSalary}</td>
                    <td style={{ padding: "10px 15px" }}>
                      {new Date(sal.payDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
