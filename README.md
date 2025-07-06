# 🧑‍💼 Employee Management System (Spring Boot + React)

A full-stack role-based employee management system built using **Spring Boot** (backend) and **React.js** (frontend). The system is designed for organizations to manage employees, HR activities, attendance, leaves, and payrolls efficiently.

---

## 🔐 Role-Based Access

| Role      | Permissions |
|-----------|-------------|
| **Admin** | Full access: Manage users, employees, attendance, leaves, and payroll |
| **HR**    | Same as Admin (except managing users) |
| **Employee/User** | View profile, request leave, view salary, send attendance correction |

---

## 🎯 Features

### 🔒 Authentication
- Role-based login system with database-based credentials.

### 👨‍💼 Admin / HR Panel
- Add, view, edit, and delete **employees**
- Manage **users** (admin only)
- Handle **leave requests**
- Mark and update **attendance**
- Manage **monthly payroll**

### 👷‍♂️ Employee Panel
- View personal **profile**
- Send **attendance correction requests**
- Apply for **leave**
- View **monthly salary**

---

## 🛠️ Tech Stack

### Backend (Spring Boot)
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL 
- REST API

### Frontend (React.js)
- React with Hooks
- Axios for API calls
- React Router DOM for navigation
- Bootstrap for styling

