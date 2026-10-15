# Latchpoint — Mobile Management App

The official mobile management interface for **Latchpoint**. Built with **React Native** and **Expo**, this application allows business owners and administrators to remotely monitor authentication security events, review real-time
security alerts, and configure framework policies without touching server code.

---

## 1. Overview & Architectural Role

The mobile app operates strictly through Auth Core's **Management API** on port `8080`. It never touches legacy application traffic or the Adapter Layer directly; it provides a clean, mobile-first management dashboard for
administrators.

    ┌────────────────────────┐                      ┌───────────────────────┐                                      ┌───────────────┐                      ┌────────────────────┐                                                             
    │                        │                      │                       │                                      │               │                      │                    │                                                             
    │                        │                      │       Mobile App      │                                      │   Auth Core   │                      │                    │                                                             
    │ Business Owner / Admin ├─Config─&─Monitoring─►│                       ├─Management─REST─API<br/>(Port─8080)─►│               ├─Audit─Logs─&─Config─►│ ("MySQL Database") │                                                             
    │                        │                      │ (React Native / Expo) │                                      │ (Spring Boot) │                      │                    │                                                             
    │                        │                      │                       │                                      │               │                      │                    │                                                             
    └────────────────────────┘                      └───────────────────────┘                                      └───────────────┘                      └────────────────────┘                                                             


### Key Responsibilities
* **Security Monitoring:** Visualizes live authentication health, failed login spikes, and possible brute-force attacks.
* **Audit Event Log:** Ingests and displays system-wide authentication events (`LOGIN_SUCCESS`, `LOGIN_FAILED`, `MFA_SUCCESS`, etc.).
* **Policy Configuration:** Manages password requirements (length, symbols, rotation), MFA enforcement, and session timeouts remotely.
* **Alert Feed:** Displays urgent system notifications (e.g., adapter disconnections, suspicious login volumes).

---

## 2. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) (v0.86+) | Cross-platform native mobile runtime |
| **Tooling & Platform** | [Expo](https://expo.dev/) (SDK 57) | Managed developer workflow & build system |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) (v57) | File-based routing (`src/app/`) |
| **UI & Styling** | React Native StyleSheet + Custom Theme | Dark slate/cyberpunk palette (`#100e24`) |
| **Language** | TypeScript | Static typing across components & API models |

---

## 3. Project Structure

```
mobile-app/
├── assets/                  # App icons, splash screens, and images
├── src/
│   ├── app/                 # Expo Router file-based screens
│   │   ├── _layout.tsx      # Root stack navigation layout
│   │   ├── index.tsx        # Splash / welcome landing screen
│   │   ├── login.tsx        # Admin login screen
│   │   ├── signup.tsx       # Account registration screen
│   │   └── dashboard.tsx    # Security monitoring & stats dashboard
│   ├── components/          # Reusable UI elements (cards, headers, buttons)
│   ├── constants/           # Color palette, spacing, and typography theme
│   └── hooks/               # Custom React hooks (theme, color-scheme)
├── app.json                 # Expo project configuration
├── package.json             # Dependencies and npm scripts
└── tsconfig.json            # TypeScript compiler configuration
```

---

## 4. Getting Started

### Prerequisites
* **Node.js**: v18.x or higher
* **npm**: v9.x or higher
* **Expo Go App** (optional): Installed on your physical iOS/Android device for wireless testing.

### Installation
From the root of the repository, navigate into the `mobile-app` directory and install dependencies:

```bash
cd mobile-app
npm install
```

### Running Locally

To start the Expo development server:

```bash
npx expo start
```

From the interactive terminal prompt, you can choose where to preview the app:
* Press **`a`** to open on a connected **Android Emulator**.
* Press **`i`** to open on an **iOS Simulator** (macOS only).
* Press **`w`** to open in a **Web Browser**.
* **Scan the QR Code** with your camera (iOS) or the Expo Go app (Android) to test on a physical phone.

> TIP
> **Connecting to Auth Core from a Mobile Device:**
> - When running on a **Web browser** or **desktop emulator**, Auth Core is available at `http://localhost:8080`.
> - When running on a **physical mobile phone**, `localhost` points to the phone itself! Update your API base URL to use your development machine's local LAN IP address (e.g. `http://192.168.1.50:8080`).

---

## 5. Backend Management API Endpoints

The mobile application communicates with the endpoints defined in [**`docs/Api contract.md`**](../docs/Api%20contract.md):

| Screen | Target Endpoint | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **Login** | `/login` | `POST` | Authenticates administrator credentials and receives a session token |
| **Dashboard** | `/management/dashboard` | `GET` | Fetches system status, login counts, and MFA state |
| **Event Log** | `/management/events` | `GET` | Paginated feed of authentication events with status/time filters |
| **Settings** | `/management/config` | `GET`, `PUT` | Reads and updates password policies and session limits |
| **Alerts** | `/management/alerts` | `GET` | Fetches active security warnings and incident notices |

---

## 6. Related References

* **API Specification:** [`docs/Api contract.md`](../docs/Api%20contract.md)
* **Project Context & Scope:** [`docs/Project context.md`](../docs/Project%20context.md)
* **Local Stack Setup:** [`docs/DEVELOPER_SETUP.md`](../docs/DEVELOPER_SETUP.md)
