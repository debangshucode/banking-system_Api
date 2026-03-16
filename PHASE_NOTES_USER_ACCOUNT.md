# Banking System Phase Notes

This document captures the current agreed project direction for the `User` and `Account` modules.
It is focused on architecture, domain rules, and phase boundaries.
It intentionally does not include test planning.

## Scope Covered

- User module: current phase-1 state and deferred phase-2 work
- Account module: current phase-1 state and deferred phase-2 work
- Authentication/session behavior relevant to these modules

## Current Stack and Conventions

- Framework: NestJS
- ORM: TypeORM
- Database: PostgreSQL
- Migrations: manual migrations using `QueryRunner`, `Table`, `TableColumn`, `TableForeignKey`
- Validation: `class-validator`, `class-transformer`
- Auth: session-based auth with `cookie-session`
- Serialization: custom serialization interceptor
- Global validation: `ValidationPipe` with whitelist and forbidNonWhitelisted enabled

## General Domain Direction

- The project is moving away from hard delete.
- The project is also moving away from DB-level cascade delete.
- Records should remain in the database for history/audit value.
- Status-based deactivation is preferred over physical deletion.
- `DeleteDateColumn` is not being used for this project direction.

## Current Status Models

### User

- `ACTIVE`
- `INACTIVE`

### Account

- `ACTIVE`
- `CLOSED`
- `PAUSED`

### Card

- `ACTIVE`
- `BLOCKED`
- `EXPIRED`

### Fixed Deposit

- `ACTIVE`
- `MATURED`
- `CLOSED`

### Transfer

- `PENDING`
- `SUCCESS`
- `FAILED`

### Transaction

- `PENDING`
- `SUCCESS`
- `FAILED`

## Authentication and Request Context

### Session Auth

- Session auth is already in place using `cookie-session`.
- After signup/signin, `session.userId` is stored.

### Current User Loading

- `CurrentUserMiddleware` reads `session.userId`.
- If present, it loads the user from the database.
- The loaded user is attached to `req.currentUser`.

### Auth Guard

- `AuthGuard` currently checks only whether `session.userId` exists.
- It is a simple signed-in check.

### Current User Decorator

- `@CurrentUser()` reads `req.currentUser` in controllers.

## User Module

## Phase 1: Current Agreed State

### User Entity

- `User.status` exists.
- User status defaults to `ACTIVE`.
- Users are related to accounts with `User -> Account` as `1:N`.

### Password Handling

- Passwords are hashed using `crypto.scrypt`.
- Stored format is `salt.hash`.

### Serialization

- Password is hidden from API responses through custom serialization.
- `UserDto` is the public response shape.

### User Deactivation

- User deactivation is status-based, not physical delete.
- Deactivation means setting `status = INACTIVE`.
- Inactive users are blocked from signin.
- Inactive users are blocked from password change.

### User Module Scope Decision

- User module is considered good enough for phase 1.
- No admin features yet.
- Some user hardening and cleanup is intentionally postponed.

## Phase 2: Deferred User Work

- Add admin-aware authorization rules.
- Revisit who can update which user fields.
- Revisit whether inactive users should be blocked from more actions beyond signin/change-password.
- Add cleaner role-based behavior once admin support exists.
- Add any postponed cleanup or hardening that is not needed for phase 1.

### User Deactivation Side Effects

- User deactivation may later become a coordinated business workflow instead of only setting `status = INACTIVE`.
- The intended phase-2 direction is a chain reaction model.

Agreed phase-2 chain reaction direction for an `INACTIVE` user:

- A deactivated user should not be able to sign in.
- A deactivated user should not be able to create new accounts.
- Accounts owned by the deactivated user should be closed.
- Once those accounts are closed, account-close side effects should run for related modules.
- That means related cards, fixed deposits, pending transactions, and pending transfers should react through the account-close workflow rather than through ad hoc logic in many places.

### User Deactivation Workflow Direction

- User deactivation should eventually trigger account closure for all of the user's accounts.
- Account closure should then trigger the documented account-level side effects.
- This should be treated as a transactional business flow where possible.
- The goal is a consistent chain reaction model:
  - `User INACTIVE`
  - owned accounts become `CLOSED`
  - related module records react according to account-close rules

## Account Module

## Phase 1: Current Agreed State

### Account Entity Direction

- An account belongs to one user.
- A user can own multiple accounts.
- Account fields include:
  - `accountNumber`
  - `accountType`
  - `balance`
  - `status`
  - timestamps

### Account Creation Rules

- Any signed-in user can currently create an account.
- For phase 1, `userId` is provided explicitly in the request body.
- The client sends only:
  - `userId`
  - `accountType`
- The server owns and sets:
  - `accountNumber`
  - `balance = 0`
  - `status = ACTIVE`
  - the linked `user`

### Account Creation Validation Rules

- Reject if the target user does not exist.
- Reject if the target user is `INACTIVE`.

### Account Number Generation

- Account number is generated on the server before insert.
- Current implementation uses the latest account number and increments it.
- This is acceptable for phase 1.
- This may need improvement later for concurrency/race-safety.

### Account Responses

- Account responses use `AccountDto`.
- The DTO currently exposes:
  - `id`
  - `accountNumber`
  - `accountType`
  - `balance`
  - `status`
  - `createdAt`
  - `updatedAt`
  - `userId`

### Response Design Decision

- Default account responses should stay flat.
- Full nested `user` objects should not be returned by default in account responses.
- If owner reference is needed, `userId` is preferred over embedding the full user object.

### Account Read Endpoints

- Create endpoint exists.
- Single-account read exists.
- Account list exists.
- List currently uses pagination.

### Account Update Rules

- Phase-1 update is intentionally narrow.
- Only `accountType` may be updated.
- The following are not client-editable:
  - `balance`
  - `status`
  - `accountNumber`
  - `user/userId`

### Account Close Rules

- Account close is status-based, not physical delete.
- Closing an account means setting `status = CLOSED`.
- Closing an already closed account should be rejected.

## Known Phase-1 Limitation

- Because account creation currently accepts `userId` from the request body, a signed-in user can create an account for another user.
- This is accepted as a temporary phase-1 simplification.
- This should be tightened in phase 2.

## Phase 2: Deferred Account Work

### Authorization Model

- Introduce stronger authorization rules.
- Admin should be able to create/update accounts for users.
- Current user should be able to create/update only their own account according to final business rules.
- The current phase-1 `userId` body-driven ownership model should be revisited.

### Route and API Cleanup

- Consider moving from singular `account` routes to plural `accounts`.
- Keep resource naming more REST-consistent.

### Stronger Account Number Strategy

- Revisit account number generation for concurrency safety.
- Consider a more reliable sequence-based or otherwise collision-safe strategy.

### Account Close Side Effects

- Account closure will eventually affect related modules.
- This should not remain a plain status flip once those modules are implemented.

Agreed phase-2 side effects for a `CLOSED` account:

- A closed account cannot create new transactions.
- A closed account cannot send new transfers.
- A closed account cannot receive new transfers.
- A closed account cannot get new cards.
- A closed account cannot create new fixed deposits.
- Historical records should remain available.
- Cards linked to the closed account should become inactive/blocked.
- Fixed deposits linked to the closed account should move to `CLOSED`.
- Pending transactions linked to the closed account should move to `FAILED`.
- Pending transfers linked to the closed account should move to `FAILED`.

### Transactional Workflow Requirement

- These account-close side effects should eventually be implemented as a coordinated business workflow.
- They should ideally run inside a database transaction.
- This should be designed carefully before implementation because it touches multiple modules.

This same principle should apply one level above as well:

- user deactivation should eventually be a coordinated workflow
- account closure should be one part of that workflow
- related entity updates should happen through the chain reaction in a predictable order

## Current Recommended Boundary

At this point, phase 1 for `User` and `Account` is in a workable state.

The next architecture work should focus on:

- designing related-module behavior around account closure
- or beginning the next module with similarly narrow phase-1 rules

The key principle going forward is:

- keep phase 1 small and explicit
- keep server-owned fields under service control
- avoid physical deletes
- avoid broad nested responses by default
