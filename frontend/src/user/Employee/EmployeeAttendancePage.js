import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AttendanceList from './AttendanceList';
import AttendanceCorrectionForm from './AttendanceCorrectionForm';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import '../UserDashboard.css';

function EmployeeAttendancePage() {
  const [employee, setEmployee] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError('No logged-in user found.');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:9090/api/v1/employees/by-userid/${userId}`)
      .then((res) => setEmployee(res.data))
      .catch(() => setError('Failed to fetch data.'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleModalClose = () => setShowModal(false);
  const handleCorrectionSuccess = () => {
    setShowModal(false);
    setRefreshFlag((prev) => !prev);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error || !employee)
    return <div className="text-danger text-center mt-5">{error || 'Employee not found.'}</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand mb-4">EmpowerDesk User </div>
        <nav>
          <Link to="/user/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/user/profile" className="nav-item">My Profile</Link>
          <Link to="/user/apply-leave" className="nav-item">Apply Leave</Link>
          <Link to="/user/leave-status" className="nav-item">Leave Status</Link>
          <Link to="/user/attendance" className="nav-item active ">
            
            Attendance
          </Link><br></br>
          <button className="logout-btn mt-4" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: '6px' }} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content px-4 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-primary">My Attendance</h3>
          <Button variant="outline-primary" onClick={() => setShowModal(true)}>
            Request Correction
          </Button>
        </div>

        <div className="mb-3">
          <strong>Name:</strong> {employee.firstName} {employee.lastName} <br />
          <strong>Email:</strong> {employee.emailId}
        </div>

        <AttendanceList employeeId={employee.id} refreshFlag={refreshFlag} />

        {/* Correction Modal */}
        <Modal show={showModal} onHide={handleModalClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Attendance Correction Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AttendanceCorrectionForm
              employeeId={employee.id}
              onSuccess={handleCorrectionSuccess}
              handleClose={handleModalClose}
            />
          </Modal.Body>
        </Modal>
      </main>
    </div>
  );
}

export default EmployeeAttendancePage;
