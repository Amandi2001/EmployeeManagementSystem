import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AddEmployeeWithUser from "./components/AddEmployeeWithUser";

import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

import AdminDashboard from "./components/AdminDashboard";
import HRDashboard from "./HR/HRDashboard";

import ManageEmployees from "./components/ManageEmployees";

import UserList from "./usersList/UserList";
import HRUserList from "./usersList/HrUserList";

import ApplyLeave from "./user/ApplyLeave";
import LeaveStatus from "./user/LeaveStatus";

import AdminManageLeaves from "./components/AdminManageLeaves";
import HRManageLeaves from "./HR/HRManageLeaves";

//Admin Saraly
import PayGradeForm from "./components/payroll/PayGradeForm";
import SalaryManagement from "./components/payroll/SalaryManagement";
import SalaryGenerate from "./components/payroll/SalaryGenerate";
import SalaryList from "./components/payroll/SalaryList";
//HR slary
import HRSalaryGenerate from "./HR/payroll/SalaryGenerate";
import HRSalaryList from "./HR/payroll/SalaryList";

//HR
import HRAddEmployeeWithUser from "./HR/AddEmployeeWithUser";
import HRSalaryManagement from "./HR/payroll/SalaryManagement";
import HRPayGradeForm from "./HR/payroll/PayGradeForm";
import HRAttendanceCorrectionPanel from "./HR/attendance/AttendanceCorrectionPanel";


//user
import UserDashboard from "./user/UserDashboard";
import UserProfile from "./user/UserProfile";
import EmployeeAttendancePage from "./user/Employee/EmployeeAttendancePage";
import AttendanceCorrectionPanel from "./components/attendance/AttendanceCorrectionPanel";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-employees"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <ManageEmployees />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-employee-user"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <AddEmployeeWithUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/user-list"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-leaves"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <AdminManageLeaves />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/salaries/manage"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <SalaryManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/salaries/paygrade-form"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <PayGradeForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/salaries/generate"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <SalaryGenerate />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/salaries/list"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <SalaryList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <PrivateRoute roles={["ROLE_ADMIN"]}>
              <AttendanceCorrectionPanel />
            </PrivateRoute>
          }
        />

        {/* HR routes - mirror Admin routes but roles include HR and Admin */}
        <Route
          path="/hr/dashboard"
          element={
            <PrivateRoute roles={["ROLE_HR", "ROLE_ADMIN"]}>
              <HRDashboard />
            </PrivateRoute>
          }
        />
      
        <Route
          path="/hr/add-employee-user"
          element={
            <PrivateRoute roles={["ROLE_HR", "ROLE_ADMIN"]}>
              <HRAddEmployeeWithUser/>
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/user-list"
          element={
            <PrivateRoute roles={["ROLE_HR", "ROLE_ADMIN"]}>
              <HRUserList />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/manage-leaves"
          element={
            <PrivateRoute roles={["ROLE_HR", "ROLE_ADMIN"]}>
              <HRManageLeaves />
            </PrivateRoute>
          }
        />

       
        <Route
          path="/hr/salaries/manage"
          element={
            <PrivateRoute roles={["ROLE_HR", "ROLE_ADMIN"]}>
              <HRSalaryManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/salaries/paygrade-form"
          element={
            <PrivateRoute roles={["ROLE_HR", "ROLE_ADMIN"]}>
              <HRPayGradeForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/salaries/generate"
          element={
            <PrivateRoute roles={["ROLE_HR", "ROLE_ADMIN"]}>
              <HRSalaryGenerate />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/salaries/list"
          element={
            <PrivateRoute roles={["ROLE_HR", "ROLE_ADMIN"]}>
              <HRSalaryList />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <PrivateRoute roles={["ROLE_HR", "ROLE_ADMIN"]}>
              <HRAttendanceCorrectionPanel />
            </PrivateRoute>
          }
        />

        {/* User routes */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute roles={["ROLE_USER"]}>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <PrivateRoute roles={["ROLE_USER"]}>
              <UserProfile />
            </PrivateRoute>
          }
        />
        {/* Removed user add-employee route */}
        <Route
          path="/user/apply-leave"
          element={
            <PrivateRoute roles={["ROLE_USER"]}>
              <ApplyLeave />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/leave-status"
          element={
            <PrivateRoute roles={["ROLE_USER"]}>
              <LeaveStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/attendance"
          element={
            <PrivateRoute roles={["ROLE_USER"]}>
              <EmployeeAttendancePage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
