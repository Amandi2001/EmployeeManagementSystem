import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table, Form, Button } from "react-bootstrap";

function AttendanceList({ employeeId, refreshFlag }) {
  const [attendance, setAttendance] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Automatically set current month range
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10);
    setFromDate(firstDay);
    setToDate(lastDay);
  }, []);

  // Fetch function
  const fetchAttendance = useCallback(() => {
    if (!employeeId || !fromDate || !toDate) return;

    setLoading(true);
    axios
      .get("/attendance", {
        params: { employeeId, from: fromDate, to: toDate },
      })
      .then((res) => {
        setAttendance(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [employeeId, fromDate, toDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance, refreshFlag]);

  return (
    <div>
      <h3>Attendance Records</h3>
      <Form className="mb-3 d-flex gap-3 align-items-center flex-wrap">
        <Form.Group>
          <Form.Label>From:</Form.Label>
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ maxWidth: "180px" }}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>To:</Form.Label>
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ maxWidth: "180px" }}
          />
        </Form.Group>

        <Button variant="primary" onClick={fetchAttendance}>
          Filter
        </Button>
      </Form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Correction Note</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendance.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.date}</td>
                  <td>{rec.checkInTime || "-"}</td>
                  <td>{rec.checkOutTime || "-"}</td>
                  <td>{rec.status}</td>
                  <td>{rec.correctionNote || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default AttendanceList;
