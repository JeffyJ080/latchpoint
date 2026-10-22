# Latchpoint — MVP Test Results and Evaluation

**Report date:** 22 October 2026  
**Project:** Latchpoint  
**Purpose:** Record the functional checks completed for the capstone MVP and identify the remaining verification work.

## 1. Scope

Testing covers:

- Credential authentication.
- MFA challenge verification.
- Session validation, expiry and logout.
- Administrator access control.
- Authentication event recording.
- Security configuration.
- Adapter connectivity and alerts.
- Legacy application integration.

Mobile integration is tracked separately because it requires the mobile application and its team’s implementation.

This report describes the results observed during development. It does not claim comprehensive penetration testing or production certification.

## 2. Test Environment

| Component | Environment used |
|---|---|
| Database | MySQL in Docker |
| Auth Core | Docker, host port `8085` mapped to container port `8080` |
| Adapter Layer | Host port `8081` |
| Legacy demonstration application | Host port `8082` |
| Browser testing | Legacy application login and protected pages |
| Direct API checks | PowerShell requests |
| Accounts | Administrator, ordinary end user and an MFA-enrolled test account |

Results below were confirmed by the developer during guided manual testing on 21–22 October 2026.

The exact commit identifier was not captured in the test record. These results should not be treated as proof that every branch or later revision behaves identically.

## 3. Result Definitions

| Status | Meaning |
|---|---|
| Passed | The expected behaviour was reported during manual testing |
| Partially verified | Some behaviour was confirmed, but the full scenario remains untested |
| Pending | No confirmed result has been recorded |

## 4. Authentication and Session Results

| ID | Scenario | Expected result | Recorded result | Status |
|---|---|---|---|---|
| AUTH-01 | Log in with valid credentials | Authentication succeeds and protected content is accessible | Successful login and protected access confirmed | Passed |
| AUTH-02 | Log in with incorrect credentials | Request is rejected and a failed event is retained | Rejection and failed-event visibility confirmed | Passed |
| AUTH-03 | Repeated incorrect password attempts | Requests are blocked after the configured failure threshold | Initial failures returned `401`; a subsequent attempt returned `429` | Passed |
| AUTH-04 | Log in with an expired password | Authentication is rejected with `403 password_expired` | Expired-password rejection confirmed | Passed |
| SESSION-01 | Validate a current authenticated session | Response reports `valid: true` | Confirmed through PowerShell | Passed |
| SESSION-02 | Log out, then validate the same token | Response reports `valid: false` | Confirmed using the logged-out token | Passed |
| SESSION-03 | Allow a session to expire, then validate its token | Response reports `valid: false` | Confirmed after expiry | Passed |
| SESSION-04 | Use a shortened configured timeout | A newly created session expires at the configured time, within token lifetime | Expiry timing confirmed | Passed |
| SESSION-05 | Use browser Back after logout | Protected content is not retained as usable cached content | Logout and cache-handling fix reported working | Passed |
| SESSION-06 | Refresh protected content after logout | User is returned to login | Confirmed | Passed |

The session checks demonstrate rejection of revoked and expired tokens. They do not demonstrate that an attacker cannot use a stolen token while it remains valid.

## 5. MFA Results

| ID | Scenario | Expected result | Recorded result | Status |
|---|---|---|---|---|
| MFA-01 | Log in with an actively enrolled account while global MFA is enabled | Login returns an MFA challenge before creating a session | Challenge flow confirmed | Passed |
| MFA-02 | Submit a valid authenticator code | MFA succeeds and authentication completes | Successful verification confirmed | Passed |
| MFA-03 | Repeatedly submit incorrect MFA codes | Failures are rejected and the configured limit is enforced | Incorrect-code blocking confirmed | Passed |
| MFA-04 | Disable global MFA, then log in with the enrolled account | Login proceeds without an MFA challenge | Confirmed | Passed |
| MFA-05 | Re-enable global MFA, then log in with the enrolled account | MFA challenge is required again | Confirmed | Passed |
| MFA-06 | Reuse a successfully consumed challenge | Verification is rejected | No confirmed result recorded | Pending |
| MFA-07 | Submit a code after challenge expiry | Verification is rejected | No confirmed result recorded | Pending |
| MFA-08 | Complete optional MFA setup and confirmation endpoints | Enrollment is saved and existing sessions are revoked | No complete endpoint test recorded | Pending |

Global MFA testing used an already enrolled account. It does not establish that every account is enrolled or that enrollment is mandatory.

## 6. Authorization and Management Results

| ID | Scenario | Expected result | Recorded result | Status |
|---|---|---|---|---|
| ACCESS-01 | Access management endpoints with an administrator session | Request succeeds | Administrator access confirmed | Passed |
| ACCESS-02 | Access management endpoints with an ordinary end-user session | Request returns `403` | Forbidden response confirmed | Passed |
| EVENTS-01 | Trigger an unsuccessful login | Failed event remains available despite authentication failure | Failed-event persistence confirmed | Passed |
| EVENTS-02 | Retrieve events with `status=failed` | Only failed events are returned | Filtered results confirmed | Passed |
| EVENTS-03 | Retrieve events with `status=success` | Only successful events are returned | Filtered results confirmed | Passed |
| EVENTS-04 | Inspect returned event username and status | Username and status are separated correctly | Correct values confirmed | Passed |
| CONFIG-01 | Read and update management configuration | Supported settings are returned and saved | Configuration requests and resulting behaviour confirmed | Passed |
| HEALTH-01 | Stop the adapter | Management reports disconnection and exposes an alert | Disconnected state and alert confirmed | Passed |
| HEALTH-02 | Start the adapter again | Management reports connection and clears the disconnection alert | Recovery confirmed | Passed |
| ALERT-01 | Generate enough failed authentication attempts | Failed-login-spike alert becomes visible | Alert confirmed | Passed |

The dashboard’s failed-login count represents `LOGIN_FAILED` events. The failed-login-spike alert considers both password and MFA failure events, so those values need not match.

## 7. Adapter Integration Results

| ID | Scenario | Expected result | Recorded result | Status |
|---|---|---|---|---|
| ADAPTER-01 | Authenticate through the legacy browser application | Adapter forwards authentication and the application establishes access | Working legacy flow confirmed | Passed |
| ADAPTER-02 | Send JSON login data with deliberately invalid credentials | Request binds correctly and reaches credential validation | Adapter returned `401` | Passed for the rejection path |
| ADAPTER-03 | Complete successful login and MFA through JSON requests | Correct responses and session handling | Full successful JSON flow not recorded | Pending |

The JSON rejection test confirms that the request reached authentication processing. It does not establish that every successful JSON authentication path has been tested.

## 8. Remaining Verification

| ID | Check | Required evidence | Status |
|---|---|---|---|
| DEPLOY-01 | Start from a fresh, empty database volume | Schema initializes, services start and supplied demo accounts authenticate | Pending |
| DEPLOY-02 | Restart the stack without removing its volume | Saved configuration and recorded events remain available | Pending |
| MOBILE-01 | Test the actual mobile application against Auth Core | Administrator login, dashboard, events, configuration and alerts work together | Pending — mobile integration |
| LIMIT-01 | Retry after failures age out of the configured window | Requests are accepted again once the count falls below the limit | Pending |
| EVENTS-05 | Test explicit event date ranges and invalid filters | Correct date filtering and expected validation errors | Pending |
| POLICY-01 | Try seeding a new account with a noncompliant password | Creation is rejected by password policy validation | Pending |
| POLICY-02 | Try seeding a new account with a compliant password | Account is created with the expected role | Pending |

These are verification gaps, not a request to add new product features.

## 9. Automated Test Status

The repository contains automated tests, including password-policy tests and adapter tests.

A complete automated regression run against the final evaluation revision has not been recorded in this report. Therefore, this report does not claim that the current branch’s full automated test suite passed.

When recording a run, include:

- Commit or revision tested.
- Command executed.
- Passed, failed and skipped totals.
- Any relevant failure output.

The manual checks above remain separate from automated test results.

## 10. Security Evaluation

### Brute-force attempts

Sequential failed password attempts were rejected, retained in the event log and eventually rate-limited.

Incorrect MFA attempts were also rejected and limited.

This demonstrates the basic account-based failure controls under the tested sequential conditions.

The password failure count and subsequent event creation are separate operations. Concurrent requests may exceed the intended threshold before all failures have been recorded. Distributed or high-concurrency resistance has not been established.

### Credential stuffing

The tested controls can limit repeated attempts against the same username.

A dedicated credential-stuffing evaluation across many accounts has not been recorded. The results do not demonstrate detection of distributed attempts using many usernames or source addresses.

### Session misuse

Tests confirmed that logged-out and expired session tokens are rejected.

A valid stolen bearer token may remain usable until it expires or is revoked. These tests establish session invalidation behaviour, rather than prevention of token theft.

## 11. Known MVP Limitations

- Pending MFA challenges and pending enrollment state are held in memory and are lost when Auth Core restarts.
- MFA verification synchronization applies within one application instance; multi-instance coordination has not been verified.
- TOTP reuse across separate challenges within the same valid time interval has not been comprehensively evaluated.
- MFA secrets are currently stored without application-level encryption. A database comment describing them as encrypted does not establish encryption.
- The local demonstration uses HTTP and a cookie configured for that environment.
- The MVP has no password-reset or full account-administration interface.
- Event results do not currently provide pagination.
- Adapter health reporting checks its health endpoint and does not replace an end-to-end authentication test.
- Mobile integration remains dependent on testing the actual mobile application.

These limitations should be included in the capstone evaluation and considered when explaining the boundaries of the demonstration.

## 12. Evaluation Status

The developer-confirmed manual checks support demonstrating the backend authentication flow, legacy integration, session invalidation, administrator authorization, event reporting, configuration changes and alerts.

Fresh database initialization, restart persistence and the actual mobile integration still require confirmed results before the complete system can be described as verified.

This report should be updated with those observed results and the final evaluated commit identifier before submission.