# Roles and Responsibilities: StaffSync HRM

This document outlines the standard operational roles and specific responsibilities defined within the **StaffSync Human Resource Management (HRM)** platform.

---

## 1. Manage Employee Records Efficiently
- **Primary Stakeholders**: HR Personnel & System Administrators
- **Responsibilities**:
  - Creating new employee profiles with initial authentication credentials, departments, and titles.
  - Viewing organizational directories and filtering personnel by roles or departments.
  - Updating employee records upon promotions, role shifts, or department transfers.
  - Deactivating or removing records to maintain clean organizational records and offboarding compliance.
- **System Touchpoints**:
  - `POST /api/employees` (Create employee)
  - `GET /api/employees` (Directory query)
  - `PUT /api/employees/:id` (Record updates)
  - `DELETE /api/employees/:id` (Deactivation)

---

## 2. Handle Leave Management Processes
- **Primary Stakeholders**: Employees, Managers, and HR Personnel
- **Responsibilities**:
  - **Employees**: Apply for leaves digitally with transparent types, start dates, end dates, and justifications.
  - **Managers & HR Personnel**: Review incoming applications, evaluate departmental staffing requirements, and approve or reject leave requests with constructive feedback.
- **System Touchpoints**:
  - `POST /api/leaves` (Submit leave request)
  - `GET /api/leaves` (View personal or departmental leave queues)
  - `PUT /api/leaves/:id/status` (Approve or reject with comments)

---

## 3. Track and Monitor Attendance
- **Primary Stakeholders**: Employees and HR Personnel
- **Responsibilities**:
  - **Employees**: Record daily attendance through punctual clock-in upon starting shifts and clock-out upon completing shifts.
  - **HR Personnel & Managers**: Monitor real-time clock-in logs, track lateness patterns, generate attendance summaries, and verify data for payroll processing and performance evaluations.
- **System Touchpoints**:
  - `POST /api/attendance/clock-in` (Daily arrival recording)
  - `POST /api/attendance/clock-out` (Departure & hours computation)
  - `GET /api/attendance` (Historical records and departmental logs)

---

## 4. Manage Training and Development Programs
- **Primary Stakeholders**: Managers and HR Personnel
- **Responsibilities**:
  - Creating, scheduling, and structuring training courses and workshops.
  - Assigning target departments or specific employee cohorts to skill-building initiatives.
  - Monitoring enrollment progress, course milestones, and certifications to support continuous professional growth.
- **System Touchpoints**:
  - `POST /api/training` (Create training program)
  - `GET /api/training` (View training courses and participant cohorts)
  - `PUT /api/training/:id` (Update course curriculum, progress, or status)
  - `DELETE /api/training/:id` (Remove concluded or cancelled programs)

---

## 5. Post and Review Announcements
- **Primary Stakeholders**: HR Personnel and Managers
- **Responsibilities**:
  - Creating and broadcasting organizational news, policy updates, holidays, and critical notices.
  - Setting appropriate priority classifications (`low`, `medium`, `high`) to guide urgent reader focus.
  - Departmental filtering to ensure targeted communication reaching relevant audiences.
- **System Touchpoints**:
  - `POST /api/announcements` (Publish announcement)
  - `GET /api/announcements` (View company-wide announcement bulletin)

---

## 6. Maintain Personal Employee Information
- **Primary Stakeholders**: Employees
- **Responsibilities**:
  - Updating contact details, telephone numbers, and profile avatars to guarantee accurate HR records.
  - Updating account security credentials (passwords) to maintain personal account hygiene.
  - Reviewing own profile details, designated roles, and department allocations.
- **System Touchpoints**:
  - `GET /api/auth/me` (Retrieve own user profile)
  - `PUT /api/auth/profile` (Update personal contact info and security credentials)

---

## 7. Ensure Secure Access and Authentication
- **Primary Stakeholders**: All System Users & Core Application Architecture
- **Responsibilities**:
  - Authenticating with secure credentials (email and password with bcrypt encryption).
  - Enforcing Role-Based Access Control (RBAC) middleware verifying that only authenticated and authorized users access corresponding resources.
  - Automatic session protection through signed JSON Web Tokens (JWT) and client-side route guards.
- **System Touchpoints**:
  - `POST /api/auth/login` (Secure token generation)
  - `POST /api/auth/register` (Account creation)
  - Express authorization guards: `protect` and `authorize('admin', 'manager')`

---

## Summary Matrix

| Responsibility # | Domain | Primary Actors | Secondary Actors |
|:---:|---|---|---|
| **1** | Employee Record Management | HR / Admin | Managers |
| **2** | Leave Request Processing | Employees | Managers, HR |
| **3** | Attendance Tracking & Reporting | Employees | HR, Managers |
| **4** | Training & Development Programs | Managers | HR, Employees |
| **5** | Announcements & Internal Communication | HR, Managers | All Employees |
| **6** | Personal Profile Maintenance | Employees | HR Personnel |
| **7** | Secure Access & Authentication | System / Admin | All Users |
