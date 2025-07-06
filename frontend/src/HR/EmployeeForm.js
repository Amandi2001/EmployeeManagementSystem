import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeForm = ({ editingEmployee, cancelEdit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (editingEmployee) {
      setFirstName(editingEmployee.firstName || "");
      setLastName(editingEmployee.lastName || "");
      setEmailId(editingEmployee.emailId || "");
      setPhoneNumber(editingEmployee.phoneNumber || "");
      setDepartment(editingEmployee.department || "");
      setDesignation(editingEmployee.designation || "");
      setJoiningDate(editingEmployee.joiningDate || "");
    } else {
      resetForm();
    }
  }, [editingEmployee]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmailId("");
    setPhoneNumber("");
    setDepartment("");
    setDesignation("");
    setJoiningDate("");
    setProfilePicture(null);
    setResumeFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employee = {
      firstName,
      lastName,
      emailId,
      phoneNumber,
      department,
      designation,
      joiningDate,
    };

    const formData = new FormData();
    formData.append("employee", new Blob([JSON.stringify(employee)], { type: "application/json" }));
    if (profilePicture) formData.append("profilePicture", profilePicture);
    if (resumeFile) formData.append("resumeFile", resumeFile);

    try {
      // <-- Remove manual Content-Type header here! Let browser set it
      const res = await axios.post("http://localhost:9090/api/v1/employees/upload", formData);
      alert("Employee saved!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save employee.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "480px", margin: "auto" }}>
      <h3 className="mb-4 text-center">
        {editingEmployee ? "Edit Employee" : "Add Employee"}
      </h3>

      {/* Your inputs here (same as before) */}
      {/* Example for first name */}
      <div className="row g-3 mb-3">
        <div className="col">
          <label className="form-label">First Name</label>
          <input type="text" className="form-control" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="col">
          <label className="form-label">Last Name</label>
          <input type="text" className="form-control" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      {/* Other inputs follow the same pattern */}
      {/* ... */}

      <div className="mb-3">
        <label className="form-label">Profile Picture</label>
        <input type="file" className="form-control" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
        {profilePicture && <img src={URL.createObjectURL(profilePicture)} alt="preview" style={{ maxHeight: "80px", marginTop: "10px" }} />}
      </div>

      <div className="mb-4">
        <label className="form-label">Resume File</label>
        <input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
      </div>

      <div className="d-flex justify-content-center gap-2">
        <button type="submit" className="btn btn-primary px-4">{editingEmployee ? "Update" : "Add"}</button>
        {editingEmployee && <button type="button" onClick={cancelEdit} className="btn btn-secondary px-4">Cancel</button>}
      </div>
    </form>
  );
};

export default EmployeeForm;
