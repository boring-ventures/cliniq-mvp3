# Cliniq ERP MVP To-Do List

> **Note:** This list starts with **User Creation & Role Management** to establish a solid foundation for the entire ERP platform.

## 1. User Creation & Role Management (Core Foundation)

### 1.1 Architecture & Data Model
- [ ] **Design RBAC (Role-Based Access Control)**:
  - [ ] Define `User`, `Role`, `Permission` models in the database.
  - [ ] Establish relationships between Users and Roles (one-to-many or many-to-many, depending on needs).
  - [ ] Create a `Permissions` table or enum if granular permissions are required.
- [ ] **Set up Auth Mechanism**:
  - [ ] Use Supabase Auth or another provider for secure authentication.
  - [ ] Integrate email/password flow and multi-factor authentication (if needed).
  - [ ] Ensure tokens or sessions are securely managed.
- [ ] **Plan Data Migration/Seeding**:
  - [ ] Create a `Super Admin` role with full permissions.
  - [ ] Seed a default user with `Super Admin` privileges.

### 1.2 User Management (Admin Panel)
- [ ] **User List Screen**:
  - [ ] Display user info, roles, permissions, and activity logs.
  - [ ] Filter, sort, and search users.
- [ ] **User Profile Screen**:
  - [ ] Allow admins to view and edit personal details (name, email, etc.).
  - [ ] Display assigned role(s) and last login info.
- [ ] **Create/Edit User Screen**:
  - [ ] Add a form to create new users (name, email, password, role).
  - [ ] Enable role assignment and permission toggles.
  - [ ] Implement validations (unique email, password strength).
- [ ] **Role & Permission Management**:
  - [ ] Admin interface to create/edit roles.
  - [ ] Assign or revoke permissions at role level.
  - [ ] Log changes to roles for audit purposes.

---

## 2. Authentication & Security

### 2.1 Login & Password Recovery
- [ ] **Login Screen**:
  - [ ] Email/Password input.
  - [ ] 2FA (Two-Factor Authentication) toggle.
- [ ] **Forgot Password Screen**:
  - [ ] Password reset via email link or code.
- [ ] **Logout Mechanism**:
  - [ ] Clear sessions/tokens securely.
  - [ ] Redirect to login page.

### 2.2 Access Control & Auditing
- [ ] **Role-Based Routing**:
  - [ ] Restrict routes/components based on user roles/permissions.
- [ ] **Audit Logs**:
  - [ ] Track all significant actions (user creation, role changes, data edits).
  - [ ] Store logs in a separate table or logging service for easy retrieval.

---

## 3. Dashboard & Navigation

### 3.1 Admin/Receptionist Dashboard
- [ ] **Appointment Overview**: Daily/weekly summary.
- [ ] **Revenue Overview**: Total earnings, pending invoices.
- [ ] **Inventory Alerts**: Low-stock items.
- [ ] **Doctor Availability**: Current status of each doctor.
- [ ] **Patient Reminders**: Summary of upcoming WhatsApp reminders.

### 3.2 Doctor’s Dashboard
- [ ] **Upcoming Appointments**: Calendar or list view.
- [ ] **Patient Lookup**: Quick search of past treatments.
- [ ] **Task List**: Pending follow-ups or case updates.

---

## 4. Appointment Management

### 4.1 Appointment Scheduling
- [ ] **New Appointment Form**: Select doctor, date, time, reason.
- [ ] **Calendar Views**:
  - [ ] Individual calendars for each doctor.
  - [ ] Global calendar with color-coded appointments per doctor.
- [ ] **Search & Filter** by doctor, patient, status.

### 4.2 Appointment Details
- [ ] **Patient Information**: Name, contact, treatment history link.
- [ ] **Doctor Notes**: Treatment details, diagnosis.
- [ ] **Payment Status**: Paid, pending, overdue.
- [ ] **Changes History**: Track edits and reschedules.

### 4.3 Appointment Reminders
- [ ] **WhatsApp Notification Log**: Sent & pending.
- [ ] **Manual Reminder Trigger**: One-click reminders.
- [ ] **Auto Reminders**: 24h, 1h before, etc.

---

## 5. Patient Management & EMR

### 5.1 Patient List Screen
- [ ] **Search & Filter** by name, phone, last visit.
- [ ] **Quick View**: Essential details pop-up.
- [ ] **Add New Patient**: Registration form.

### 5.2 Patient Profile & Medical History
- [ ] **Basic Details**: Name, contact, emergency contact.
- [ ] **Treatment History**: Chronological record.
- [ ] **Medical Notes**: Doctor’s observations, diagnoses.
- [ ] **File Upload**: X-rays, test results, prescriptions.
- [ ] **Payment History**: List of invoices and statuses.

---

## 6. Inventory Management

### 6.1 Inventory Dashboard
- [ ] **Stock Overview**: Current items and low-stock alerts.
- [ ] **Recent Usage Log**: Record of consumed supplies.

### 6.2 Inventory List & Search
- [ ] **Filter by Category**: Medication, tools, disposables.
- [ ] **Supplier Details**: Vendor list & reorder history.

### 6.3 Inventory Item Details
- [ ] **Stock Status**: Available, reserved, expired.
- [ ] **Usage Logs**: Who used the item and when.

### 6.4 Reorder & Restock
- [ ] **Low Stock Alerts**: Automatic notifications.
- [ ] **Create Purchase Orders**: Issue orders to suppliers.
- [ ] **Order Tracking**: Keep records of orders and deliveries.

---

## 7. Doctor & Staff Management

### 7.1 Doctor List
- [ ] **Search & Filter** by name, specialty, availability.
- [ ] **Assigned Color**: For global calendar visibility.

### 7.2 Doctor Profile
- [ ] **Personal Info**: Specialty, experience, contact.
- [ ] **Availability Settings**: Working hours, off-days.

### 7.3 Staff List & Permissions
- [ ] **List of Employees**: Receptionists, assistants, managers.
- [ ] **Role Management**: Adjust staff roles or permissions as needed.

### 7.4 Payroll & Timesheet
- [ ] **Time Tracking**: Check-in/check-out for doctors.
- [ ] **Payroll Report**: Salaries, commissions, pending payments.

---

## 8. Sales & Financial Management

### 8.1 Invoice Management
- [ ] **Invoice List**: View pending, paid, overdue invoices.
- [ ] **New Invoice Screen**: Generate invoice for treatments.
- [ ] **Discounts & Offers**: Adjust custom pricing.

### 8.2 Payment Processing
- [ ] **Online Payment Page**: Integrate with a banking API.
- [ ] **Manual Payment Entry**: Mark invoices as paid in the system.

### 8.3 Financial Reports
- [ ] **Revenue Reports**: Track clinic earnings over time.
- [ ] **Expense Reports**: Monitor purchases & operational costs.

---

## 9. System Settings & Configuration

### 9.1 Clinic Settings
- [ ] **Business Info**: Name, logo, contact details.
- [ ] **Working Hours Config**: Define operating hours.

### 9.2 Notification Settings
- [ ] **WhatsApp Reminder Templates**: Define timing & message.
- [ ] **Email Notification Preferences**: Enable/disable alerts.

### 9.3 User Permissions & Audit
- [ ] **Role Management**: Fine-tune role-based access.
- [ ] **Data Access Logs**: Monitor who accessed or changed data.

---

## 10. Notes & Future Extensions

- **AI-Powered Patient Engagement**: Automated follow-ups, chatbots, insurance integrations (planned for subsequent versions).
- **Scalability Considerations**: Evaluate microservices architecture vs. monolithic approach as the app grows.
- **Security & Compliance**: Ensure HIPAA or local equivalent compliance where applicable.

---

### Final Remarks

1. **Start with the foundation**: user creation, role management, and authentication are crucial to secure every other module.  
2. **Iterate** on each module, ensuring test coverage and consistent UI/UX design.  
3. **Leverage real-time features** of Supabase to keep the clinic’s data in sync, especially for appointments and inventories.  

> Once the core is stable, you can expand into **AI-driven reminders**, **insurance billing** modules, and **advanced analytics** for a more robust system.

Tech Stack Overview  
- **Frontend Framework:** React + Next.js (for server-side rendering and optimized performance).  
- **UI Library:** Tailwind CSS + ShadCN (for pre-built, customizable components).  
- **Backend (BaaS):** Supabase (for PostgreSQL database, real-time updates, and authentication).  
- **Deployment:** Vercel (for seamless CI/CD and hosting).  

