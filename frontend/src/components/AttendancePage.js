import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AttendanceList from "./AttendanceList";
import AttendanceCorrectionForm from "../user/Employee/AttendanceCorrectionForm";
import { Button } from "react-bootstrap";

function AttendancePage() {
  const { user } = useAuth();
  const employeeId = user?.id;

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const openCorrectionModal = (record) => {
    setSelectedRecord(record || null);
    setShowModal(true);
  };

  const onSaved = () => {
    setRefreshFlag((prev) => !prev); // trigger refetch
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Attendance Management</h2>
      <Button
        onClick={() => openCorrectionModal(null)}
        className="mb-3"
        variant="primary"
      >
        Add Attendance Correction
      </Button>

      <AttendanceList employeeId={employeeId} refreshFlag={refreshFlag} />

      <AttendanceCorrectionForm
        show={showModal}
        onHide={() => setShowModal(false)}
        attendanceRecord={selectedRecord}
        onSaved={onSaved}
        employeeId={employeeId}
      />
    </div>
  );
}

export default AttendancePage;
