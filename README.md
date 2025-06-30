# 🏗️ Multi-Tenant SaaS Platform with External Integrations

This project is a backend system designed to simulate a real-world multi-tenant SaaS platform. It includes tenant-aware authentication, isolated organization data, webhook handling from simulated external services, robust error handling with retry logic, and SSO simulation.

> **Stack**: Node.js · Express.js · PostgreSQL · Sequelize ORM · JWT

---

## 🧩 Features

### 🔒 Multi-Tenant SaaS Platform
- Tenant data isolation with row-level security (RLS)
- JWT-based authentication with role-based access
- Organization and user CRUD APIs
- Audit logging for all data-changing operations
- API rate limiting and request input validation

### 🔗 External Integration Engine
- Webhook processor for simulated external services (User, Payment, Communication)
- Async job queue with retry and failure recovery
- External API call simulation with circuit breaker fallback
- Data synchronization between external & internal systems
- Health monitoring for integration status

### 🪪 SSO Simulation
- Simulated OIDC/SSO endpoints for Azure AD and Okta

### 🎁 Bonus Features
- Idempotent webhook handling
- Circuit breaker pattern (`opossum`)
- Bulk event handling for high-throughput webhooks
- Dead-letter queue for failed events

---

## 🗂️ Project Structure

src/ 
├── controllers/ # Request handlers  
├── integrations/ # External service simulation  
├── jobs/ # Async job queue and workers  
├── middleware/ # Auth, validation, rate limiter  
├── models/ # Sequelize models  
├── routes/ # API routes  
├── handler/ Handle webhook events
├── data/ # Dataset required for the assessment  
├── utils/ # Helpers (logger, error handler, etc.)  
└── validator/ # Input validation

migrations/ # Sequelize migrations
config/ # App and DB config  
docs/ # Schema, architecture, api docs

---

## 🛠️ Setup Instructions

```bash
# Clone repo
git clone <https://github.com/Temitopesam1/SaaS-Platform.git>
cd SaaS-Platform.git

# Install dependencies
npm install

# Setup environment
cp .env.example .env
cp config/config.example.json config.json
# Fill DB credentials in config and JWT secret in .env files respectively

# Run database migrations and seed
npx sequelize db:migrate
npx sequelize db:seed:all

# Start server
npm run dev
```

## 🧪 Running Tests


To start worker, run the below in another terminal

```bash
node worker.js
```

---

## 📒 API Overview

See [`docs/api.md`](docs/api.md) for full request/response schemas.

### Auth
- `POST /auth/login` — User login (returns JWT)
- `POST /sso/azure` — Simulated Azure AD SSO login (returns JWT)
- `POST /sso/okta` — Simulated Okta SSO login (returns JWT)

### Organizations
- `GET /organizations` — Get current org details
- `POST /organizations` — Create new org (super_admin only)

### Users
- `GET /users` — List users (admin only)
- `POST /users` — Create user (admin only)

### Webhooks
- `POST /webhooks/:provider` — Receive one or more webhook events

### Monitoring & Logs
- `GET /integrations/status` — Integration health/status for current org
- `GET /audit-logs` — Audit logs for current org

---

## 🧠 Design Decisions

- **Multi-Tenancy:** Row-level security (RLS) and org-scoped queries
- **Async Processing:** Webhooks trigger background jobs with retry and dead-letter queue
- **Data Consistency:** Idempotent event processing, audit logs
- **Security:** JWT, per-org rate limiting, input validation
- **Error Handling:** Circuit breaker for external APIs, retries, dead-letter queue

---

## 🧩 Simulated External Services

Each service exposes mock APIs and sends webhook events:
- User Management Service – CRUD, webhook on user changes
- Payment Service – Subscriptions, invoices, status webhooks
- Communication Service – Email/notification delivery updates

Simulated using Express servers in `/integrations/`.

---

## ✨ Future Enhancements

- Full SSO using Passport.js with OIDC
- Kafka or RabbitMQ for scalable job queues
- Tenant provisioning UI
- Admin dashboard for audit logs and integration statuses

---

## 🧠 Author Notes

This project was built as part of a senior backend engineering assessment, with emphasis on:
- Platform design
- Integration reliability
- Error resilience
- Clean, maintainable code

Feedback and suggestions welcome.
