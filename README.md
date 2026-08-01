# Latchpoint

A containerised, API-first authentication framework that small businesses can attach to existing (including legacy) systems without rebuilding their codebase. Managed and monitored via a mobile app.

Built for our third year capstone project (Eduvos).

## The Problem

Small businesses often run web applications with weak or poorly implemented authentication, but lack the budget or expertise to build secure auth systems in-house. Existing solutions are either too complex, too costly, or not designed for small-scale, resource-constrained environments.

## The Solution

Latchpoint is a standalone authentication service that businesses attach to their existing system rather than build themselves. Legacy systems integrate via a REST API, so the framework works regardless of what language the business's existing application is written in. The whole thing ships as Docker containers for consistent, dependency-free deployment on the business's own server, and is monitored/configured remotely via a mobile app.

**Two problems, two solutions — not one:**
- **Cross-language integration** → solved by exposing a REST API (any language can make an HTTP call)
- **Consistent, dependency-free deployment** → solved by Docker

## Architecture

```
┌─────────────────┐         ┌──────────────────┐              ┌──────────────┐
│  Legacy System  │ ─────▶ │  Adapter Layer    │ ────────▶   │  Auth Core   │
│ (any language)  │  REST   │  (translates     │     REST     │ (auth logic, │
│                 │         │   legacy calls)  │              │  MFA,        │
└─────────────────┘         └──────────────────┘              │  sessions)   │
                                                              └──────┬───────┘
                                                                     │
                                                              Management API
                                                                     │
                                                              ┌──────▼───────┐
                                                              │  Mobile App  │
                                                              │ (Android)    │
                                                              └──────────────┘
```

- **`auth-core`** — the authentication service. Handles credential verification, MFA, session management, and password policy enforcement. Exposes a REST API.
- **`adapter-layer`** — sits in front of Auth Core for legacy systems that can't make REST calls natively; translates their requests into calls Auth Core understands.
- **`mobile-app`** — talks only to the Management API (part of Auth Core's REST API). Lets a business owner monitor auth events and configure settings (MFA, password policy, session timeout) remotely.
- **`docker-compose.yml`** — spins up `auth-core` and `adapter-layer` together for local development or deployment on a business's own server.

## Tech Stack

| Component | Tech |
|---|---|
| Auth Core / API | Java, Spring Boot, Spring Security |
| Database | MySQL |
| MFA | TOTP library (e.g. `java-totp` / Google Authenticator-compatible) |
| Adapter Layer | Java (Spring Boot) |
| Mobile App | React Native *(pending final team confirmation)* |
| Deployment | Docker, Docker Compose |

## Deployment Model

Self-hosted: each business runs their own container(s) on their own server, alongside their existing system. Latchpoint is *positioned* as a SaaS-style product (buy it, attach it, done) but is not a multi-tenant cloud service — no shared infrastructure or cross-business data.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/<org>/latchpoint.git
cd latchpoint

# Spin up auth-core and adapter-layer
docker-compose up --build
```

Mobile app setup instructions to be added once the `mobile-app` folder has a working build.

## Project Structure

```
latchpoint/
├── auth-core/          # Java/Spring Boot authentication service (REST API)
├── adapter-layer/       # Translates legacy system calls into REST requests
├── mobile-app/          # React Native app for monitoring & configuration
├── docker-compose.yml   # Local/self-hosted deployment
├── docs/                # Architecture notes, research documentation
├── LICENSE
└── README.md
```

## Research Context

This project supports research into secure authentication for small business web applications, including:
- Common authentication vulnerabilities and how they expose data to risk
- Comparison of modern vs. traditional authentication techniques
- Effective prevention methods for authentication-related attacks
- Practical, cost-effective implementation of a secure authentication framework for small businesses, including integration with legacy systems
- Evaluation of implemented security measures against real-world attacks

## Team

- Neo Brian Bampoe
- Christiaan Coetzee
- Boikanyo Setati
- Kutlwano Mabalane

## License

MIT — see [LICENSE](./LICENSE).
