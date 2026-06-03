# Expense Tracker

A production-ready Java full stack expense tracker with Spring Boot, PostgreSQL, JWT authentication, and a pure ReactJS Vite frontend.

## Stack

- Backend: Spring Boot 4.0.6, Spring Security, JWT, BCrypt, JPA, PostgreSQL, Swagger/OpenAPI
- Frontend: ReactJS, Vite, JavaScript JSX, React Router, Axios, Tailwind CSS, Recharts
- Database: PostgreSQL

## Run With Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Swagger: http://localhost:8080/swagger-ui.html

## Local Backend

Set PostgreSQL credentials through environment variables:

```bash
DB_URL=jdbc:postgresql://localhost:5432/expense_tracker
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=replace-this-with-a-strong-production-secret-32-bytes-minimum
```

Then run:

```bash
cd backend
./mvnw spring-boot:run
```

## Local Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `VITE_API_BASE_URL=http://localhost:8080/api`.

## API

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`

Expenses:

- `POST /api/expenses`
- `GET /api/expenses`
- `GET /api/expenses/{id}`
- `PUT /api/expenses/{id}`
- `DELETE /api/expenses/{id}`

Dashboard:

- `GET /api/dashboard/summary`
- `GET /api/dashboard/monthly`
- `GET /api/dashboard/categories`
- `GET /api/dashboard/recent`
