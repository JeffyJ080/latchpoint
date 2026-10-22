# Latchpoint — Development Setup Guide

## 1. Purpose

This guide explains how to run the Latchpoint backend and legacy demonstration application locally.

The Docker stack contains four services:

| Service | Purpose |
| --- | --- |
| MySQL | Stores users, sessions, MFA settings, security configuration and authentication events |
| Auth Core | Handles authentication, MFA verification, sessions and management APIs |
| Adapter Layer | Connects the legacy application to Auth Core |
| Legacy Application | Provides a browser interface for demonstrating authentication |

The mobile management application runs separately and requires integration with Auth Core.

## 2. Prerequisites

For the Docker setup, install:

- Git.
- Docker Desktop on Windows or macOS, or Docker Engine with Docker Compose on Linux.

Ensure Docker is running before starting the project.

Check the installations:

```powershell
git --version
docker --version
docker compose version
```

Java and Maven are only required when building, running or testing the Java services outside Docker. The Java services target Java 17.

## 3. Get the Project

Clone the repository:

```powershell
git clone https://github.com/JeffyJ080/latchpoint.git
```

Open the project directory:

```powershell
cd latchpoint
```

Use the branch containing the implementation being evaluated. Changes on an unmerged branch will not automatically be included when cloning the default branch.

## 4. Configure the Environment

Create a local environment file.

In PowerShell:

```powershell
Copy-Item .env.example .env
```

On Linux or macOS:

```bash
cp .env.example .env
```

Edit `.env` before starting the services.

| Variable | Purpose |
| --- | --- |
| `DB_NAME` | Database name; keep `latchpoint_db` with the supplied initialization script |
| `DB_USER` | Application database username |
| `DB_PASSWORD` | Application database password |
| `DB_ROOT_PASSWORD` | MySQL root password |
| `DB_PORT` | Published MySQL port on the host |
| `AUTH_CORE_PORT` | Published Auth Core port on the host |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `JWT_EXPIRY_MINUTES` | Token lifetime |
| `SESSION_TIMEOUT_MINUTES` | Session timeout fallback when no saved configuration exists |
| `ADAPTER_LAYER_PORT` | Published Adapter Layer port |
| `AUTH_CORE_BASE_URL` | Address the adapter uses to reach Auth Core inside Docker |
| `LEGACY_APP_PORT` | Optional published legacy application port; defaults to `8082` |

For the setup used during manual testing:

```dotenv
AUTH_CORE_PORT=8085
ADAPTER_LAYER_PORT=8081
LEGACY_APP_PORT=8082
AUTH_CORE_BASE_URL=http://auth-core:8080
```

Auth Core remains on port `8080` inside Docker. The host accesses it through port `8085`.

Keep `AUTH_CORE_BASE_URL=http://auth-core:8080` when both Java services run in Docker. Changing the host port does not change the internal service address.

Use local database passwords and a randomly generated JWT signing secret of at least 32 bytes. Do not commit `.env`.

The supplied SQL script explicitly selects `latchpoint_db`. Changing only `DB_NAME` does not update that script.

## 5. Start the Stack

Run this command from the repository root:

```powershell
docker compose up -d --build
```

Check the services:

```powershell
docker compose ps
```

The stack should contain:

- `latchpoint-mysql`
- `latchpoint-auth-core`
- `latchpoint-adapter-layer`
- `latchpoint-legacy-app`

MySQL has a configured health check. The other containers may show as running without displaying a separate healthy status.

Auth Core waits for MySQL to become healthy. Allow the remaining services time to complete startup before testing them.

View startup logs:

```powershell
docker compose logs --tail=100
```

## 6. Verify Service Availability

With `AUTH_CORE_PORT=8085`, check Auth Core:

```powershell
Invoke-RestMethod -Uri "http://localhost:8085/actuator/health"
```

Check the adapter:

```powershell
Invoke-RestMethod -Uri "http://localhost:8081/actuator/health"
```

A successful health response reports:

```json
{
  "status": "UP"
}
```

Open the legacy application:

```text
http://localhost:8082
```

If `.env` uses another published port, adjust the corresponding URL.

A service health response confirms that endpoint is responding. Authentication and integration should also be checked through the login flow.

## 7. Initial Database and Demo Accounts

When MySQL starts with an empty data volume, it runs `db/init.sql`.

The script creates the schema, default security configuration and these demonstration accounts:

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `Admin123!` | `ADMIN` |
| `demo_user` | `UserPassword123!` | `END_USER` |

These credentials apply to accounts created by the supplied initialization script. An existing database may contain different passwords or account settings.

The script does not provision an active MFA secret for either account. A globally enabled MFA setting therefore does not, by itself, make these accounts prompt for a code. The account must also have an active MFA enrollment.

The initialization script runs only when the MySQL data directory is empty. Rebuilding containers does not rerun it against an existing database.

## 8. Optional Development Account Seeding

Auth Core can optionally create a development account on startup.

Add these variables to `.env`:

```dotenv
DEV_SEED_ENABLED=true
DEV_SEED_USERNAME=local_tester
DEV_SEED_PASSWORD=LocalTester123!
```

Recreate Auth Core:

```powershell
docker compose up -d --build auth-core
```

The seeder:

- Creates the account only if the username does not already exist.
- Validates the password against the saved password policy.
- Assigns `ADMIN` when the username is `admin`, ignoring case.
- Assigns `END_USER` to other usernames.
- Does not replace an existing account’s password.

Because the SQL initialization already creates `admin`, setting `DEV_SEED_USERNAME=admin` will not overwrite that account.

A password that fails policy validation can prevent Auth Core from completing startup while seeding is enabled. Check the service logs if startup fails.

Disable optional seeding when it is no longer needed:

```dotenv
DEV_SEED_ENABLED=false
```

## 9. Demonstration Flow

Use the legacy application to check:

1. A valid account can log in and reach the protected page.
2. Invalid credentials are rejected.
3. An enrolled account receives an MFA challenge when global MFA is enabled.
4. A valid MFA code completes authentication.
5. Logout returns the user to the login page.
6. A revoked or expired session cannot access protected content.
7. Repeated failed attempts eventually receive a rate-limit response.

Management endpoints require an administrator session. An ordinary end-user account should not be able to access them.

The API contract contains request formats and endpoint details. Record observed results in the test report.

## 10. Configuration Behaviour

The saved management configuration controls session timeout and the exposed security policy settings.

`SESSION_TIMEOUT_MINUTES` is a fallback; changing it does not override an existing saved timeout.

New sessions use the configured timeout, bounded by the token expiry. Changing the timeout does not recalculate existing session expiry times.

Password expiry is checked during authentication. The MVP does not provide a password-reset interface.

Global MFA enforcement applies to accounts with active MFA enrollment. It does not automatically enroll accounts.

## 11. Mobile Integration

The mobile management application connects to Auth Core.

For a physical device, use the development computer’s reachable LAN address, for example:

```text
http://192.168.1.50:8085
```

Replace the example IP address with the computer’s actual address. On a phone, `localhost` refers to the phone itself.

The device must be able to reach the computer, and the host firewall must allow the selected port.

Use the mobile team’s current installation and launch instructions for its application directory. Mobile integration should be recorded as verified only after testing the actual application against the backend.

## 12. Development Commands

Run these commands from the repository root unless stated otherwise.

| Task | Command |
| --- | --- |
| Start or rebuild the stack | `docker compose up -d --build` |
| Rebuild Auth Core | `docker compose up -d --build auth-core` |
| Rebuild the adapter | `docker compose up -d --build adapter-layer` |
| Rebuild the legacy application | `docker compose up -d --build legacy-app` |
| Show service status | `docker compose ps` |
| Follow Auth Core logs | `docker compose logs -f auth-core` |
| Follow adapter logs | `docker compose logs -f adapter-layer` |
| Stop the stack | `docker compose down` |
| Restart the stack | `docker compose restart` |
| Run Auth Core tests with local Maven | `mvn -f auth-core/pom.xml test` |
| Run adapter tests with local Maven | `mvn -f adapter-layer/pom.xml test` |

Running a test command is separate from demonstrating that its tests passed. Record the actual result and the revision tested.

## 13. Data Persistence

MySQL stores data in the named `mysql-data` volume.

Normal container restarts and `docker compose down` preserve that volume.

To verify persistence:

1. Record a recognizable saved configuration value and an authentication event.
2. Stop the stack with `docker compose down`.
3. Start it again with `docker compose up -d`.
4. Log in again and confirm the saved value and event remain.

Pending MFA challenges are stored in application memory and are lost when Auth Core restarts.

## 14. Troubleshooting

### A published port is already in use

Change the corresponding host port in `.env`, then recreate the affected service.

For example:

```dotenv
AUTH_CORE_PORT=8085
DB_PORT=3307
```

Docker services continue using their internal ports.

### Database changes in `init.sql` do not appear

The existing volume has already been initialized. Apply the required database change to the existing development database, or deliberately recreate a disposable database.

For a complete reset of disposable local data:

```powershell
docker compose down -v
```

Then:

```powershell
docker compose up -d --build
```

**The `-v` option deletes the Compose-managed database volume and its stored data.**

### The adapter cannot reach Auth Core

Check that:

- Auth Core is running.
- `AUTH_CORE_BASE_URL` is `http://auth-core:8080` inside Docker.
- Auth Core has completed startup.
- The adapter logs do not show connection failures.

### Valid credentials receive HTTP 429

The account may have reached the failure threshold. The default limit is five failures within a rolling fifteen-minute window.

A successful login does not erase earlier failures. Allow enough failures to age out of the window before retrying.

### Login receives `password_expired`

The account’s password age exceeds the saved expiry policy. This is an authentication policy result, not a Docker startup error.

### Updated code is not visible

Rebuild and recreate the affected service using `docker compose up -d --build`.

### A second stack reports container-name conflicts

The supplied Compose file assigns explicit container names. A different Compose project name alone will not prevent those name conflicts.

## 15. Related Documentation

- `README.md` — project overview and quick start.
- `docs/Api contract.md` — endpoint formats and behaviour.
- `docs/Test Results.md` — manual verification results, pending checks and evaluation limitations.
