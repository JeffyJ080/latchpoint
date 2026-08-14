# Latchpoint — Project Context

Reference doc so nobody has to dig through chat history to remember what was decided and why. Update this as decisions change.

---

## What This Project Is

**Type:** Final year capstone project (Eduvos)
**Team:** Neo Brian Bampoe, Christiaan Coetzee, Boikanyo Setati, Kutlwano Mabalane

A containerised, API-first authentication framework that small businesses can attach to existing (including legacy) systems without rebuilding their codebase. Managed and monitored via a mobile app.

**Original proposal title:** "Implementing Secure Authentication Systems for Small Business Web Applications"

## Scope Evolution

The original submitted proposal described a **web application prototype**, with no mobile app, no Docker, no legacy system integration. After lecturer feedback, the project pivoted to:
- Delivery as a **mobile-managed** framework (not a plain web app)
- Explicit handling of **legacy system integration**
- **Docker** for deployment

**Core focus remains authentication.** Broader security domains (network, endpoint, access control) were considered but explicitly parked as *optional future add-on modules*, not in scope now.

The research questions and objectives were rewritten to reflect this — see "Updated Research Questions" below. If you're referencing the original PDF, know that Q3/Q4/Objective 3 need the updated wording, not the original.

## Updated Research Questions

1. What are the most common authentication vulnerabilities affecting web applications today, and how do they expose data to risk?
2. How do modern authentication techniques compare to traditional methods in terms of security and usability for small businesses?
3. What are the most effective methods to prevent common authentication-related attacks within a secure authentication system?
4. How can a secure authentication system be architected as a portable, mobile-managed framework that small businesses can attach to existing (including legacy) systems without building it themselves?
5. How effectively does exposing a REST API and using containerisation (Docker) address integration and deployment challenges when attaching an authentication framework to legacy small-business systems written in different languages?
6. How effective are the implemented security measures in protecting against real-world attacks, and what recommendations can be made for small businesses with limited technical resources?

**Objective 3:** To design and implement a secure authentication framework — exposed via a REST API for cross-language compatibility and deployed via Docker — with a mobile management interface for monitoring and configuration.

## Key Technical Decision: Two Separate Problems

This distinction matters and should be explicit in the report — it's easy to conflate:

- **Cross-language legacy integration** → solved by exposing a **REST API**. Any language can make an HTTP call; no per-language SDK needed.
- **Consistent, dependency-free deployment** → solved by **Docker**. Containerises the service so it runs identically anywhere, without installing Java/Node/etc. directly on a business's server.

Docker does **not** solve the cross-language problem by itself — that was an early misconception worth avoiding in the writeup.

## Architecture

```
Legacy System (any language) → Adapter Layer → Auth Core → Management API → Mobile App
```

- **Auth Core** — the authentication service. Login, MFA, session management, password policy. Exposes REST API.
- **Adapter Layer** — translates legacy system calls (for systems that can't natively make REST calls) into requests Auth Core understands.
- **Mobile App** — talks only to the Management API. Monitor + configure only (not full admin control) — dashboard, event log, config, alerts.

## Deployment Model

**Self-hosted per business**, not multi-tenant cloud SaaS. Each business runs their own Docker container(s) on their own server, alongside their existing system.

Positioned/marketed as "SaaS-style" (buy it, attach it, don't build it) but technically self-hosted — avoids multi-tenancy complexity, data-isolation/compliance headaches, and matches the "attach without rebuilding" pitch. Chosen specifically because this is a 3rd-year final SE project, not a startup — right scope for the timeline.

## Tech Stack

| Component | Tech | Status |
|---|---|---|
| Auth Core / API | Java, Spring Boot, Spring Security | Confirmed |
| Database | MySQL | Confirmed |
| MFA | TOTP library | Confirmed — use existing library, don't hand-roll |
| Adapter Layer | Java (Spring Boot) | Confirmed |
| Mobile App | React Native | Confirmed — team vote |
| Deployment | Docker, Docker Compose | Confirmed |

## Repo Setup (done)

- Repo name: **latchpoint**
- License: MIT
- Structure: `auth-core/`, `adapter-layer/`, `mobile-app/`, `docker-compose.yml`, `docs/`, `LICENSE`, `README.md`
- `.gitignore`, `.env.example`, `CONTRIBUTING.md` in place
- `docs/api-contract.md` — draft REST API spec (Auth endpoints + Management endpoints). **Has 3 open questions team needs to resolve:** admin auth for management endpoints, pagination for event log, rate limiting on `/login`.
- Example Dockerfiles for `auth-core` and `adapter-layer` created (kept as `.example` suffix intentionally until real code exists — rename to `Dockerfile` when building starts)
- PR template drafted (needs to be moved to `.github/pull_request_template.md` to auto-apply)
- Branch protection on `main` set up
- Project board — not yet set up (Projects tab → Board template → add Review column → seed with Week 1 tasks)

## Role Split (team of 4)

| Person | Owns |
|---|---|
| A | `auth-core` lead — API contract, login, sessions, password policy |
| B | `auth-core` support + MFA implementation |
| C | `adapter-layer` + Docker/docker-compose setup |
| D | `mobile-app` (React Native) |

No dedicated docs/integration person — distributed across all 4 (see roadmap for who does what when).

## Roadmap (4-week timeline)

- **Week 1 — Foundation:** DB schema, Auth Core skeleton, REST API contract finalized, Adapter Layer stub, Mobile App scaffold + static screens
- **Week 2 — Core build:** Login/session/MFA/password policy implemented, Adapter Layer translation logic against mock legacy system, Mobile App wired to (mocked) API, docker-compose started
- **Week 3 — Integration + evaluation setup:** Full stack running end-to-end via docker-compose, Mobile App fully wired, security evaluation begins (RQ5/RQ6 — brute force, credential stuffing, session hijacking), architecture/methodology docs drafted
- **Week 4 — Polish + evaluation + report:** Finish security testing, document findings, bug fixes, clean Docker deployment test, finalize report (findings, limitations, future work), rehearse demo

**Auth Core is the critical dependency** — if it slips, both Adapter Layer and Mobile App stall. Daily-ish check-ins recommended in Weeks 1–2, not just end-of-week.

## Design

Mobile app mockups being built in **Claude Design** (as proof of concept won't make final design). Screens: Dashboard, Event Log, Configuration, Alerts — bottom tab navigation, with interactive/clickable flow between screens (e.g. dashboard card → filtered event log).

## Future Work (for report's recommendations section)

- Native Android/iOS builds beyond the current React Native app, for native-level performance tuning
- Optional security modules beyond authentication (network, endpoint, access control) as expansion path