# Banking System API

Backend API for a banking system built with NestJS, TypeORM, PostgreSQL, Swagger, and cookie-session authentication.

## Live API Docs

Hosted Swagger UI:

[https://banking-systemapi-production.up.railway.app/api#/](https://banking-systemapi-production.up.railway.app/api#/)

Use the hosted Swagger page to explore routes, request bodies, and response schemas.

## What This API Covers

This API includes the main banking features below:

- User signup, signin, signout, profile lookup, update, password change, and user deactivation
- Account creation, listing, lookup, update, and account closing
- Deposit and withdrawal style transactions
- Account-to-account transfers
- Card creation, listing, lookup, update, and blocking/removal
- Fixed deposit creation, listing, lookup, and closing

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Swagger
- cookie-session
- class-validator
- nestjs-paginate

## Base URLs

Local development:

```text
http://localhost:3000
```

Local Swagger:

```text
http://localhost:3000/api
```

Hosted Swagger:

```text
https://banking-systemapi-production.up.railway.app/api#/
```

## Authentication

This project uses session-based authentication with `cookie-session`.

Important behavior:

- After `signup` or `signin`, the server stores `userId` in the session
- Protected routes require that session cookie
- In Swagger or Postman, requests must be sent using the same session/cookie context after login
- Admin-only routes are protected with `AdminGuard`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the project in development watch mode:

```bash
npm run start:dev
```

Build the project:

```bash
npm run build
```

Run compiled production build:

```bash
npm run start:prod
```

## Environment Notes

The app reads database and session configuration from environment variables. Make sure your local `.env` is configured before starting the server.

Common values used by the app:

- `PORT`
- `COOKIE_KEY`
- `DATABASE_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `NODE_ENV`

## Main Modules

### Users

Handles:

- Signup
- Signin
- Signout
- Get current logged-in user
- Get user by id
- Update user
- Change password
- Deactivate user

Main routes:

- `POST /users/signup`
- `POST /users/signin`
- `POST /users/signout`
- `GET /users/curUser`
- `GET /users/all-users`
- `GET /users/:id`
- `PATCH /users/change-password`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Accounts

Handles:

- Create bank account
- List accounts
- Get account by id
- Update account
- Close account

Main routes:

- `POST /accounts`
- `GET /accounts`
- `GET /accounts/:id`
- `PATCH /accounts/:id`
- `DELETE /accounts/:id`

### Transactions

Handles:

- Create transactions
- View all transactions
- View transaction by id

Main routes:

- `POST /transactions`
- `GET /transactions`
- `GET /transactions/:id`

### Transfers

Handles:

- Create transfer between accounts
- View all transfers
- View transfer by id

Main routes:

- `POST /transfers`
- `GET /transfers`
- `GET /transfers/:id`

### Cards

Handles:

- Create card for account
- List cards
- Get card by id
- Update card
- Remove or block card

Main routes:

- `POST /cards`
- `GET /cards`
- `GET /cards/:id`
- `PATCH /cards/:id`
- `DELETE /cards/:id`

### Fixed Deposits

Handles:

- Create fixed deposit
- List fixed deposits
- Get fixed deposit by id
- Close fixed deposit

Main routes:

- `POST /fixed-deposit`
- `GET /fixed-deposit`
- `GET /fixed-deposit/:id`
- `DELETE /fixed-deposit/:id`

## Authorization Overview

General access pattern in this project:

- Authenticated users can access their own protected actions
- Admin users can access admin-only listing and management routes
- Routes such as `GET all` are commonly admin-only
- Session auth must be active before calling protected endpoints

Always verify behavior in Swagger with the same logged-in session.

## Pagination

Several listing routes use `nestjs-paginate`.

Examples:

- `GET /users/all-users`
- `GET /accounts`
- `GET /transactions`
- `GET /transfers`
- `GET /cards`
- `GET /fixed-deposit`

Check Swagger for supported query parameters such as page, limit, sorting, and filtering behavior.

## Typical API Flow

Basic user flow:

1. `POST /users/signup` or `POST /users/signin`
2. Keep the session cookie
3. Call protected routes like `/users/curUser`, `/accounts`, `/transactions`, or `/transfers`

Admin flow:

1. Sign in with an admin account
2. Use admin-only listing and deactivation routes
3. Verify results using resource lookup endpoints

## Response Notes

- Some successful actions may return `204 No Content`
- Example: deleting or deactivating a resource can succeed without returning a JSON body
- For those cases, verify success using the HTTP status code and a follow-up `GET`

## Testing

Run unit tests:

```bash
npm run test
```

Run e2e tests:

```bash
npm run test:e2e
```

Run coverage:

```bash
npm run test:cov
```

## Project Scripts

- `npm run start`
- `npm run start:dev`
- `npm run start:debug`
- `npm run start:prod`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run test:cov`

## Recommended Way To Explore The API

1. Open the hosted Swagger UI
2. Sign in or sign up first
3. Reuse the same session while testing protected endpoints
4. Use admin credentials for admin-only routes

Hosted Swagger UI:

[https://banking-systemapi-production.up.railway.app/api#/](https://banking-systemapi-production.up.railway.app/api#/)
