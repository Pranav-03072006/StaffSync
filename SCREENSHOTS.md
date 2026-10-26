# StaffSync Application Screenshots & UI Showcase

The canonical document is maintained at [`docs/SCREENSHOTS.md`](./docs/SCREENSHOTS.md).

This document catalogs the verified, running user interface screens for the **StaffSync Human Resource Management (HRM)** platform across all primary workflow modules.

---

## 1. Executive Operations Dashboard
- **Route**: [`/dashboard`](http://localhost:5173/dashboard)
- **Role Perspective**: Admin / HR Management
- **Key Elements**:
  - Personalized welcome banner with real-time shift clock status (`Clocked Out` / `Clock In`).
  - Organizational KPI counters: Total Employees (`3`), Pending Leave Requests (`0`), Active Announcements (`1`).
  - Module navigation cards providing one-click access to Directory, Leave Management, Attendance Tracking, and Announcements.

![StaffSync Operations Dashboard](./screenshots/01_dashboard.png)

---

## 2. Employee Directory & Personnel Roster
- **Route**: [`/employees`](http://localhost:5173/employees)
- **Role Perspective**: Admin / Manager
- **Key Elements**:
  - Searchable directory filtering personnel by name, email, or department.
  - Profile cards showing initial avatars, role badges (`Employee`, `Manager`, `Admin`), department designations, and direct email contacts.
  - Interactive Action buttons for editing credentials and deactivating accounts.

![Employee Directory](./screenshots/03_employee_directory.png)

---

## 3. Provisioning New Workforce Accounts (Add Employee Modal)
- **Route**: [`/employees`](http://localhost:5173/employees) (Modal Trigger: `+ Add Employee`)
- **Role Perspective**: HR Administrator
- **Key Elements**:
  - Modal form capturing Full Name, Email, Password, Role (`Employee`, `Manager`, `Admin`), Department, and Position/Designation.
  - Pre-save input validation and automated password encryption via bcrypt.

![Add Employee Modal](./screenshots/02_add_employee_modal.png)

---

## 4. Digital Leave Application Modal
- **Route**: [`/leaves`](http://localhost:5173/leaves) (Modal Trigger: `Apply for Leave`)
- **Role Perspective**: Employee / User
- **Key Elements**:
  - Leave type selector dropdown (`Annual Leave`, `Sick Leave`, `Casual Leave`, etc.).
  - Date picker range validation ensuring `StartDate <= EndDate`.
  - Justification text area for detailed leave context.
  - Automated routing into the Manager review approval queue upon submission.

![Apply for Leave Modal](./screenshots/04_apply_leave_modal.png)

---

## 5. Attendance & Real-Time Punctuality Tracking
- **Route**: [`/attendance`](http://localhost:5173/attendance)
- **Role Perspective**: All System Users
- **Key Elements**:
  - Daily Clock-In / Clock-Out toggle button (`Clock In Now`).
  - Historical table displaying Date, Employee Name, Clock-In timestamp, Clock-Out status, and Total Hours.
  - Automated punctuality status indicator flagging check-ins past 09:30 AM with a `Late` badge.

![Attendance Tracking](./screenshots/05_attendance_tracking.png)

---

## 6. Post Company Announcement (Modal Form)
- **Route**: [`/announcements`](http://localhost:5173/announcements) (Modal Trigger: `+ New Announcement`)
- **Role Perspective**: Admin / Management
- **Key Elements**:
  - Modal for drafting organization-wide notices (Title: *"Holiday Due to Strike"*, Content description).
  - Priority tag assignment and author attribution.

![Post Announcement Modal](./screenshots/06_post_announcement_modal.png)

---

## 7. Organization Announcements Feed
- **Route**: [`/announcements`](http://localhost:5173/announcements)
- **Role Perspective**: All System Users
- **Key Elements**:
  - Chronological company broadcast bulletin.
  - Live broadcast cards showing author, timestamp, subject header, and announcement text.

![Announcements Feed](./screenshots/07_announcements_feed.png)

---

## 8. Create Training & Development Program (Modal Form)
- **Route**: [`/training`](http://localhost:5173/training) (Modal Trigger: `+ Create Program`)
- **Role Perspective**: Manager / HR
- **Key Elements**:
  - Course setup modal capturing Program Title (*"MERN STACK"*), Curriculum Description, Trainer/Instructor (*"Tatva"*), Target Department (*"Engineering"*), and Date duration.

![Create Training Program Modal](./screenshots/08_create_training_modal.png)

---

## 9. Training & Skill Development Programs Catalog
- **Route**: [`/training`](http://localhost:5173/training)
- **Role Perspective**: All System Users
- **Key Elements**:
  - Training metrics overview: Total Programs (`1`), Upcoming (`1`), In Progress (`0`), Completed (`0`).
  - Course cards with department tags, instructor details, duration dates, and status lifecycle selectors.

![Training Programs Catalog](./screenshots/09_training_programs_catalog.png)

---

## 10. Approved Leave Request Processing & Audit Trail
- **Route**: [`/leaves`](http://localhost:5173/leaves)
- **Role Perspective**: Employee / Manager / Admin
- **Key Elements**:
  - Leave ledger table recording Employee Name, Leave Type (`Annual`), Date Range (`10/25/2026 - 10/27/2026`), Reason (*"I am Sick"*), and verified `Approved` status badge.

![Approved Leave Request](./screenshots/10_leave_requests_approved.png)
