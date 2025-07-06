import React, { useState } from 'react';
import axios from 'axios';

function AttendanceCorrectionForm({ employeeId }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [checkInTime, setCheckInTime] = useState('09:00:00');
  const [checkOutTime, setCheckOutTime] = useState('17:00:00');
  const [status, setStatus] = useState('PRESENT');
  const [correctionNote, setCorrectionNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      alert("Employee ID is missing!");
      return;
    }

    const payload = {
      employee: { id: employeeId },
      date,
      checkInTime,
      checkOutTime,
      status,
      correctionNote,
    };

    try {
      const response = await axios.post('http://localhost:9090/api/v1/attendance', payload);
      alert('Attendance saved successfully.');
      console.log(response.data);
    } catch (error) {
      console.error('Save attendance error:', error.response?.data || error.message);
      alert('Error: ' + (error.response?.data || error.message));
    }
  };

  return (
    
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Check-In Time</label>
          <input type="time" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Check-Out Time</label>
          <input type="time" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={styles.input}>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="CORRECTION_PENDING">Correction Pending</option>
            <option value="CORRECTION_APPROVED">Correction Approved</option>
            <option value="CORRECTION_REJECTED">Correction Rejected</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Correction Note</label>
          <textarea value={correctionNote} onChange={e => setCorrectionNote(e.target.value)} style={styles.textarea} />
        </div>

        <button type="submit" style={styles.button}>Save Attendance</button>
      </form>
  
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#1A237E',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '18px',
  },
  label: {
    fontWeight: '600',
    marginBottom: '6px',
    display: 'block',
    color: '#212121',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    minHeight: '80px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
  },
  button: {
    marginTop: '10px',
    padding: '12px',
    backgroundColor: '#0066FF',
    color: '#fff',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default AttendanceCorrectionForm;
