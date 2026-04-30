
---

# Alumni Influencer Platform

An end-to-end MERN stack solution designed to manage alumni engagement through data-driven profiles, a unique blind bidding system for featured visibility, and robust analytics for external stakeholders.

---

## Core Features

### For Alumni
* **Comprehensive Profiles:** Manage education, courses, work history, certifications, and licenses.
* **Blind Bidding:** Participate in a competitive bidding system for daily "Featured Alumni" status.
* **Career Tracking:** Log courses and professional milestones.

### For Admins
* **Analytics Dashboard:** Insights into skills gaps, job trends, and geographic distribution.
* **Reporting:** Export data and analytics in PDF and CSV formats.

### For Developers
* **API Key Management:** Issue scoped keys (`read:analytics`, `read:alumni`) for admins & external AR apps.

---

## Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Node.js, Express, Sequelize ORM |
| **Database** | PostgreSQL |
| **Security** | JWT (HTTP-only cookies), Scoped API Keys, CSRF Protection |
| **Utilities** | PDFKit, json2csv, Axios, Nodemailer |

---

## System Architecture

The project is split into two main directories: `/backend` (Layered MVC) and `/frontend` (Component-based React).

### Backend Structure
```text
backend/
├── config/         # Application configuration (DB connection, multer setup, nodemailer configs)
├── uploads/        # Stored uploaded files (Profile Images)
├── controllers/    # Business logic & request handling
├── models/         # Sequelize schemas (PostgreSQL)
├── routes/         # API endpoint definitions
├── middleware/     # Auth, Scoping, and Usage tracking etc.
└── utils/          # schedulers
```

### Frontend Structure
```text
frontend/src/
├── api/            # Axios clients + API service modules 
├── assets/         # Static assets (images/icons) 
├── components/     # Reusable UI (auth, layout, profile, common) 
├── context/        # React Context providers (Auth, Dashboard, Profile, etc.) 
├── hooks/          # Custom hooks (auth, profile, dashboard, csrf init, etc.) 
├── pages/          # Route-level screens (auth, alumni, dashboard, developer) 
├── state/          # Shared state helpers (e.g., CSRF token state) 
├── utils/          # Utility helpers (error normalization, payload sanitization) 
├── App.jsx         # Route map and protected route composition 
└── main.jsx        # React root + provider wiring
```

---

## Getting Started

### Prerequisites
* Node.js (v20+ recommended)
* PostgreSQL

### 1. Database Setup
```bash
createdb alumni_influencer_db
```

### 2. Backend Configuration
1.  `cd backend`
2.  `npm install`
3.  Create a `.env` file from `.env.example`:
    ```env
    NODE_ENV=development
    PORT=5050
    CLIENT_URL=http://localhost:5173
    BASE_URL=http://localhost:5050
    JWT_SECRET=
    DB_NAME=
    DB_USER=
    DB_PASS=
    DB_HOST=
    EMAIL_USER=
    EMAIL_PASS=
    ```
4.  `npm run dev` (Runs at `http://localhost:5050`)

### 3. Frontend Configuration
1.  `cd frontend`
2.  `npm install`
3.  Create a `.env` file:
    ```env
    VITE_API_BASE_URL=http://localhost:5050/api
    VITE_DASHBOARD_API_KEY=your_scoped_key
    ```
4.  `npm run dev` (Runs at `http://localhost:5173`)

---

## Security & Authentication

- **JWT authentication (cookie-based):** Users authenticate through login and receive a JWT in an HTTP-only token cookie. 
- **API key authentication (Bearer token):** External clients call selected endpoints with Authorization: Bearer <API_KEY>. 
- **Scoped permissions:** API keys are validated against required scopes such as read:analytics, read:alumni, and read:alumni_of_day. 
- **Usage tracking:** API key-protected requests are logged via middleware for usage and stats.

---

## API Documentation

Interactive documentation is powered by Swagger. Once the backend is running, visit: `http://localhost:5050/api-docs`

---