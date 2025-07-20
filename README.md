# Room Booking & Calendar Alignment System

## Overview

This project is a **web-based Room Booking and Calendar Alignment System** designed for educational institutions, studios, or organizations that require coordinated booking of multiple spaces (e.g., classrooms and practice halls) with consideration for their specific purposes, activity types, and acoustics. The system eliminates double-booking, ensures synchronized slot reservation, and supports resource-appropriate booking—all from a streamlined, user-friendly interface.

---

## Table of Contents

- [Key Features](#key-features)
- [User Roles & Permissions](#user-roles--permissions)
- [System Architecture](#system-architecture)
- [User Journey & Workflows](#user-journey--workflows)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Core Entity Relationship Diagram](#core-entity-relationship-diagram)
- [Admin Capabilities](#admin-capabilities)
- [Future Enhancements](#future-enhancements)

---

## Key Features

- **Secure Authentication & Authorization**  
  Supports role-based access for admins, teachers, students, and facilities/support users.

- **Resource Filtering & Availability**  
  Search and book rooms based on activity, room type, capacity, acoustics, and equipment.

- **Calendar Alignment**  
  Finds and displays slots where all required spaces (e.g., classroom + practice hall) are mutually available.

- **Conflict Prevention**  
  Built-in conflict checks prevent double-booking and ensure all room pre-requisites are satisfied.

- **Booking Management**  
  Create, modify, or cancel bookings, with instant updates and notifications for all stakeholders.

- **Calendar View**  
  Visual interface for viewing all bookings and room availabilities (daily, weekly, monthly).

- **Notifications**  
  Email and/or push notifications for booking confirmations, changes, cancellations, and reminders.

- **Reporting & Analytics**  
  Dashboard for admins to review usage statistics, booking patterns, and generate activity reports.

---

## User Roles & Permissions

| Role       | Book Rooms | Modify Own Bookings | View Calendar | Manage Users & Rooms | Cancel Any Booking | Generate Reports |
|------------|:----------:|:------------------:|:-------------:|:-------------------:|:-----------------:|:----------------:|
| Admin      |     ✔️      |         ✔️          |      ✔️        |         ✔️          |        ✔️         |        ✔️         |   
| Student    |     ✔️*     |         ✔️*         |      ✔️        |                     |                   |                  |
| Support    |            |                    |      ✔️        |         ✔️           |        ✔️         |        ✔️         |



---

## System Architecture

- **Frontend:** React.js (with optional TypeScript), responsive design for web browsers, calendar UI via FullCalendar.
- **Backend:** Node.js with Express.js for RESTful API development and real-time conflict checks.
- **Database:** MongoDB (NoSQL; optimized for flexible, nested booking and resource structures).
- **Authentication:** JWT for user sessions, OAuth 2.0 for social/institutional login.
- **Calendar Integration:** Google Calendar API for two-way sync (optional).
- **Notifications:** Nodemailer (email alerts), web-push or Twilio (push/SMS notifications).
- **Analytics:** MongoDB Aggregation/Chart.js integration for admin dashboards.

---

## User Journey & Workflows

### General Workflow

1. **Login & Dashboard**
   - Users authenticate by role and land on a personalized dashboard.

2. **Initiate Booking**
   - Select desired activity/module and define pre-requisites (e.g., requiring both a classroom and practice hall).

3. **Room Purpose Filtering**
   - System filters available rooms/halls by activity suitability, acoustics, equipment, and size.

4. **Availability & Calendar Alignment**
   - Displays timeslots where all required rooms are available together, avoiding conflicts.

5. **Slot & Room Selection**
   - User picks from filtered, available slots, reviews room features, and proceeds.

6. **Booking Submission**
   - Double-checks for conflicts in real time before committing the reservation.

7. **Confirmation & Notifications**
   - Updates system calendars, sends instant notifications to involved parties.

8. **View/Modify/Cancel Bookings**
   - Users can view, edit, or cancel bookings within policy constraints; calendars auto-update.

9. **Admin Oversight**
   - Certain bookings require admin approval (e.g., large events or exceptional cases).

### Booking Conflict Handling

Upon booking submission, the system instantly rechecks the current state of all requested time slots for all selected rooms to prevent double-booking. If a conflict is detected, the user is prompted to select an alternate slot.

---

## Technology Stack

| Layer        | Technology               | Why Chosen                                      |
|--------------|--------------------------|-------------------------------------------------|
| Frontend     | React.js                 | Modular UI, reusable components, robust for web |
| Backend      | Node.js + Express.js     | Event-driven, real-time conflict checks         |
| Database     | MongoDB                  | Flexibility for complex booking relationships   |
| Auth         | JWT, OAuth 2.0           | Secure, supports third-party/institutional SSO  |
| Calendar     | Google Calendar API      | Easy integration with existing workflows        |
| Notifications| Nodemailer, web-push     | Reliable, customizable notifications            |
| Analytics    | Chart.js (React plugin)  | Rich, interactive dashboards                    |

---

## Getting Started

### Prerequisites

- Node.js & npm installed
- MongoDB database running
- Google Cloud account for Calendar API (if using)
- Email service credentials (for notifications)

### Setup

```
git clone https://github.com/sarathi062023/room-booking-app.git
cd room-booking-app
npm install
```

- Configure `.env` with MongoDB URI, JWT secret, mail credentials, etc.
- Start backend:  
  `npm run server`
- Start frontend:  
  `npm run client`

### Run Tests

```
npm test
```

---

## Core Entity Relationship Diagram

- **User** (userId, name, role, email)
  - ↕️ Books → **Booking** (bookingId, userId, roomId, start, end)
- **Room** (roomId, typeId, attributes)
  - ↔️ Defined by → **RoomType** (typeId, features, acousticRating)
  - ↕️ Linked to → **Calendar** (calendarId, events)
- **Booking** (bookingId, userId, roomId, timeRange)
  - ↔️ Triggers → **Notification** (notifId, userId, bookingId, type)
- **Admin**  
  - ↕️ Manages → Users, Rooms, Bookings, and Reports


ERD Example Description (Textual)

- A **User** can make multiple **Bookings**; each **Booking** reserves a specific **Room** for a given time slot.
- Each **Room** has a defined **RoomType** (acoustics, equipment, suitability).
- **Admin** can manage Users, Rooms, RoomTypes, Bookings, and view system analytics.
- The **Calendar** documents all bookings, available and blocked slots.



---

## Admin Capabilities

Admins are essential for system management and have the following controls:

- Manage **Users** and roles (invite, remove, reset credentials).
- Add, edit, or remove **Rooms**; adjust availability or mark for maintenance.
- Approve, modify, or delete **Bookings** (including for special requests).
- Review **Booking Logs**, audit changes, and generate detailed reports.
- Update **System Settings** (booking rules, notification policies).

---

## Future Enhancements

- **Mobile App Integration:** React Native or PWA for on-the-go booking.
- **Advanced Analytics:** Visualize bottlenecks, predict demand using ML modules.
- **Resource Optimization:** Automatic suggestions for room assignments based on past trends.
- **Custom Notifications:** SMS or in-app notifications for all stakeholders.
- **Multi-language Support:** For global user accessibility.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue to discuss the intended feature.

Please make sure to update tests as appropriate.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions, suggestions, or to report bugs, contact [sarathi062023@gmail.com].