# ER-DIAGRAM Specification: StaffSync HRM

## 1. Overview & Architecture
The **Entity-Relationship Diagram (ERD)** represents the core data structure of the **Human Resource Management System (HRM)**. It defines how various entities such as **Employee**, **Manager**, **LeaveRequest**, **Attendance**, and **Announcement** (along with extended entities like **Training**) are related and organized within the database.

![HRM ER Diagram](./architecture/erd-diagram.svg)

---

## 2. Interactive Mermaid ER Diagram

```mermaid
erDiagram
    EMPLOYEE ||--o{ LEAVE_REQUEST : "submits"
    MANAGER ||--o{ LEAVE_REQUEST : "approves / rejects"
    EMPLOYEE ||--o{ ATTENDANCE : "records daily"
    MANAGER ||--o{ ANNOUNCEMENT : "posts"
    MANAGER ||--o{ TRAINING : "creates & assigns"
    EMPLOYEE }o--o{ TRAINING : "participates in"

    EMPLOYEE {
        ObjectId EmployeeID PK "Unique Employee identifier"
        string FirstName "Employee first name"
        string LastName "Employee last name"
        string Email "Work email address (unique)"
        string Password "Hashed bcrypt credential"
        string Role "employee / manager / admin"
        string Department "Department name"
        string Position "Job title / Designation"
        string Phone "Contact phone number"
        boolean IsActive "Account status flag"
    }

    MANAGER {
        ObjectId ManagerID PK "Unique Manager identifier"
        string FirstName "Manager first name"
        string LastName "Manager last name"
        string Email "Work email address (unique)"
        string Role "manager / admin"
        string Department "Department supervised"
    }

    LEAVE_REQUEST {
        ObjectId LeaveRequestID PK
        ObjectId EmployeeID FK "Reference to Employee"
        string LeaveType "annual, sick, casual, maternity, unpaid"
        date StartDate "Leave start date"
        date EndDate "Leave end date"
        string Reason "Employee explanation"
        string Status "pending | approved | rejected"
        ObjectId ApproverID FK "Manager who approved/rejected"
        string Comments "Approver remarks / feedback"
    }

    ATTENDANCE {
        ObjectId AttendanceID PK
        ObjectId EmployeeID FK "Reference to Employee"
        date Date "Attendance date (midnight anchor)"
        date ClockIn "Timestamp of clock-in"
        date ClockOut "Timestamp of clock-out"
        string Status "present | absent | late | half-day"
        number TotalHours "Computed working hours"
    }

    ANNOUNCEMENT {
        ObjectId AnnouncementID PK
        string Title "Subject / Headline"
        string Content "Full broadcast message"
        ObjectId AuthorID FK "Manager or Admin author"
        string TargetDepartment "Target audience (All or specific)"
        string Priority "low | medium | high"
        date CreatedAt "Publication timestamp"
    }

    TRAINING {
        ObjectId TrainingID PK
        string Title "Program title"
        string Description "Curriculum & objectives"
        string Trainer "Instructor / L&D lead"
        string Department "Target department or All"
        ObjectId CreatedBy FK "Manager author"
        date StartDate "Commencement date"
        date EndDate "Conclusion date"
        string Status "upcoming | in-progress | completed"
    }
```

---

## 3. Explanation of Core Entities & Attributes

### 1. Employee Entity
- **Attributes**:
  - `EmployeeID` (Primary Key, MongoDB `_id`): Unique identifier for each employee.
  - `FirstName`: The employee's first name.
  - `LastName`: The employee's last name.
  - Extended fields: `email`, `department`, `position`, `phone`, `role`.
- **Functionality**:
  - Each employee can submit multiple leave requests.
  - Each employee has associated daily attendance records.
  - Can participate in training programs and update personal profile records.

### 2. Manager Entity
- **Attributes**:
  - `ManagerID` (Primary Key, MongoDB `_id`): Unique identifier for each manager.
  - `FirstName`: The manager's first name.
  - `LastName`: The manager's last name.
  - Extended fields: `department`, `position`, `role`.
- **Functionality**:
  - A manager can review, approve, or reject leave requests submitted by employees.
  - A manager can post organization-wide and department announcements.
  - A manager can create, schedule, and assign training and development programs.

### 3. LeaveRequest Entity
- **Attributes**:
  - `StartDate`: Beginning date of requested leave.
  - `EndDate`: Concluding date of requested leave.
  - `Status`: Current state of the application (`pending`, `approved`, `rejected`).
  - Extended fields: `leaveType` (annual, sick, casual, maternity, etc.), `reason`, `approver`, `comments`.
- **Functionality**:
  - Represents a leave application submitted by an employee.
  - Approved or rejected by a manager with optional review notes.

### 4. Attendance Entity
- **Attributes**:
  - `Date`: Calendar day of the attendance record.
  - Extended fields: `clockIn`, `clockOut`, `status` (`present`, `late`, `half-day`, `absent`), `totalHours`.
- **Functionality**:
  - Keeps track of the daily attendance records of each employee.
  - Automatically assesses punctuality (e.g. arrivals after 9:30 AM marked as `late`).
  - Calculates total worked hours upon clock-out.

### 5. Announcement Entity
- **Attributes**:
  - `Title`: Announcement subject.
  - `Content`: Detailed communication body.
  - Extended fields: `author`, `targetDepartment`, `priority` (`low`, `medium`, `high`).
- **Functionality**:
  - Represents organization-wide news or departmental updates posted by managers or HR personnel.

---

## 4. Entity Relationships Matrix

| Source Entity | Relationship Verb | Target Entity | Cardinality | Business Rule |
|---|---|---|---|---|
| **Employee** | Submits | **LeaveRequest** | 1 to Many (1:N) | An employee can submit multiple leave requests over time. |
| **Manager** | Approves / Rejects | **LeaveRequest** | 1 to Many (1:N) | A manager reviews and approves/rejects leave requests submitted by employees. |
| **Manager** | Posts | **Announcement** | 1 to Many (1:N) | A manager publishes announcements for organizational communication. |
| **Employee** | Records | **Attendance** | 1 to Many (1:N) | An employee records daily attendance with clock-in and clock-out entries. |
| **Manager** | Assigns | **Training** | 1 to Many (1:N) | Managers create and assign professional development programs. |
| **Employee** | Participates in | **Training** | Many to Many (N:M) | Employees enroll in or are assigned to multiple training modules. |

---

## 5. Implementation Mapping to Mongoose Models

In the StaffSync codebase, these entities are implemented with clean schema definitions and virtual properties in [`server/src/models`](file:///c:/Users/ASUS/Downloads/StaffSync%20(2)/StaffSync/server/src/models):
- [`User.js`](file:///c:/Users/ASUS/Downloads/StaffSync%20(2)/StaffSync/server/src/models/User.js): Implements `Employee` and `Manager` entities with polymorphic `role` enum (`employee`, `manager`, `admin`), along with virtual accessors for `firstName`, `lastName`, `EmployeeID`, and `ManagerID`.
- [`LeaveRequest.js`](file:///c:/Users/ASUS/Downloads/StaffSync%20(2)/StaffSync/server/src/models/LeaveRequest.js): Implements the leave request entity with references to `user` (Employee) and `approver` (Manager).
- [`Attendance.js`](file:///c:/Users/ASUS/Downloads/StaffSync%20(2)/StaffSync/server/src/models/Attendance.js): Implements daily attendance records tied to Employee with automatic duration computations.
- [`Announcement.js`](file:///c:/Users/ASUS/Downloads/StaffSync%20(2)/StaffSync/server/src/models/Announcement.js): Implements company-wide announcements with author attribution and priority flags.
- [`Training.js`](file:///c:/Users/ASUS/Downloads/StaffSync%20(2)/StaffSync/server/src/models/Training.js): Implements training & development programs with assigned employees and lifecycle tracking.
