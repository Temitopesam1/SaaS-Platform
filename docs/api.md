# 📘 API Documentation

Base URL: `http://localhost:3000`

---

## 🔐 Authentication

### POST /auth/register

Registers a user under an organization.

**Body**
```json
{
  "organization": "Acme Corp",
  "email": "admin@acme.com",
  "password": "SecurePass123",
  "role": "admin"
}


Response

json
Copy
Edit
{
  "message": "Registration successful",
  "token": "JWT_TOKEN"
}
POST /auth/login
Body

json
Copy
Edit
{
  "email": "admin@acme.com",
  "password": "SecurePass123"
}
Response

json
Copy
Edit
{
  "token": "JWT_TOKEN"
}
🏢 Organizations
GET /organizations
Returns all organizations (admin-only)

Headers
Authorization: Bearer <JWT>

POST /organizations
Creates a new organization.

json
Copy
Edit
{
  "name": "Beta Inc"
}
👤 Users
GET /users
Returns all users in the org (admin-only)

POST /users
Creates a user under current org.

json
Copy
Edit
{
  "email": "user@org.com",
  "password": "UserPass",
  "role": "member"
}
📥 Webhooks
POST /webhooks/user-service
json
Copy
Edit
{
  "event_id": "abc123",
  "type": "user.updated",
  "payload": {
    "external_id": "user_001",
    "email": "new@user.com"
  }
}
POST /webhooks/payment-service
json
Copy
Edit
{
  "event_id": "inv_123",
  "type": "invoice.paid",
  "payload": {
    "user_id": "user_001",
    "amount": 10000,
    "currency": "USD"
  }
}
POST /webhooks/communication-service
json
Copy
Edit
{
  "event_id": "msg_456",
  "type": "email.delivered",
  "payload": {
    "recipient": "user@org.com",
    "status": "delivered"
  }
}
All webhooks require x-signature header for signature verification.

📊 Integration Health
GET /integrations/status
Response

json
Copy
Edit
{
  "userService": {
    "status": "OK",
    "lastSync": "2025-06-27T10:00:00Z"
  },
  "paymentService": {
    "status": "RETRYING",
    "lastError": "TimeoutError"
  }
}
📜 Audit Logs
GET /logs/audit
(admin only — optional)

json
Copy
Edit
[
  {
    "action": "create_user",
    "performed_by": "admin@org.com",
    "target": "user@org.com",
    "before": null,
    "after": { "email": "user@org.com" },
    "timestamp": "2025-06-27T10:10:00Z"
  }
]
