# Latchpoint API Contract

This document describes the authentication, management and legacy-adapter APIs implemented for the Latchpoint capstone prototype.

## 1. Service addresses

Auth Core and Adapter Layer run as separate services.

| Service | Default host address | Container address |
| --- | --- | --- |
| Auth Core | `http://localhost:8080` | `http://auth-core:8080` |
| Adapter Layer | `http://localhost:8081` | `http://adapter-layer:8081` |
| Demonstration legacy application | `http://localhost:8082` | `http://legacy-app:8082` |

Host ports can be changed through Docker Compose environment variables. For example, `AUTH_CORE_PORT=8085` exposes Auth Core at `http://localhost:8085`, while its container continues listening on port 8080.

Examples below use the default host ports.

## 2. Request formats and authentication

Auth Core accepts JSON request bodies:

```http
Content-Type: application/json
```

Authenticated requests use a session token:

```http
Authorization: Bearer <sessionToken>
```

### Access requirements

| Endpoint | Access requirement |
| --- | --- |
| `POST /login` | No existing session required |
| `POST /verify-mfa` | Valid pending MFA challenge |
| `POST /session/validate` | Session token supplied in request body |
| `POST /logout` | Session token supplied in request body |
| `GET /actuator/health` | Public |
| `/management/**` | Valid ADMIN bearer token |
| `POST /mfa/setup` | Valid bearer token and current account password |
| `POST /mfa/confirm` | Valid bearer token for the account being enrolled |

END_USER sessions cannot access management endpoints.

Management requests without sufficient authentication or authority are rejected with HTTP 403 by the current Spring Security configuration. Such responses may have an empty body.

Optional response fields may be returned as `null`. Clients should inspect the relevant fields rather than depend on their omission.

## 3. Authentication endpoints

### POST /login

Verifies account credentials and checks password expiry.

An account with active MFA enrollment must complete a second factor when global MFA is enabled. Otherwise, successful authentication creates a session immediately.

**Request**

```json
{
  "username": "admin",
  "password": "account password"
}
```

**Response: 200 — session created**

```json
{
  "sessionToken": "<signed session token>",
  "expiresAt": "2026-10-22T10:30:00Z",
  "mfaRequired": null,
  "mfaChallengeId": null
}
```

**Response: 200 — MFA required**

```json
{
  "sessionToken": null,
  "expiresAt": null,
  "mfaRequired": true,
  "mfaChallengeId": "<challenge identifier>"
}
```

A challenge is not an authenticated session. The client must submit it to `/verify-mfa` before granting access.

**Errors**

| Status | Error |
| --- | --- |
| 400 | `invalid_request` |
| 401 | `invalid_credentials` |
| 403 | `password_expired` |
| 429 | `too_many_attempts` |

Incorrect credentials and disabled accounts return the same credentials error.

### POST /verify-mfa

Completes authentication using a pending challenge and a six-digit TOTP code.

**Request**

```json
{
  "mfaChallengeId": "<challenge identifier>",
  "code": "123456"
}
```

**Response: 200**

```json
{
  "sessionToken": "<signed session token>",
  "expiresAt": "2026-10-22T10:30:00Z",
  "mfaRequired": null,
  "mfaChallengeId": null
}
```

Successful verification consumes the challenge. The account must still be enabled and its password must not be expired before a session is issued.

**Errors**

| Status | Error |
| --- | --- |
| 400 | `invalid_request` |
| 401 | `invalid_mfa_code` |
| 403 | `password_expired` |
| 429 | `too_many_attempts` |

An invalid, expired or consumed challenge is rejected. The code must contain exactly six decimal digits.

### POST /session/validate

Checks the supplied token’s signature, expiration and backing server-side session.

**Request**

```json
{
  "sessionToken": "<session token>"
}
```

**Response: 200 — valid**

```json
{
  "valid": true,
  "username": "admin",
  "expiresAt": "2026-10-22T10:30:00Z"
}
```

**Response: 200 — invalid**

```json
{
  "valid": false,
  "username": null,
  "expiresAt": null
}
```

A well-formed validation request returns HTTP 200 for both valid and invalid sessions. An empty token fails request validation.

The current implementation also converts exceptions encountered during controller-level session validation into `valid: false`; clients cannot use this response alone to distinguish every operational failure from session rejection.

### POST /logout

Invalidates the supplied server-side session.

**Request**

```json
{
  "sessionToken": "<session token>"
}
```

**Response: 204 No Content**

Logging out an already invalid or expired session also returns HTTP 204.

Subsequent validation of an invalidated token returns `valid: false`.

## 4. Session and password policies

### Session lifetime

New sessions expire at the shorter of:

- The saved `sessionTimeoutMinutes`.
- The configured JWT lifetime.

The login response reports the stored session expiration.

Changing the saved timeout affects newly created sessions. Existing sessions retain their original expiration.

### Password composition

The validator supports:

- Minimum length.
- Uppercase requirement.
- Numeric requirement.
- Symbol requirement.

Whitespace alone does not satisfy the symbol requirement.

The management API exposes minimum length and symbol requirement. Uppercase and numeric requirements remain part of the stored configuration.

Java account seeding validates a password before hashing and saving it. Direct SQL inserts bypass this application validation.

Strengthening composition rules does not automatically reject an existing password during login.

### Password expiry

The expiry check uses the saved `passwordPolicy.expiryDays`.

Password age is measured from `password_changed_at`. Existing accounts without that value fall back to their creation date.

Assigning a different password hash through the application’s setter updates the password-change timestamp. Unrelated account changes do not reset password age.

Expired passwords are rejected before a new session is issued. Existing sessions retain their session expiration.

Password replacement is currently handled through administrator provisioning; the prototype does not provide a password-reset interface.

## 5. Authentication attempt limits

Default limits are:

| Setting | Default |
| --- | --- |
| Maximum failures | 5 |
| Failure window | 15 minutes |

These are configured through `LOGIN_MAX_FAILURES` and `LOGIN_BLOCK_MINUTES` in Auth Core’s environment.

Password-login checks count recent `LOGIN_FAILED` events for the supplied username. After five recorded failures, the next sequential password attempt is rejected with HTTP 429.

MFA checks count recent `MFA_FAILED` events for the account. The verification attempt that reaches the configured failure limit returns HTTP 429 and consumes its challenge.

Requesting another challenge does not clear the account’s MFA failure history. Enrollment authentication failures also contribute to that MFA history.

Successful authentication does not clear recent failure records. Attempts become available as older failures leave the rolling window.

The password failure-count check and failure recording are separate operations. Simultaneous password requests can exceed the sequential threshold. MFA verification is synchronized within one Auth Core instance; it does not provide coordination across multiple instances.

## 6. Management endpoints

Every endpoint in this section requires an ADMIN bearer token.

### GET /management/dashboard

Returns an authentication summary for the preceding 24 hours.

**Response: 200**

```json
{
  "authStatus": "secure",
  "recentLogins": {
    "success": 12,
    "failed": 3
  },
  "mfaEnabled": true,
  "legacyConnectionStatus": "connected"
}
```

| Field | Meaning |
| --- | --- |
| `authStatus` | `at_risk` when the preceding 24-hour `LOGIN_FAILED` count exceeds 20; otherwise `secure` |
| `recentLogins.success` | Count of `LOGIN_SUCCESS` events |
| `recentLogins.failed` | Count of `LOGIN_FAILED` events |
| `mfaEnabled` | Saved global MFA setting |
| `legacyConnectionStatus` | Result of checking the adapter’s health endpoint |

The status is a threshold-based indicator. MFA failures are included in the alert calculation described below, but are not included in `recentLogins.failed`.

Multiple successful audit events can exist for one authentication flow. Dashboard success counts use `LOGIN_SUCCESS`, rather than counting every successful event.

### GET /management/events

Returns authentication audit events ordered newest first.

**Query parameters**

| Parameter | Required | Meaning |
| --- | --- | --- |
| `status` | No | `success` or `failed` |
| `from` | No | Inclusive start timestamp |
| `to` | No | Inclusive end timestamp |

Timestamps must use ISO-8601 format. URL-encode query values when necessary.

If `to` is omitted, it defaults to the current time. If `from` is omitted, it defaults to 30 days before the effective end time.

**Example**

```http
GET /management/events?status=failed&from=2026-10-21T00:00:00Z&to=2026-10-22T23:59:59Z
```

**Response: 200**

```json
{
  "events": [
    {
      "id": "42",
      "timestamp": "2026-10-22T09:45:00Z",
      "username": "admin",
      "status": "failed",
      "ipAddress": "172.20.0.4"
    }
  ]
}
```

The current implementation extracts username and outcome from the stored details format:

```text
failed | user=admin
```

Older records using another format may have no extracted username.

`status` represents the recorded outcome, not the event type. Requests through the adapter may record the adapter’s address rather than the original browser address.

**Errors**

| Status | Error | Cause |
| --- | --- | --- |
| 400 | `invalid_event_status` | Unsupported status filter |
| 400 | `invalid_date_range` | Start time is later than end time |

Pagination is not implemented.

### GET /management/config

Returns saved security settings and adapter connection information.

**Response: 200**

```json
{
  "mfaEnabled": true,
  "passwordPolicy": {
    "minLength": 8,
    "requireSymbol": true,
    "expiryDays": 90
  },
  "sessionTimeoutMinutes": 30,
  "adapterConnection": {
    "endpoint": "http://adapter-layer:8081",
    "status": "connected"
  }
}
```

### PUT /management/config

Updates the supported security settings.

**Request**

```json
{
  "mfaEnabled": true,
  "passwordPolicy": {
    "minLength": 10,
    "requireSymbol": true,
    "expiryDays": 90
  },
  "sessionTimeoutMinutes": 30
}
```

Supply the complete writable configuration, including the full password-policy object. This endpoint is not a partial-update operation.

**Response: 200**

Returns the same configuration structure as `GET /management/config`, including current adapter connection information.

**Validation**

| Setting | Allowed range |
| --- | --- |
| `passwordPolicy.minLength` | 8–128 |
| `passwordPolicy.expiryDays` | 1–3650 days |
| `sessionTimeoutMinutes` | 1–1440 minutes |

An invalid configuration returns HTTP 400:

```json
{
  "error": "invalid_configuration"
}
```

**MFA behaviour**

- When global MFA is enabled, accounts with active enrollment require MFA during new logins.
- When global MFA is disabled, new logins do not require MFA.
- Disabling global MFA preserves enrolled secrets.
- Enabling global MFA does not automatically enroll accounts.

`adapterConnection` is reported information. Including it in an update does not change the adapter endpoint. That endpoint is configured on the server.

### GET /management/alerts

Returns alerts for conditions present when the endpoint is requested.

**Response: 200**

```json
{
  "alerts": [
    {
      "id": "failed-login-spike",
      "type": "failed_login_spike",
      "message": "Multiple authentication failures detected in the last 15 minutes.",
      "timestamp": "2026-10-22T09:45:00Z"
    },
    {
      "id": "adapter-disconnected",
      "type": "adapter_disconnect",
      "message": "The legacy adapter is unreachable or unhealthy.",
      "timestamp": "2026-10-22T09:45:00Z"
    }
  ]
}
```

**Alert conditions**

| Type | Trigger |
| --- | --- |
| `failed_login_spike` | Combined `LOGIN_FAILED` and `MFA_FAILED` events reach the configured failure threshold within the configured window |
| `adapter_disconnect` | Adapter health cannot be confirmed |

No current alerts:

```json
{
  "alerts": []
}
```

Alerts are calculated rather than stored as a separate notification history. Their timestamps reflect the calculation time. A disconnection alert disappears when the adapter becomes healthy again.

## 7. MFA enrollment endpoints

These endpoints operate on the user identified by the bearer token. They do not accept another account’s username.

### POST /mfa/setup

Verifies the current account password and creates or returns a temporary enrollment key.

**Request**

```json
{
  "password": "current account password"
}
```

**Response: 200**

```json
{
  "secret": "<base32 setup key>",
  "expiresAt": "2026-10-22T09:50:00Z"
}
```

The response uses:

```http
Cache-Control: no-store
```

The setup key can be entered into a TOTP authenticator using a time-based account. It must be kept private.

The key is not activated until confirmation succeeds. Repeating setup before expiry returns the existing pending key.

**Errors**

| Status | Error |
| --- | --- |
| 400 | `invalid_request` |
| 400 | `mfa_already_enabled` |
| 401 | `invalid_credentials` |
| 429 | `too_many_attempts` |

HTTP 429 can also occur when the pending-enrollment capacity has been reached.

### POST /mfa/confirm

Confirms enrollment using the account’s pending key and a six-digit authenticator code.

**Request**

```json
{
  "code": "123456"
}
```

**Response: 204 No Content**

Successful confirmation:

1. Saves and activates the MFA enrollment.
2. Removes the pending setup.
3. Revokes the account’s existing sessions.

The user must authenticate again afterward.

**Errors**

| Status | Error |
| --- | --- |
| 400 | `invalid_request` |
| 400 | `mfa_already_enabled` |
| 401 | `invalid_mfa_code` |
| 429 | `too_many_attempts` |

Pending enrollment is held in memory and expires according to `MFA_CHALLENGE_MINUTES`, which defaults to five minutes. Restarting Auth Core discards pending enrollment.

The current entity stores confirmed TOTP secrets without application-level encryption. Enrollment and authentication use the existing TOTP library.

## 8. Legacy adapter API

The adapter translates legacy requests into Auth Core requests.

### POST /api/v1/legacy/login

Accepts either:

```http
Content-Type: application/json
```

```json
{
  "username": "demo_user",
  "password": "account password"
}
```

or:

```http
Content-Type: application/x-www-form-urlencoded
```

```text
username=demo_user&password=account-password
```

An MFA response contains a pending challenge and does not issue a session cookie.

Successful completed authentication returns the session response and sets the `LATCHPOINT_SESSION` cookie.

### POST /api/v1/legacy/verify-mfa

Accepts JSON or URL-encoded form data containing:

```json
{
  "mfaChallengeId": "<challenge identifier>",
  "code": "123456"
}
```

Successful verification returns the session response and sets the session cookie.

### GET /api/v1/legacy/check-session

Receives a token through either:

```http
Cookie: LATCHPOINT_SESSION=<sessionToken>
```

or:

```http
X-Session-Token: <sessionToken>
```

A nonblank cookie takes precedence over the header.

| Status | Meaning |
| --- | --- |
| 200 | Session valid; returns username and expiration |
| 401 | Token missing or session invalid |

### POST /api/v1/legacy/logout

Receives the token through the same cookie/header options.

Calls Auth Core to invalidate the session and clears the cookie.

**Response: 204 No Content**

The adapter clears the cookie even if downstream invalidation fails. Therefore, successful cookie clearing alone does not prove server-side revocation during an outage.

### Adapter error responses

Auth Core errors are forwarded using their HTTP status, with an adapter error wrapper:

```json
{
  "error": "auth_error",
  "message": "Downstream authentication error",
  "timestamp": "2026-10-22T09:45:00Z"
}
```

Form/JSON binding validation failures return HTTP 400 with `validation_error`.

Connection failures to Auth Core return HTTP 503 with `service_unavailable`.

### Cookie behaviour

The current local-development cookie uses:

- Name: `LATCHPOINT_SESSION`
- `HttpOnly`
- `SameSite=Lax`
- Path `/`
- A fixed 24-hour cookie lifetime
- `Secure=false` for the local HTTP demonstration

The server-side session can expire before the cookie. Possessing a cookie does not override session validation.

## 9. Health endpoints

Auth Core and Adapter Layer expose:

```http
GET /actuator/health
```

A healthy response includes:

```json
{
  "status": "UP"
}
```

Management connectivity checks call the adapter health endpoint with one-second connection and read timeouts.

A healthy adapter response confirms adapter availability. It does not verify every function of the connected legacy application.

## 10. Demonstration application

The demonstration legacy application forwards browser requests through these routes:

| Route | Purpose |
| --- | --- |
| `POST /login` | Submit credentials through the adapter |
| `POST /verify-mfa` | Complete MFA through the adapter |
| `GET /portal` | Protected demonstration page |
| `GET /api/me` | Return validated session identity |
| `POST /logout` | Request invalidation and clear the browser cookie |

These routes are demonstration-application routes, separate from Auth Core’s endpoints.

Protected responses use `Cache-Control: no-store`. The legacy application checks sessions through the adapter before serving protected content.

## 11. Verification status

Endpoint implementation and test coverage are tracked separately.

See `docs/Test Results.md` for verified scenarios, pending checks and known limitations. The presence of an endpoint in this contract does not imply that every success, error and concurrency case has been tested.
