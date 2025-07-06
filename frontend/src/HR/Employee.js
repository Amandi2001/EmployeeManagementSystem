import React from "react";

const Employee = ({ employee, onEdit, onDelete }) => {
  return (
    <tr>
      <td>{employee.id}</td>
      <td>{employee.firstName}</td>
      <td>{employee.lastName}</td>
      <td>{employee.emailId}</td>
      <td>{employee.phoneNumber || "-"}</td>
      <td>{employee.department || "-"}</td>
      <td>{employee.designation || "-"}</td>
      <td>
        {employee.joiningDate
          ? new Date(employee.joiningDate).toLocaleDateString()
          : "-"}
      </td>
      <td>
        <button
          className="btn btn-warning btn-sm me-2"
          onClick={() => onEdit(employee)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(employee.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Employee;
