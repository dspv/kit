# API Specification

> **🎯 Purpose**: Complete API endpoints and contracts documentation

## 🌐 API Overview

### Base Information
- **Base URL**: `https://api.[domain].com/api/v1`
- **Protocol**: HTTPS only
- **Format**: JSON
- **Authentication**: JWT Bearer tokens
- **Rate Limiting**: 1000 requests/hour per user

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {...}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🔐 Authentication

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJ..."
}
```

### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

## 👥 Users API

### Get Current User
```http
GET /api/v1/users/me
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Update User
```http
PUT /api/v1/users/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "New Name",
  "email": "new@example.com"
}
```

### Change Password
```http
POST /api/v1/users/me/password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "current_password": "old_password",
  "new_password": "new_password"
}
```

## 📋 [Main Resource] API

### List [Resources]
```http
GET /api/v1/[resources]?page=1&limit=20&sort=created_at&order=desc
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 20, max: 100)
- `sort` (string): Sort field (default: created_at)
- `order` (string): Sort order - asc/desc (default: desc)
- `search` (string): Search query
- `filter[field]` (string): Filter by field

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Resource Title",
        "description": "Resource Description",
        "status": "active",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### Get [Resource]
```http
GET /api/v1/[resources]/:id
Authorization: Bearer <access_token>
```

### Create [Resource]
```http
POST /api/v1/[resources]
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Resource Title",
  "description": "Resource Description",
  "status": "active"
}
```

### Update [Resource]
```http
PUT /api/v1/[resources]/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description"
}
```

### Delete [Resource]
```http
DELETE /api/v1/[resources]/:id
Authorization: Bearer <access_token>
```

## 📊 Status Codes

### Success Codes
- `200 OK` - Successful GET, PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE

### Client Error Codes
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded

### Server Error Codes
- `500 Internal Server Error` - Server error
- `502 Bad Gateway` - Upstream error
- `503 Service Unavailable` - Service down

## 🔍 Error Codes

### Authentication Errors
- `AUTH_INVALID_CREDENTIALS` - Wrong email/password
- `AUTH_TOKEN_EXPIRED` - Access token expired
- `AUTH_TOKEN_INVALID` - Invalid token format
- `AUTH_REFRESH_INVALID` - Invalid refresh token

### Validation Errors
- `VALIDATION_REQUIRED` - Required field missing
- `VALIDATION_FORMAT` - Invalid field format
- `VALIDATION_LENGTH` - Field length invalid
- `VALIDATION_UNIQUE` - Field must be unique

### Resource Errors
- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `RESOURCE_FORBIDDEN` - No access to resource
- `RESOURCE_CONFLICT` - Resource state conflict

## 📈 Rate Limiting

### Limits
- **Authenticated**: 1000 requests/hour
- **Anonymous**: 100 requests/hour
- **Login attempts**: 5 attempts/15 minutes

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 🔄 Webhooks (Optional)

### Webhook Events
- `user.created` - New user registered
- `[resource].created` - New resource created
- `[resource].updated` - Resource updated
- `[resource].deleted` - Resource deleted

### Webhook Format
```json
{
  "event": "user.created",
  "data": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🧪 Testing

### Health Check
```http
GET /health
```

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

### API Documentation
- **Swagger UI**: `/api/docs`
- **OpenAPI Spec**: `/api/openapi.json`

## 📝 SDK Examples

### JavaScript/TypeScript
```typescript
import { ApiClient } from '@[project]/sdk';

const client = new ApiClient({
  baseUrl: 'https://api.[domain].com',
  apiKey: 'your-api-key'
});

// Login
const auth = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Get resources
const resources = await client.resources.list({
  page: 1,
  limit: 20
});
```

### Go
```go
package main

import (
    "[project]/sdk-go"
)

func main() {
    client := sdk.NewClient("[api-key]")
    
    // Login
    auth, err := client.Auth.Login("user@example.com", "password")
    if err != nil {
        log.Fatal(err)
    }
    
    // Get resources
    resources, err := client.Resources.List(sdk.ListOptions{
        Page:  1,
        Limit: 20,
    })
}
```

## 🔗 Related Documentation

- **Architecture**: spec/arch.md#API
- **Authentication Flow**: spec/arch.md#Authentication
- **Database Schema**: spec/arch.md#Database

---

**Last Updated**: [date] | **Refs**: spec/arch.md#API; spec/policy.md#Security
