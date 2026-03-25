# Feedback → Action Tracker

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [CI](#ci)
- [Roadmap](#roadmap)

## Overview

Feedback → Action Tracker is a personal project built to simulate a real-world product environment while practicing full-stack development, including API design, database modeling, and system architecture.

The long-term goal is to transform user feedback into actionable tasks within a workspace-based system.

The current implementation supports basic feedback submission and listing through a simple web interface. See the [Roadmap](#roadmap) for the current project status.

## Tech Stack

**Backend**

- Java 21
- Spring Boot
- PostgreSQL
- Flyway
- Maven

**Frontend**

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- pnpm

**DevOps**

- GitHub Actions (CI)

## Project Structure

```bash
feedback-action-tracker/
├── api/
└── web-ui/
```

## Getting Started

### Prerequisites

- Java 21
- Node.js (v24 recommended)
- pnpm
- Docker (for PostgreSQL)

### Environment Variables

Backend requires the following variables:

- DB_HOST=localhost
- DB_PORT=5432
- DB_NAME=feedback_db
- DB_USERNAME=postgres
- DB_PASSWORD=postgres

The frontend requires the following variables:

- NEXT_PUBLIC_BASE_URL=[localhost:8080](http://localhost:8080)
- NEXT_PUBLIC_FEEDBACK_ENDPOINT=/api/feedback

## Running the Application

### Start PostgreSQL

Using Docker:

```bash
docker run -d \
  --name feedback-postgres \
  -e POSTGRES_DB=feedback_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16
```

---

### Run Backend

```bash
cd api
./mvnw clean spring-boot:run
```

---

### Run Frontend

```bash
cd web-ui
pnpm install
pnpm dev
```

### Accessing the Application

Once both services are running:

- Frontend: [localhost:3000](http://localhost:3000)
- Backend: [localhost:8080](http://localhost:8080)

## CI

The project includes a pipeline running on push and pull requests.

Checks include:

- Backend build and tests
- Frontend lint and build

This ensures the project remains in a working state at all times.

## Roadmap

### Feedback Domain

- [x] Basic feedback submission
- [x] Feedback listing
- [ ] Feedback detail view
- [ ] Feedback deletion
- [ ] Feedback update/edit

### Data Quality & Validation

- [ ] Input validation improvements (frontend + backend)
- [ ] Feedback source standardization (enum)
- [ ] Error handling and API response standardization
- [ ] Loading and empty states improvement

### Actions Domain

- [ ] Create actions from feedback
- [ ] Action status (todo, in progress, done)
- [ ] Link actions to feedback
- [ ] Action listing and basic management

### User & Workspace Domain

- [ ] Authentication (JWT-based)
- [ ] Workspace ownership
- [ ] Multi-user support
- [ ] Authorization (access control per workspace)

### UI & Usability Improvements

- [ ] Toast notifications instead of inline messages
- [ ] Form validation UX improvements
- [ ] Table improvements (sorting, filtering)
- [ ] Basic responsive design

### Insights & Analytics

- [ ] Feedback analytics (counts, trends)
- [ ] Action completion metrics
- [ ] Simple dashboard view

### Dev & Production Readiness

- [x] CI pipeline setup
- [ ] Environment configuration (dev/prod)
- [ ] Dockerized full stack setup
- [ ] Logging and monitoring basics

### Future Enhancements

- [ ] Tags for feedback and actions
- [ ] Search functionality
- [ ] Email/import integrations (future)
