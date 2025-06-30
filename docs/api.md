# 📘 API Documentation

Base URL: `http://localhost:3000`

---

## 🛡️ Auth

### POST /auth/login

Authenticate a user and receive a JWT.

**Body**
```json
{
  "email": "user@org.com"
}
```

**Response**
```json
{
  "token": "<JWT>"
}
```

---

## 🏢 Organizations

### GET /organizations

Get details of the current user's organization.

**Headers**
Authorization: Bearer <JWT>

**Response**
```json
{
  "organization": {
    "id": "uuid",
    "name": "TechCorp Inc",
    "subscription_tier": "enterprise",
    "employee_limit": 1200,
    "features_enabled": [],
    "webhook_endpoints": {},
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### POST /organizations

Create a new organization (super_admin only).

**Headers**
Authorization: Bearer <JWT>

**Body**
```json
{
  "name": "Acme Corp",
  "subscription_tier": "premium",
  "employee_limit": 100,
  "admin_user": {
    "email": "admin@acme.com",
    "first_name": "Alice",
    "last_name": "Admin"
  }
}
```

**Response**
```json
{
  "organization": { ... },
  "admin_user": { ... }
}
```

---

## 👤 Users

### GET /users

List users in the current organization (admin only).

**Headers**
Authorization: Bearer <JWT>

**Response**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@org.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "organization_id": "uuid",
      "status": "active",
      "created_at": "2024-01-15T11:00:00Z",
      "last_login": "2024-02-15T09:30:00Z"
    }
  ]
}
```

### POST /users

Create a new user in the current organization (admin only).

**Headers**
Authorization: Bearer <JWT>

**Body**
```json
{
  "email": "newuser@org.com",
  "first_name": "New",
  "last_name": "User",
  "role": "user"
}
```

**Response**
```json
{
  "user": { ... }
}
```

---

## 🔗 Webhooks

### POST /webhooks/:provider

Receive one or more webhook events from an external service.

**Headers**
Authorization: Bearer <JWT>

**Body** (single event or array)
```json
[
  {
    "event_type": "user.created",
    "event_id": "evt_user_001",
    "organization_id": "uuid",
    "data": { ... }
  }
]
```

**Response**
```json
{
  "results": [
    { "event_id": "evt_user_001", "status": "queued" }
  ]
}
```

---

## 📊 Integration Health

### GET /integrations/status

Returns the integration status for all providers for the current organization.

**Headers**
Authorization: Bearer <JWT>

**Response**
```json
[
  {
    "id": "uuid",
    "organization_id": "uuid",
    "provider": "user-service",
    "last_sync_at": "2025-06-27T10:00:00Z",
    "last_sync_status": "success",
    "failure_count": 0,
    "last_error": null
  }
]
```

---

## 📜 Audit Logs

### GET /audit-logs

Returns audit logs for the current organization.

**Headers**
Authorization: Bearer <JWT>

**Response**
```json
{
  "logs": [
    {
      "id": "uuid",
      "organization_id": "uuid",
      "actor_id": "uuid",
      "action": "CREATE_USER",
      "resource_type": "user",
      "resource_id": "uuid",
      "before_state": null,
      "after_state": { "email": "user@org.com" },
      "timestamp": "2025-06-27T10:10:00Z"
    }
  ]
}
```

---

## 🪪 SSO (Simulated)

### POST /sso/azure

Simulate Azure AD SSO login. Returns a JWT for a user mapped from the mock Azure SSO response.

**Body**
```json
{}
```

**Response**
```json
{
  "token": "<JWT>"
}
```

---

### POST /sso/okta

Simulate Okta SSO login. Returns a JWT for a user mapped from the mock Okta SSO response.

**Body**
```json
{}
```

**Response**
```json
{
  "token": "<JWT>"
}
```
