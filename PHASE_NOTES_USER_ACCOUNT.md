# Banking System Phase Notes

This document captures the current agreed project direction for the phase-1 backend.
It is focused on architecture, domain rules, and phase boundaries.
It intentionally does not include test planning.

## Scope Covered

- User module
- Account module
- Transaction module
- Transfer module
- Card module
- Fixed Deposit module
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

### User Role

- `ADMIN`
- `USER`

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

### Admin Guard

- `AdminGuard` exists.
- It checks whether `req.currentUser.role === ADMIN`.
- It is currently being used on selected admin-only controller routes.

### Current User Decorator

- `@CurrentUser()` reads `req.currentUser` in controllers.

## Phase 1 Summary

The following modules now have a workable phase-1 base:

- `User`
- `Account`
- `Transaction`
- `Transfer`
- `Card`
- `FixedDeposit`

## User Module

## Phase 1: Current Agreed State

### User Entity

- `User.status` exists.
- `User.role` exists.
- User status defaults to `ACTIVE`.
- User role defaults to `USER`.
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

## User Role / Admin Phase: Current State

### Current Role Model

- Role is stored directly on the `users` table.
- Current role values are:
  - `ADMIN`
  - `USER`

### Current Admin-Only Routes

- `GET /users/all-users`
- `DELETE /users/:id`

### Current Shared User/Admin Rule

- `PATCH /users/:id` is a shared authenticated route.
- `ADMIN` can update any user.
- Normal `USER` can update only their own user record.

### Current User-Self Routes

- `GET /users/curUser`
- `PATCH /users/change-password`

These currently remain signed-in user flows, not admin-only flows.

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

- Account creation is a shared authenticated route.
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
- `ADMIN` may create an account for any target user.
- Normal `USER` may create an account only for themselves.

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
- Account list is currently admin-only at controller level.

### Account Update Rules

- Phase-1 update is intentionally narrow.
- Only `accountType` may be updated.
- The following are not client-editable:
  - `balance`
  - `status`
  - `accountNumber`
  - `user/userId`
- `PATCH /accounts/:id` is currently a shared authenticated route.
- `ADMIN` can update any account.
- Normal `USER` can update only their own account.

### Account Close Rules

- Account close is status-based, not physical delete.
- Closing an account means setting `status = CLOSED`.
- Closing an already closed account should be rejected.
- `DELETE /accounts/:id` is currently admin-only at controller level.

## Transaction Module

## Phase 1: Current Agreed State

### Transaction Domain Direction

- Transaction is treated as a ledger-style money movement record.
- Phase-1 transaction types are intentionally simple:
  - `DEPOSIT`
  - `WITHDRAWAL`
- These represent money direction, not business purpose.

### Phase-1 Meaning

- Direct deposit creates a `DEPOSIT` transaction.
- Direct withdrawal creates a `WITHDRAWAL` transaction.
- Transfer sender-side transaction is recorded as `WITHDRAWAL`.
- Transfer receiver-side transaction is recorded as `DEPOSIT`.
- Fixed deposit funding is recorded as `WITHDRAWAL`.

### Transaction Creation Rules

- Only the signed-in user can create a direct transaction on their own account.
- The client sends only:
  - `accountId`
  - `transactionType`
  - `amount`
- The server owns:
  - `status`
  - account balance update
  - any transfer linkage
- `ADMIN` does not bypass this ownership rule in the current design.

### Transaction Validation Rules

- Account must exist.
- Account must belong to the signed-in user for direct transactions.
- Account must not be `CLOSED`.
- Account must not be `PAUSED`.
- Amount must be positive.
- Withdrawal must fail if balance is insufficient.

### Transaction Execution Rules

- Deposit increases account balance.
- Withdrawal decreases account balance.
- On successful completion, transaction status becomes `SUCCESS`.

### Transaction Atomicity

- Direct transaction create flow now runs inside a database transaction.
- Account balance update and transaction insert are committed together.

### Transaction Read Rules

- Single transaction read exists.
- Transaction list exists with pagination.
- Current DTO shape exposes a flat response including `accountId`.
- Transaction list is currently admin-only at controller level.
- Single transaction read is currently authenticated, but not yet ownership-filtered in service.

### Transaction Mutability Rule

- Generic update is disabled.
- Generic delete is disabled.
- Transaction is being treated as immutable history in phase 1.

## Phase 2: Deferred Transaction Work

- Revisit ownership rules on transaction read endpoints where needed.
- Improve transaction messages and consistency.
- Consider internal/shared transaction-creation helpers to reduce repeated ledger logic.
- Add richer transaction purpose categorization if needed later without losing the debit/credit model.

## Transfer Module

## Phase 1: Current Agreed State

### Transfer Domain Direction

- Transfer is a higher-level movement between two accounts.
- Transfer is not the same as transaction.
- Transfer creates related transaction records internally.

### Transfer Creation Rules

- Only the signed-in user can initiate a transfer from their own source account.
- The client sends only:
  - `fromAccountId`
  - `toAccountId`
  - `amount`
- `ADMIN` does not bypass source-account ownership for transfer creation in the current design.

### Transfer Validation Rules

- Source account must exist.
- Destination account must exist.
- Signed-in user must own the source account.
- Source and destination account cannot be the same.
- Neither account may be `CLOSED`.
- Neither account may be `PAUSED`.
- Source account must have sufficient balance.

### Transfer Execution Rules

- Source account balance decreases.
- Destination account balance increases.
- Transfer is saved with `status = SUCCESS` in the current phase-1 flow.
- Two related transaction records are created:
  - source side `WITHDRAWAL`
  - destination side `DEPOSIT`

### Transfer Atomicity

- Transfer create flow runs inside a database transaction.
- Balance updates, transfer insert, and transaction inserts are committed together.

### Transfer Read Rules

- Single transfer read exists.
- Transfer list exists with pagination.
- Response DTO is flat and exposes:
  - `fromAccountId`
  - `toAccountId`
- Transfer list is currently admin-only at controller level.
- Single transfer read is currently authenticated, but not yet ownership-filtered in service.

### Transfer Mutability Rule

- Generic update is disabled.
- Generic delete is disabled.
- Transfer is being treated as immutable history in phase 1.

## Phase 2: Deferred Transfer Work

- Add clearer ownership rules on transfer reads if needed.
- Consider transfer-specific business types later if the project needs them.
- Consider pending/processing transfer workflows if asynchronous behavior is introduced later.
- Improve consistency of validation/error messaging.

## Card Module

## Phase 1: Current Agreed State

### Card Creation Rules

- Card creation is a shared authenticated route.
- The client sends:
  - `accountId`
  - `cardType`
  - optional `pin`
- The server owns:
  - `cardNumber`
  - `cvv`
  - `expiryDate`
  - `status = ACTIVE`
- `ADMIN` may create a card for any account.
- Normal `USER` may create a card only on their own account.

### Card Validation Rules

- Account must exist.
- Signed-in user must own the account.
- Account must not be `CLOSED`.
- Account must not be `PAUSED`.
- PIN is optional in phase 1.
- If provided, PIN must be exactly 4 characters.
- PIN is treated as digits-only input conceptually and is stored hashed.

### Card Response Rule

- `cvv` is not exposed in API responses.
- `pin` is not exposed in API responses.
- Card response DTO stays flat and includes `accountId`.

### Card Read Rules

- Single card read exists.
- Card list exists with pagination.
- Card list is currently admin-only at controller level.
- Single card read is currently authenticated, but not yet ownership-filtered in service.

### Card Update Rules

- Generic update route is kept, but the allowed fields are narrow.
- Supported phase-1 update fields:
  - `status`
  - `currentPin`
  - `newPin`
- PIN change requires both current and new PIN.
- New PIN is hashed before save.
- `PATCH /cards/:id` is currently a shared authenticated route.
- `ADMIN` can update any card.
- Normal `USER` can update only a card bound to their own account.

### Card Remove Rule

- Card remove is status-based, not physical delete.
- Remove means setting `status = BLOCKED`.
- Already blocked or expired cards should not be blocked again.
- `DELETE /cards/:id` is currently admin-only at controller level.

## Phase 2: Deferred Card Work

- Decide whether card reads should be owner-guarded more strictly.
- Revisit CVV storage strategy if the project later needs stronger realism.
- Decide how card expiry should be processed.
- Add dedicated card block/unblock workflows if needed instead of relying only on generic update.

## Fixed Deposit Module

## Phase 1: Current Agreed State

### Fixed Deposit Creation Rules

- Fixed deposit creation is a shared authenticated route.
- The client sends:
  - `accountId`
  - `principalAmount`
  - `tenure`
- The server owns:
  - `interestRate`
  - `status = ACTIVE`
  - `maturityDate`
- `ADMIN` may create a fixed deposit for any account.
- Normal `USER` may create a fixed deposit only on their own account.

### Fixed Deposit Validation Rules

- Account must exist.
- Signed-in user must own the account.
- Account must not be `CLOSED`.
- Account must not be `PAUSED`.
- Account must have sufficient balance.

### Fixed Deposit Execution Rules

- FD creation reduces account balance by `principalAmount`.
- FD creation also creates a related `WITHDRAWAL` transaction record.
- Maturity date is calculated from the current date and tenure.
- Current phase-1 implementation uses a fixed interest rate value in service logic.

### Fixed Deposit Atomicity

- Fixed deposit create flow runs inside a database transaction.
- Account balance update, FD insert, and transaction insert are committed together.

### Fixed Deposit Read Rules

- Single fixed deposit read exists.
- Fixed deposit list exists with pagination.
- Response DTO stays flat and includes `accountId`.
- Fixed deposit list is currently admin-only at controller level.
- Single fixed deposit read is currently authenticated, but not yet ownership-filtered in service.

### Fixed Deposit Mutability Rule

- Generic update is disabled in phase 1.

### Fixed Deposit Remove Rule

- Remove is status-based, not physical delete.
- Remove means setting `status = CLOSED`.
- Already closed fixed deposits should be rejected.
- `DELETE /fixed-deposit/:id` is currently admin-only at controller level.

## Phase 2: Deferred Fixed Deposit Work

- Decide whether maturity should be a background/process-driven transition.
- Add maturity payout behavior when the project is ready for it.
- Revisit interest-rate strategy so it is not hardcoded.
- Define whether closing an FD early should create a compensating deposit or penalty workflow.

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

## Phase 2 Checklist

The major phase-2 work that still remains:

- Continue strengthening authorization rules across modules.
- Revisit account creation so arbitrary signed-in users cannot create accounts for other users.
- Make read-access rules consistent across sensitive modules.
- Decide final admin boundaries per route instead of temporary partial rollout.
- Add service-level ownership checks for authenticated `GET :id` routes where needed.
- Review which shared routes should remain admin+owner and which should stay strictly owner-only.
- Decide whether routes should move from singular to plural naming.
- Improve message consistency and cleanup typos across services.
- Remove unused imports and other scaffold leftovers from commented-out routes.
- Revisit account-number generation for concurrency safety.
- Revisit card-number generation for concurrency safety.
- Add stronger transaction purpose modeling if the project later needs richer business categories.
- Add more explicit internal shared helpers for transaction creation where modules overlap.
- Design account-close side effects as a coordinated workflow:
  - close related cards
  - close related fixed deposits
  - fail pending transactions where applicable
  - fail pending transfers where applicable
- Design user-deactivation side effects as a coordinated workflow:
  - user becomes `INACTIVE`
  - owned accounts become `CLOSED`
  - account-close side effects then run
- Revisit transfer and fixed deposit maturity/processing workflows if async handling is added later.
- Revisit whether card/FD/transfer reads should be more strictly owner-scoped.
- Add any postponed hardening and cleanup that was intentionally deferred in phase 1.

## Current Recommended Boundary

At this point, phase 1 for the core modules is in a workable state.

The key principle going forward is:

- keep phase 1 small and explicit
- keep server-owned fields under service control
- avoid physical deletes
- prefer status-based lifecycle changes
- avoid broad nested responses by default
- use database transactions for money-moving multi-write flows
