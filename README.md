# 🏗️ Multi-Tenant SaaS Platform with External Integrations

This project is a backend system designed to simulate a real-world multi-tenant SaaS platform. It includes tenant-aware authentication, isolated organization data, webhook handling from simulated external services, and robust error handling with retry logic.

> **Stack**: Node.js · Express.js · PostgreSQL · Sequelize ORM · JWT · Redis (optional) · Jest

---

## 🧩 Features

### 🔒 Multi-Tenant SaaS Platform
- Tenant data isolation with row-level scoping
- JWT-based authentication with role-based access
- Organization and user CRUD APIs
- Audit logging for all data-changing operations
- API rate limiting and request input validation

### 🔗 External Integration Engine
- Webhook processor for simulated external services
- Async job queue with retry and failure recovery
- External API call simulation with circuit breaker fallback
- Data synchronization between external & internal systems
- Health monitoring for integration status

### 🎁 Bonus Features
- Idempotent webhook handling
- Circuit breaker pattern (`opossum`)
- Bulk event handling for high-throughput webhooks
- (Optional) SSO stub using simulated OIDC flow

---

## 🗂️ Project Structure

src/
├── config/ # App and DB config
├── controllers/ # Request handlers
├── integrations/ # External service simulation
├── jobs/ # Async job queue and workers
├── middleware/ # Auth, validation, rate limiter
├── models/ # Sequelize models
├── routes/ # API routes
├── services/ # Business logic
├── utils/ # Helpers (logger, error handler, etc.)
└── logs/ # Audit logs

tests/ # Jest tests
docs/ # Schema, architecture docs


---

## 🛠️ Setup Instructions

```bash
# Clone repo
git clone <repo-url>
cd multi-tenant-saas

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Fill DB credentials and JWT secret

# Run database migrations and seed
npx sequelize db:migrate
npx sequelize db:seed:all

# Start server
npm run dev
```

## 🧪 Running Tests

```bash
npm test
```

Includes:

Unit tests for services

Integration tests for API endpoints

Mocked webhook events and retry scenarios

📒 API Documentation
Auth
POST /auth/register

POST /auth/login

Organizations
GET /organizations

POST /organizations

PUT /organizations/:id

DELETE /organizations/:id

Users
GET /users

POST /users

PUT /users/:id

DELETE /users/:id

Webhooks
POST /webhooks/user-service

POST /webhooks/payment-service

POST /webhooks/communication-service

Monitoring
GET /integrations/status

See docs/api.md for full request/response schemas.

🧠 Design Decisions
✅ Multi-Tenancy
Implemented via row-level scoping (organizationId) in every query

Authenticated JWT includes org_id and role for contextual access

Optional: add DB-level constraints or schema separation for stricter isolation

✅ Async Processing
Webhooks trigger background jobs using a simple queue abstraction

Retries use exponential backoff and max attempt limits

All job failures logged and visible in health monitor

✅ Data Consistency
Webhook events and API responses update shared models (e.g., user sync)

Sync operations are idempotent (based on external event_id)

✅ Security
JWT signing + verification

Rate limiter middleware (per org/user)

Schema validation using Joi

Audit logging for all data mutations

🛡️ Error Handling Strategy
External API Failures: Circuit breaker + retries

Webhook Duplication: Idempotency keys

Validation: All input validated at route level

Unhandled Rejections: Logged globally

🚥 Health Monitoring

GET /integrations/status

Returns:

{
  "userService": { "lastSync": "2025-06-26T16:00Z", "status": "OK" },
  "paymentService": { "lastSync": "2025-06-26T15:48Z", "status": "RETRYING" },
  ...
}


🧩 Simulated External Services
Each service exposes mock APIs and sends webhook events:

User Management Service – CRUD, webhook on user changes

Payment Service – Subscriptions, invoices, status webhooks

Communication Service – Email/notification delivery updates

Simulated using Express servers in /integrations/.

✨ Future Enhancements
Full SSO using Passport.js with OIDC

Kafka or RabbitMQ for scalable job queues

Tenant provisioning UI

Admin dashboard for audit logs and integration statuses

🧠 Author Notes
This project was built as part of a senior backend engineering assessment, with emphasis on:

Platform design

Integration reliability

Error resilience

Clean, maintainable code

Feedback and suggestions welcome.
