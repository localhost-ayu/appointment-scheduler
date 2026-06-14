# Appointment Scheduler

A full-stack appointment scheduling application built with Laravel and React.

Designed for small service-based businesses such as barbershops, beauty salons, physiotherapy clinics, psychology offices, and other appointment-driven services.

## Screenshots

### Professional Dashboard

| Light | Dark |
|---|---|
| ![Dashboard Light](./screenshots/dashboard-light.png) | ![Dashboard Dark](./screenshots/dashboard-dark.png) |

### Booking Flow

| | Light | Dark |
|---|---|---|
| **Identify / Login** | ![Login Light](./screenshots/bookingflow-login-light.png) | ![Login Dark](./screenshots/bookingflow-login-dark.png) |
| **My Appointments** | ![My Appointments Light](./screenshots/bookingflow-myappointments-light.png) | ![My Appointments Dark](./screenshots/bookingflow-myappointments-dark.png) |
| **New Appointment** | ![New Appointment Light](./screenshots/bookingflow-newappointments-light.png) | ![New Appointment Dark](./screenshots/bookingflow-newappointments-dark.png) |
| **Choose a Time** | ![Choose a Time Light](./screenshots/bookingflow-chooseatime-light.png) | ![Choose a Time Dark](./screenshots/bookingflow-chooseatime-dark.png) |
| **Confirm Appointment** | ![Confirm Light](./screenshots/bookingflow-confirmappointment-light.png) | ![Confirm Dark](./screenshots/bookingflow-confirmappointment-dark.png) |
| **Success** | ![Success Light](./screenshots/bookingflow-success-light.png) | ![Success Dark](./screenshots/bookingflow-success-dark.png) |

---

## Overview

Appointment Scheduler is a portfolio project focused on solving a common real-world problem: managing appointments without unnecessary complexity.

Customers can book appointments using only their name and phone number, while professionals manage schedules, availability, and appointments through a dedicated dashboard.

The project was built with a strong focus on:

* Clean architecture
* Real-world scheduling rules
* Mobile-friendly UX
* Dark mode support
* Type-safe frontend development
* Maintainable business logic

---

## Features

### Customer Features

* Phone-based identification (no account creation required)
* Automatic recognition of returning customers
* Appointment history
* New appointment booking flow
* Professional and service selection
* Real-time availability lookup
* Appointment cancellation
* Appointment rescheduling
* Calendar export support (Google Calendar and ICS)
* Human-readable appointment numbers

### Professional Features

* Secure authentication
* Dashboard with operational metrics
* Daily appointment overview
* Revenue tracking
* Appointment management
* Schedule management
* Multiple schedule blocks per day
* Unavailable date management
* Profile management
* URL-synchronized dashboard filters

---

## Architecture

The backend follows a layered architecture:

```text
Controllers
    ↓
Services
    ↓
Models
```

### Core Entities

* Customers
* Professionals
* Services
* Professional Schedules
* Professional Unavailable Dates
* Appointments

### Availability Engine

Available time slots are generated dynamically based on:

* Schedule blocks
* Service duration
* Existing appointments
* Unavailable dates

Only appointments with `pending` or `completed` status occupy time slots.

### Authentication

Professional authentication uses Laravel Sanctum with token-based authentication.

Customers do not create accounts and are identified using their phone number.

---

## Tech Stack

### Backend

| Technology      | Version |
| --------------- | ------- |
| PHP             | 8.3     |
| Laravel         | 13      |
| MySQL           | 8       |
| Laravel Sanctum | Latest  |

### Frontend

| Technology   | Version |
| ------------ | ------- |
| React        | 19      |
| TypeScript   | 6       |
| Vite         | 8       |
| Tailwind CSS | 4       |
| Axios        | Latest  |
| React Router | 7       |

---

## Getting Started

### Prerequisites

* PHP 8.2+
* Composer
* Node.js 20+
* MySQL 8+

---

### Backend Setup

```bash
git clone https://github.com/localhost-ayu/appointment-scheduler.git

cd appointment-scheduler

composer install

cp .env.example .env

php artisan key:generate
```

Configure your database credentials in `.env`.

Run migrations and seeders:

```bash
php artisan migrate --seed
```

Start the API:

```bash
php artisan serve
```

API available at:

```text
http://localhost:8000
```

Example seeded account:

```text
Email: admin@example.com
Password: password
```

---

### Frontend Setup

```bash
cd appointment-scheduler-web

npm install

npm run dev
```

Frontend available at:

```text
http://localhost:5173
```

---

## Project Structure

### Backend

```text
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Models/
├── Services/
└── Providers/
```

### Frontend

```text
src/
├── components/
├── contexts/
├── hooks/
├── pages/
├── services/
├── types/
└── routes/
```

---

## Key Technical Decisions

### Datetime Ranges Instead of Separate Date/Time Fields

Appointments use `starts_at` and `ends_at`.

This simplifies overlap detection, availability calculations, and future timezone handling.

---

### Snapshot Pricing

Appointments store:

* `price_at_booking`
* `duration_at_booking`

Historical appointments remain accurate even if service definitions change later.

---

### Optimistic Concurrency Protection

Before creating an appointment, availability is checked again inside a database transaction.

```text
BEGIN TRANSACTION
  → Re-check availability
  → Create appointment
COMMIT
```

This prevents double-bookings.

---

### Multiple Schedule Blocks

Professionals can define multiple schedule blocks for the same day.

Example:

```text
08:00 → 12:00
13:00 → 18:00
```

Lunch breaks and split shifts require no special logic.

---

### URL-Synchronized Dashboard Filters

Dashboard state is reflected in the URL:

```text
/professional/dashboard?filter=month&date=2026-06
```

Benefits:

* Bookmarkable
* Refresh-safe
* Shareable
* Easier debugging

---

### Customer Identification by Phone Number

Customers identify themselves using:

* Name
* Phone number

No registration, password recovery, or email verification is required.

---

## Design System

The frontend uses a token-based design system built on CSS custom properties.

Features include:

* Light mode
* Dark mode
* Shared color tokens
* Consistent spacing scale
* Reusable UI components
* Theme-aware styling

Tailwind CSS is used primarily for layout and spacing, while visual styling is driven by design tokens.

### Typography

* Geist Sans
* Geist Mono

### Theme Support

Theme preference is persisted in local storage and applied globally through CSS variables.

---

## Future Improvements

* Email notifications
* SMS reminders
* File uploads for professional photos
* Advanced reporting and charts
* Waitlist functionality
* Service categories
* Multi-language support
* Online payments
* Multi-business support

---

## What This Project Demonstrates

* REST API design
* Laravel service-layer architecture
* Authentication with Sanctum
* Database modeling
* Availability algorithms
* Transaction handling
* React state management
* TypeScript integration
* Responsive design
* Dark mode implementation
* Full-stack application development

---

## Author

Developed as a portfolio project showcasing full-stack development with Laravel and React.

**Nathã Grazzioli Botelho**

* GitHub: https://github.com/localhost-ayu
* LinkedIn: https://www.linkedin.com/in/nathã-grazzioli-botelho/
