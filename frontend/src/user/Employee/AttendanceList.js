import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table, Form, Button, Row, Col } from "react-bootstrap";

function AttendanceList({ employeeId, refreshFlag }) {
  const [attendance, setAttendance] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);
    setFromDate(firstDay);
    setToDate(lastDay);
  }, []);

  const fetchAttendance = useCallback(() => {
    if (!employeeId || !fromDate || !toDate) return;
    setLoading(true);

    axios
      .get(`http://localhost:9090/api/v1/attendance/employee/${employeeId}`, {
        params: { from: fromDate, to: toDate },
      })
      .then((res) => setAttendance(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [employeeId, fromDate, toDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance, refreshFlag]);

  return (
    <>
      <Form className="mb-3">
        <Row className="g-3 align-items-end">
          <Col xs={12} md={4}>
            <Form.Group controlId="fromDate">
              <Form.Label>From</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="toDate">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Button className="w-100" variant="primary" onClick={fetchAttendance}>
              Filter Records
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="table-responsive">
        <Table bordered hover className="table-striped align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
              <th>Correction Note</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-muted">Loading...</td>
              </tr>
            ) : attendance.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-muted">No attendance records found</td>
              </tr>
            ) : (
              attendance.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.date}</td>
                  <td>{rec.checkInTime || "-"}</td>
                  <td>{rec.checkOutTime || "-"}</td>
                  <td>
                    <span className={`badge ${rec.status === "PRESENT" ? "bg-success" : "bg-warning text-dark"}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td>{rec.correctionNote || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default AttendanceList;
