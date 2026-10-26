# System Features Specification: StaffSync HRM

The canonical document is maintained at [`docs/FEATURES.md`](./docs/FEATURES.md).

This document outlines the core functional features implemented in the **StaffSync Human Resource Management (HRM)** system, detailing the capabilities, workflows, permissions, and architectural integrations.

---

## 1. Role-Based Access Control (RBAC)

### Description
The system provides dedicated dashboards and permissions for **HR / Admin**, **Managers**, and **Employees**, ensuring secure and role-specific access to features and organizational data.

### Key Capabilities & Workflow
- **Multi-Tier Role Hierarchy**:
  - **Admin / HR**: Full control over workforce records, user roles, system announcements, training schedules, and global metrics.
  - **Manager**: Departmental leadership with capabilities to approve/reject leaves, supervise team attendance, create and assign training programs, and publish announcements.
  - **Employee**: Individual contributor access to personal dashboard, leave application submissions, daily attendance clock-in/out, training enrollment, and profile updates.
- **Authentication & Security Enforcement**:
  - Stateless JSON Web Token (JWT) authentication with bearer authorization header.
  - Role-verifying Express middleware (`protect` and `authorize('admin', 'manager')`) guarding all protected API endpoints.
  - Granular route protections in both frontend (React Router guards) and backend (controller-level authorization checks).

---

## 2. Employee & Leave Management

### Description
HR can easily add, edit, or remove employee records, while employees can apply for leaves digitally. Managers and HR can review, approve, or reject requests with real-time updates.

### Key Capabilities & Workflow
- **Workforce Directory & CRUD Operations**:
  - Directory search, filtering by department, and real-time status monitoring.
  - Create new employee profiles with initial credentials, department assignments, and job designations.
  - Update employee details or deactivate accounts cleanly.
- **Digital Leave Management Lifecycle**:
  1. **Submission**: Employees select leave type (annual, sick, casual, maternity, unpaid, other), choose date ranges, and submit justifications.
  2. **Pending Queue**: Requests immediately enter the central approval queue visible to Managers and HR.
  3. **Review & Decision**: Managers review dates, assess coverage, and approve or reject with transparent remarks.
  4. **Status Notification**: Instant status reflection (`pending`, `approved`, `rejected`) on the employee's personal dashboard.

---

## 3. Attendance Tracking & Reporting

### Description
Integrated attendance management allows employees to mark attendance, and HR can monitor daily records and generate reports for performance and payroll analysis.

### Key Capabilities & Workflow
- **Clock-In & Clock-Out System**:
  - One-click daily attendance marking directly from the dashboard or attendance hub.
  - Duplicate clock-in prevention on the same calendar day.
  - Clock-out timestamp logging with automated duration calculation in total hours.
- **Punctuality & Lateness Detection**:
  - Automated status evaluation flagging check-ins after standard office hours (9:30 AM) as `late`.
  - Status classification support: `present`, `late`, `half-day`, and `absent`.
- **HR & Management Reporting**:
  - Historical query support by user ID, date ranges, and departments.
  - Real-time attendance rate visualization for performance reviews and payroll audits.

---

## 4. Announcements & Internal Communication

### Description
HR and managers can post important updates, company news, or event notifications, ensuring effective communication across the organization.

### Key Capabilities & Workflow
- **Broadcast Publishing**:
  - Managers and HR personnel can draft announcements with rich markdown descriptions.
  - Priority badge assignment (`low`, `medium`, `high`) ensuring urgent company updates capture immediate attention.
  - Departmental targeting (e.g. `All` organization, or specific to `Engineering`, `HR`, `Sales`, `Marketing`).
- **Organization-Wide Feed**:
  - Chronological bulletin board for employees to stay informed on policies, achievements, and company events.
  - Author and timestamp tracking ensuring complete accountability.

---

## Feature Matrix by Role

| Feature Component | Employee | Manager | HR / Admin |
|---|:---:|:---:|:---:|
| View Dashboard & Metrics | Own Data | Team / Dept Data | Organization-wide |
| Clock In / Clock Out Attendance | Yes | Yes | Yes |
| View Attendance History | Own | Department / All | All Records |
| Submit Leave Request | Yes | Yes | Yes |
| Review / Approve Leaves | No | Yes | Yes |
| Create / Edit Employee Records | Self (Profile) | Yes | Yes |
| Deactivate Employee Accounts | No | No | Yes |
| Post Announcements | No | Yes | Yes |
| Create & Assign Training Programs | No | Yes | Yes |
| Complete Assigned Training | Yes | Yes | Yes |
