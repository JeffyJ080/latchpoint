# Latchpoint — Local Developer Setup & Team Guide

Welcome to the team! This guide walks you through setting up and running the entire **Latchpoint** stack on your local machine so you can develop and test without running into common environment issues ("weird shit").

---

## 📋 Prerequisites Checklist

Before you start, make sure you have the following installed on your machine:

1. **Docker Desktop** (Mac / Windows) or **Docker Engine + Docker Compose** (Linux).
   - Verify: `docker --version` and `docker compose version`
   - *Ensure Docker Desktop is open and running in the background.*
2. **Git**:
   - Verify: `git --version`
3. *(Optional for local IDE development without Docker)*:
   - **Java 17 JDK** (Eclipse Temurin recommended) & **Maven 3.9+**
   - **Node.js 18+** & **npm** (for the `mobile-app` team member)

---

## 🚀 Step 1: Initial Setup (One-Time)

### 1. Clone the repository and navigate into the folder:
```bash
git clone https://github.com/JeffyJ080/latchpoint.git
cd latchpoint
```

### 2. Create your personal `.env` file:
Docker Compose uses a `.env` file to configure database credentials, ports, and secret keys. We provide a template with working defaults:

```bash
cp .env.example .env
```

> [!IMPORTANT]
> **Never commit your `.env` file to Git.** It is already listed in `.gitignore`. The `.env.example` file is the only template that gets committed.

---

## 🐳 Step 2: Starting the Backend Services

To build the images and start the database (`mysql`), authentication service (`auth-core`), and adapter service (`adapter-layer`):

```bash
docker compose up --build
```

*(Add `-d` at the end if you want it to run in the background / detached mode: `docker compose up --build -d`)*

### How it starts up:
1. **MySQL** boots first and automatically runs `db/init.sql` to create all tables and initial seed data.
2. A built-in **healthcheck** tests MySQL until it is fully ready to accept connections.
3. **`auth-core`** and **`adapter-layer`** start up and automatically connect to MySQL and each other over the internal Docker network.

---

## ✅ Step 3: Verifying Everything Is Working

Open a new terminal and check the status of your containers:

```bash
docker compose ps
```

You should see 3 healthy/running containers:
- `latchpoint-mysql` (Port `3306`)
- `latchpoint-auth-core` (Port `8080`)
- `latchpoint-adapter-layer` (Port `8081`)

### Test health endpoints in your browser or terminal:
- **Auth Core Health:** [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
- **Adapter Layer Health:** [http://localhost:8081/actuator/health](http://localhost:8081/actuator/health)

### Connecting to the Database via GUI (DBeaver / MySQL Workbench / VS Code):
If you want to view the database tables and data directly:
- **Host:** `localhost`
- **Port:** `3306`
- **Database:** `latchpoint_db`
- **Username:** `latchpoint_user`
- **Password:** check your local `.env` file (`DB_PASSWORD`)

---

## 🛠️ How to Work Daily by Role

### 🅰️ Auth Core Team (`auth-core`)
- Work on Java code inside [`auth-core/src`](file:///workspace/latchpoint/auth-core/src).
- Whenever you make changes to backend code, rebuild the container:
  ```bash
  docker compose up --build auth-core
  ```
- *Alternative for fast local debugging:* You can run MySQL via Docker (`docker compose up mysql`) and run Spring Boot directly inside IntelliJ IDEA / Eclipse connecting to `localhost:3306`.

### 🅱️ Adapter Layer Team (`adapter-layer`)
- Work on legacy translation code in [`adapter-layer/src`](file:///workspace/latchpoint/adapter-layer/src).
- Rebuild the adapter container:
  ```bash
  docker compose up --build adapter-layer
  ```
- Run unit and WireMock tests locally:
  ```bash
  cd adapter-layer && mvn test
  ```

### 🅲 Mobile App Team (`mobile-app`)
- The mobile app talks directly to `auth-core` on port `8080`.
- Start the mobile app locally:
  ```bash
  cd mobile-app
  npm install
  npm start
  ```
- *Note for physical mobile devices / emulators:* Point the API base URL to your computer's local Wi-Fi IP address (e.g. `http://192.168.1.50:8080`) rather than `localhost`, because `localhost` on a phone refers to the phone itself.

---

## 🛑 Useful Docker Commands

| What you want to do | Command |
| :--- | :--- |
| **Stop all services** | `docker compose down` |
| **View logs for all services** | `docker compose logs -f` |
| **View logs for one service** | `docker compose logs -f auth-core` |
| **Rebuild after code changes** | `docker compose up --build` |
| **Completely wipe DB & reset from scratch** | `docker compose down -v` then `docker compose up --build` |

---

## ⚠️ Troubleshooting & Avoiding "Weird Shit"

### 1. "Port 3306 is already in use"
- **Cause:** You probably have MySQL or MariaDB running natively on your computer outside of Docker.
- **Fix:** Stop your local MySQL service (e.g., in Services on Windows or via `brew services stop mysql` on Mac), **OR** change `DB_PORT=3307` in your local `.env` file.

### 2. "I changed `db/init.sql`, but the database didn't update"
- **Cause:** MySQL only runs `init.sql` the very **first** time a volume is created. If data already exists in `mysql-data`, it skips initialization.
- **Fix:** Wipe the volume cleanly:
  ```bash
  docker compose down -v
  docker compose up --build
  ```

### 3. "My code changes aren't showing up in Docker"
- **Cause:** Docker is using a cached build layer.
- **Fix:** Always include the `--build` flag:
  ```bash
  docker compose up --build
  ```

### 4. Git Branch Rules (Reminder)
- Never push directly to `main`.
- Always branch off `main`: `git checkout -b feature/<your-feature-name>`
- Create a Pull Request (PR) for review before merging.
