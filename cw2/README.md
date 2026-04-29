# Alumni Influencer Platform (MERN)

This repository contains a MERN-based project with separate `frontend` and `backend` applications.  
The primary focus of this README is the backend API (`backend`), while the frontend is a React app that consumes these services.

## 1) Project Overview

The Alumni Influencer platform helps manage alumni profiles and engagement workflows, including a blind bidding process for featured alumni visibility.  
It has evolved into a data-driven system with analytics, reporting, and alumni directory capabilities for dashboard and external client use cases.

## 2) Key Features

- JWT-based authentication using HTTP-only cookies
- API key management with scoped permissions for external and analytics endpoints
- Alumni profile management (profile details, education, certifications, experience, licenses, courses, profile image)
- Blind bidding system for daily alumni selection logic
- Analytics endpoints (skills gap, job trends, top employers, geography, certification trends, programme distribution)
- Alumni directory with query-based filtering (programme, graduation year)
- Report and export generation in PDF and CSV formats

## 3) System Architecture

The backend follows a layered MVC-style structure with clear module boundaries:

- `routes/` for endpoint definitions and middleware composition
- `controllers/` for request handling and business logic orchestration
- `models/` for Sequelize data models and database access
- `middleware/` and `utils/` for reusable cross-cutting concerns (auth, authorization, API key scope checks, usage tracking, scheduling helpers)

## 4) Security Model

- **JWT authentication (cookie-based):** Users authenticate through login and receive a JWT in an HTTP-only `token` cookie.
- **API key authentication (Bearer token):** External clients call selected endpoints with `Authorization: Bearer <API_KEY>`.
- **Scoped permissions:** API keys are validated against required scopes such as `read:analytics`, `read:alumni`, and `read:alumni_of_day`.
- **Usage tracking:** API key-protected requests are logged via middleware for usage and stats.

## 5) Tech Stack

- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- PDFKit (PDF generation)
- json2csv (CSV export)

## 6) API Documentation

OpenAPI/Swagger documentation is available at:

- `http://localhost:5050/api-docs`

## 7) Setup Instructions

1. Clone the repository.
2. Navigate to the backend:
   - `cd backend`
3. Install dependencies:
   - `npm install`
4. Configure environment variables:
   - copy `.env.example` to `.env` and update values
5. Run the server:
   - Development: `npm run dev`
   - Production-style: `npm start`

## 8) Database Setup (PostgreSQL)

This project runs locally using PostgreSQL.

1. Install PostgreSQL.
2. Create a database (example):
   - `createdb alumni_influencer_db`
3. Update `.env` with your DB credentials:
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`
   - `DB_HOST`
   - `DB_PORT` (recommended to include; commonly `5432`)

## 9) Environment Variables

Required backend environment variables:

- `PORT`
- `CLIENT_URL`
- `JWT_SECRET`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `DB_HOST`
- `EMAIL_USER`
- `EMAIL_PASS`

## 10) Testing the API

- Use Swagger UI at `/api-docs` for interactive endpoint testing, or use Postman.
- Cookie-based auth flow:
  1. Register/login via auth endpoints.
  2. Receive JWT in HTTP-only `token` cookie.
  3. Call protected routes that require authenticated user context.
- API key flow for analytics and external endpoints:
  1. Create an API key via developer key-management endpoints.
  2. Call API key-protected endpoints with `Authorization: Bearer <API_KEY>`.
  3. Ensure the key has the required scope for each endpoint.

## Frontend (Brief)

The `frontend` folder contains a separate React application (Vite-based) that can be run independently and integrated with this backend API.
