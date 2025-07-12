# Swap API Documentation

This document describes the Swap API endpoints for the Skill Swap Platform.

## Base URL

```
http://localhost:3000/api/v1/swaps
```

## Authentication

All swap endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Swap Request

**POST** `/request`

Create a new swap request between users.

**Request Body:**

```json
{
  "recipientId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "offeredSkillIds": ["64f8a1b2c3d4e5f6a7b8c9d1", "64f8a1b2c3d4e5f6a7b8c9d3"],
  "wantedSkillIds": ["64f8a1b2c3d4e5f6a7b8c9d2", "64f8a1b2c3d4e5f6a7b8c9d4"],
  "message": "I'd love to learn these skills from you!"
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "requester": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "username": "john_doe",
      "email": "john@example.com",
      "profilePhoto": "https://example.com/photo.jpg"
    },
    "recipient": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "jane_smith",
      "email": "jane@example.com",
      "profilePhoto": "https://example.com/photo2.jpg"
    },
    "offeredSkill": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "JavaScript",
      "category": "Programming"
    },
    "wantedSkill": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "Python",
      "category": "Programming"
    },
    "status": "pending",
    "message": "I'd love to learn this skill from you!",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Swap request created successfully"
}
```

### 2. Accept Swap Request

**PUT** `/:swapId/accept`

Accept a pending swap request.

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "status": "accepted",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Swap request accepted successfully"
}
```

### 3. Reject Swap Request

**PUT** `/:swapId/reject`

Reject a pending swap request.

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "status": "rejected",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Swap request rejected successfully"
}
```

### 4. Cancel Swap Request

**PUT** `/:swapId/cancel`

Cancel a pending swap request (only by the requester).

**Request Body:**

```json
{
  "reason": "Changed my mind about the swap"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "status": "cancelled",
    "cancelledAt": "2024-01-15T11:30:00.000Z",
    "cancelledBy": "64f8a1b2c3d4e5f6a7b8c9d4",
    "cancellationReason": "Changed my mind about the swap",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  },
  "message": "Swap request cancelled successfully"
}
```

### 5. Complete Swap

**PUT** `/:swapId/complete`

Mark an accepted swap as completed.

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "status": "completed",
    "completedAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Swap completed successfully"
}
```

### 6. Get Current User's Swaps

**GET** `/current`

Get swap requests sent by the current user.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (pending, accepted, rejected, completed, cancelled)

**Example:** `GET /current?page=1&limit=5&status=pending`

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "swaps": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "recipient": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "username": "jane_smith",
          "email": "jane@example.com",
          "profilePhoto": "https://example.com/photo2.jpg"
        },
        "offeredSkill": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": "JavaScript",
          "category": "Programming"
        },
        "wantedSkill": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "Python",
          "category": "Programming"
        },
        "status": "pending",
        "message": "I'd love to learn this skill from you!",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "total": 1
  },
  "message": "Current user swaps retrieved successfully"
}
```

### 7. Get Pending Swap Requests

**GET** `/pending`

Get pending swap requests received by the current user.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "swaps": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "requester": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
          "username": "john_doe",
          "email": "john@example.com",
          "profilePhoto": "https://example.com/photo.jpg"
        },
        "offeredSkill": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": "JavaScript",
          "category": "Programming"
        },
        "wantedSkill": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "Python",
          "category": "Programming"
        },
        "status": "pending",
        "message": "I'd love to learn this skill from you!",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "total": 1
  },
  "message": "Pending swap requests retrieved successfully"
}
```

### 8. Get Swap History

**GET** `/history`

Get all swaps involving the current user (both sent and received).

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (pending, accepted, rejected, completed, cancelled)

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "swaps": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "requester": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
          "username": "john_doe",
          "email": "john@example.com",
          "profilePhoto": "https://example.com/photo.jpg"
        },
        "recipient": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "username": "jane_smith",
          "email": "jane@example.com",
          "profilePhoto": "https://example.com/photo2.jpg"
        },
        "offeredSkill": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": "JavaScript",
          "category": "Programming"
        },
        "wantedSkill": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "Python",
          "category": "Programming"
        },
        "status": "completed",
        "message": "I'd love to learn this skill from you!",
        "completedAt": "2024-01-15T12:00:00.000Z",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "total": 1
  },
  "message": "Swap history retrieved successfully"
}
```

### 9. Get Specific Swap

**GET** `/:swapId`

Get details of a specific swap by ID.

**Response (200):**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "requester": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "username": "john_doe",
      "email": "john@example.com",
      "profilePhoto": "https://example.com/photo.jpg"
    },
    "recipient": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "jane_smith",
      "email": "jane@example.com",
      "profilePhoto": "https://example.com/photo2.jpg"
    },
    "offeredSkill": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "JavaScript",
      "category": "Programming"
    },
    "wantedSkill": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "name": "Python",
      "category": "Programming"
    },
    "status": "pending",
    "message": "I'd love to learn this skill from you!",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Swap retrieved successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Recipient ID, offered skill, and wanted skill are required"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized request"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "You can only accept swap requests sent to you"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Swap request not found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "A swap request already exists between you and this user for these skills"
}
```

## Swap Status Flow

1. **pending** - Initial state when swap request is created
2. **accepted** - Recipient accepts the swap request
3. **rejected** - Recipient rejects the swap request
4. **completed** - Both users mark the swap as completed
5. **cancelled** - Requester cancels the swap request

## Business Rules

1. Users can only create swap requests for skills they have in their `skillsOffered` list
2. Users can only request skills that the recipient has in their `skillsOffered` list
3. Users cannot create swap requests with themselves
4. Only one pending swap can exist between two users for the same skill combination
5. Only the recipient can accept or reject a swap request
6. Only the requester can cancel a pending swap request
7. Both users involved in an accepted swap can mark it as completed
8. Users can only view swaps they're involved in (as requester or recipient)

## Rate Limiting

Consider implementing rate limiting to prevent spam:

- Maximum 10 swap requests per hour per user
- Maximum 5 pending swap requests per user at any time
