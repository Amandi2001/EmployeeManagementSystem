import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import {
  FaUsers,
  FaCalendarAlt,
  FaHourglassHalf,
  FaSignOutAlt,
  FaClock,
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
import "react-calendar/dist/Calendar.css";
import "./HRDashboard.css";

const COLORS = ["#4f46e5", "#f97316", "#16a34a"];

const AdminDashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);
  const [approvedLeaveCount, setApprovedLeaveCount] = useState(0);
  const [pendingAttendanceCount, setPendingAttendanceCount] = useState(0);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const empRes = await axios.get("http://localhost:9090/api/v1/employees/count");
        const leaveRes = await axios.get("http://localhost:9090/api/leaves/count");
        const pendingRes = await axios.get("http://localhost:9090/api/leaves/count/pending");
        const approvedRes = await axios.get("http://localhost:9090/api/leaves/count/approved");
        const pendingAttendanceRes = await axios.get("http://localhost:9090/api/v1/attendance/count/pending");

        setEmployeeCount(empRes.data);
        setLeaveCount(leaveRes.data);
        setPendingLeaveCount(pendingRes.data);
        setApprovedLeaveCount(approvedRes.data);
        setPendingAttendanceCount(pendingAttendanceRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("http://localhost:9090/api/v1/attendance/corrections");
        setAttendanceRecords(res.data);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };
    fetchAttendance();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:9090/api/v1/attendance/corrections/${id}/status?status=CORRECTION_APPROVED`);
      setAttendanceRecords((prev) => prev.filter((a) => a.id !== id));
      setPendingAttendanceCount((count) => count - 1);
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:9090/api/v1/attendance/corrections/${id}/status?status=CORRECTION_REJECTED`);
      setAttendanceRecords((prev) => prev.filter((a) => a.id !== id));
      setPendingAttendanceCount((count) => count - 1);
    } catch (error) {
      console.error("Rejection failed", error);
    }
  };

  const leaveChartData = [
    {
      name: "Leave Requests",
      total: leaveCount,
      pending: pendingLeaveCount,
      approved: approvedLeaveCount,
    },
  ];

  return (
    <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh" }}>
      <aside className="sidebar">
        <div className="brand">EmpowerDesk HR</div>
        <nav>
          <Link to="/hr/dashboard" className="nav-item active">Dashboard</Link>
          <Link to="/hr/add-employee-user" className="nav-item">Add Employee & User</Link>
           
          <Link to="/hr/user-list" className="nav-item">User Management</Link>
          <Link to="/hr/manage-leaves" className="nav-item">Leave Requests</Link>
          <Link to="/hr/attendance" className="nav-item">Attendance Corrections</Link>
          <Link to="/hr/salaries/manage" className="nav-item">Salary Management</Link>
          <Link to="/hr/salaries/paygrade-form" className="nav-item">Paygrade Form</Link>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      <main className="main-content" style={{ flexGrow: 1, padding: "30px 40px", backgroundColor: "#f9fafb", overflowY: "auto" }}>
        <h2 style={{ fontWeight: "700", fontSize: "1.8rem", marginBottom: "30px", color: "#1e293b" }}>Dashboard Overview</h2>

        <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px" }}>
          <StatCard color="#4338ca" bg="#eef2ff" icon={<FaUsers size={36} />} value={employeeCount} label="Total Employees" />
          <StatCard color="#c2410c" bg="#ffedd5" icon={<FaCalendarAlt size={36} />} value={leaveCount} label="Total Leave Requests" />
          <StatCard color="#a16207" bg="#fef3c7" icon={<FaHourglassHalf size={36} />} value={pendingLeaveCount} label="Pending Leave Requests" />
          <StatCard color="#15803d" bg="#dcfce7" icon={<FaCalendarAlt size={36} />} value={approvedLeaveCount} label="Approved Leave Requests" />
          <StatCard color="#0284c7" bg="#e0f2fe" icon={<FaClock size={36} />} value={pendingAttendanceCount} label="Pending Attendance Corrections" />
        </div>

        <div className="attendance-section" style={{ marginTop: "50px", backgroundColor: "white", borderRadius: "14px", padding: "25px 30px", boxShadow: "0 8px 20px rgb(0 0 0 / 0.08)" }}>
          <h3 style={{ marginBottom: "20px", color: "#1e293b", fontWeight: "700" }}>Pending Attendance Corrections</h3>
          {attendanceRecords.filter(a => a.status === 'CORRECTION_PENDING').length === 0 ? (
            <p style={{ fontSize: "1rem", color: "#64748b" }}>No pending corrections.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#475569", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
                  <th style={{ padding: "12px 15px" }}>Employee</th>
                  <th style={{ padding: "12px 15px" }}>Date</th>
                  <th style={{ padding: "12px 15px" }}>Check-In</th>
                  <th style={{ padding: "12px 15px" }}>Check-Out</th>
                  <th style={{ padding: "12px 15px" }}>Note</th>
                  <th style={{ padding: "12px 15px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.filter(a => a.status === 'CORRECTION_PENDING').map((a) => (
                  <tr key={a.id} style={{ borderBottom: "1px solid #e2e8f0", cursor: "default" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f9ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                    <td style={{ padding: "10px 15px" }}>{a.employee?.firstName} {a.employee?.lastName}</td>
                    <td style={{ padding: "10px 15px" }}>{a.date}</td>
                    <td style={{ padding: "10px 15px" }}>{a.checkInTime || "N/A"}</td>
                    <td style={{ padding: "10px 15px" }}>{a.checkOutTime || "N/A"}</td>
                    <td style={{ padding: "10px 15px" }}>{a.correctionNote}</td>
                    <td style={{ padding: "10px 15px" }}>
                      <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(a.id)}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleReject(a.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="content-row" style={{ display: "flex", gap: "40px", marginTop: "50px", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div className="calendar-card" style={{ flex: "1 1 300px", backgroundColor: "white", borderRadius: "14px", padding: "20px", boxShadow: "0 8px 20px rgb(0 0 0 / 0.08)", height: "fit-content" }}>
            <h5 style={{ marginBottom: "15px", fontWeight: "700", color: "#334155", textAlign: "center" }}>📅 Calendar</h5>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
            <p style={{ textAlign: "center", marginTop: "10px", fontWeight: "600", color: "#475569" }}>
              Selected date: {selectedDate.toLocaleDateString()}
            </p>
          </div>

          <div style={{ flex: "2 1 600px", minWidth: "320px", backgroundColor: "white", borderRadius: "14px", padding: "25px 30px", boxShadow: "0 8px 20px rgb(0 0 0 / 0.08)" }}>
            <h5 style={{ marginBottom: "20px", fontWeight: "700", color: "#1e293b", textAlign: "center" }}>
              Leave Requests Comparison
            </h5>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={leaveChartData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }} barCategoryGap="40%">
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontWeight: "600" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontWeight: "600" }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", borderColor: "#94a3b8" }} cursor={{ fill: "#e0e7ff" }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="total" fill={COLORS[0]} radius={[8, 8, 0, 0]} barSize={40} name="Total" />
                <Bar dataKey="pending" fill={COLORS[1]} radius={[8, 8, 0, 0]} barSize={40} name="Pending" />
                <Bar dataKey="approved" fill={COLORS[2]} radius={[8, 8, 0, 0]} barSize={40} name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, value, label, bg, color }) => (
  <div style={{ backgroundColor: bg, color, boxShadow: `0 4px 12px ${color}40`, borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
    {icon}
    <div>
      <h3 style={{ margin: 0, fontWeight: "700" }}>{value}</h3>
      <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem" }}>{label}</p>
    </div>
  </div>
);

export default AdminDashboard;
