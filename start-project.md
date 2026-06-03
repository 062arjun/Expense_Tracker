# Start Project

## One Command

```bash
docker-compose up --build
```

Open http://localhost:5173 and register a new account.

## Development Mode

1. Start PostgreSQL and create the `expense_tracker` database.
2. Run the backend from `backend` with `./mvnw spring-boot:run`.
3. Run the frontend from `frontend` with `npm install` and `npm run dev`.

Required backend environment variables:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`

Optional variables:

- `JWT_EXPIRATION_MS`
- `CORS_ALLOWED_ORIGINS`
- `JPA_DDL_AUTO`
