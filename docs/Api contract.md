# Latchpoint API Contract (Draft)

Status: **Draft — for team review in Week 1.** Update this doc as endpoints are finalised; treat it as the source of truth both `mobile-app` and `adapter-layer` build against.

Base URL (local dev): `http://localhost:8080`

All request/response bodies are JSON. All endpoints (except `/login`) require a valid session token in the `Authorization: Bearer <token>` header.

---

## Auth Endpoints (called by Adapter Layer / legacy systems)

### `POST /login`
Authenticate a user with credentials.

**Request**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response — 200 OK (MFA not required)**
```json
{
  "sessionToken": "string",
  "expiresAt": "ISO-8601 datetime"
}
```

**Response — 200 OK (MFA required)**
```json
{
  "mfaRequired": true,
  "mfaChallengeId": "string"
}
```

**Response — 401 Unauthorized**
```json
{ "error": "invalid_credentials" }
```

---

### `POST /verify-mfa`
Complete login when MFA is required.

**Request**
```json
{
  "mfaChallengeId": "string",
  "code": "string"
}
```

**Response — 200 OK**
```json
{
  "sessionToken": "string",
  "expiresAt": "ISO-8601 datetime"
}
```

**Response — 401 Unauthorized**
```json
{ "error": "invalid_mfa_code" }
```

---

### `POST /session/validate`
Check whether a session token is still valid. Called by the legacy system (via Adapter Layer) on protected requests.

**Request**
```json
{ "sessionToken": "string" }
```

**Response — 200 OK**
```json
{ "valid": true, "username": "string", "expiresAt": "ISO-8601 datetime" }
```

**Response — 200 OK (invalid/expired)**
```json
{ "valid": false }
```

---

### `POST /logout`
Invalidate a session token.

**Request**
```json
{ "sessionToken": "string" }
```

**Response — 204 No Content**

---

## Management Endpoints (called by Mobile App)

### `GET /management/dashboard`
Summary data for the Dashboard screen.

**Response — 200 OK**
```json
{
  "authStatus": "secure | at_risk",
  "recentLogins": { "success": 0, "failed": 0 },
  "mfaEnabled": true,
  "legacyConnectionStatus": "connected | disconnected"
}
```

---

### `GET /management/events`
Authentication event log, for the Event Log screen.

**Query params:** `?status=success|failed&from=ISO-8601&to=ISO-8601`

**Response — 200 OK**
```json
{
  "events": [
    {
      "id": "string",
      "timestamp": "ISO-8601 datetime",
      "username": "string",
      "status": "success | failed",
      "ipAddress": "string"
    }
  ]
}
```

---

### `GET /management/config`
Current framework configuration, for the Config screen.

**Response — 200 OK**
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
    "endpoint": "string",
    "status": "connected | disconnected"
  }
}
```

### `PUT /management/config`
Update configuration.

**Request:** same shape as `GET /management/config` response.

**Response — 200 OK:** updated config object.

---

### `GET /management/alerts`
Suspicious activity feed, for the Alerts screen.

**Response — 200 OK**
```json
{
  "alerts": [
    {
      "id": "string",
      "type": "failed_login_spike | adapter_disconnect",
      "message": "string",
      "timestamp": "ISO-8601 datetime"
    }
  ]
}
```

---

## Open Questions (resolve in Week 1 meeting)

- [ ] Auth for the Management endpoints — same session token as end users, or a separate admin/owner login?
- [ ] Pagination for `/management/events` — needed once event volume grows?
- [ ] Rate limiting on `/login` — how many failed attempts before lockout, and is that configurable per business?