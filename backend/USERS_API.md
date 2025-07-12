# Users API Documentation

This document describes the Users API endpoints for the Skill Swap Platform.

## Base URL

```
http://localhost:3000/api/v1/users
```

## Authentication

All users endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get All Users

**GET** `/`

Retrieve all users with pagination, filtering, and sorting options.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of users per page (default: 10, max: 100)
- `role` (optional): Filter by user role ("user" or "admin")
- `isPublic` (optional): Filter by profile visibility ("true" or "false")
- `banned` (optional): Filter by ban status ("true" or "false")
- `availability` (optional): Filter by availability ("weekends", "weekdays", "evenings", "custom")
- `location` (optional): Filter by location (case-insensitive partial match)
- `sortBy` (optional): Sort field ("username", "email", "location", "createdAt", "updatedAt") (default: "createdAt")
- `sortOrder` (optional): Sort order ("asc" or "desc") (default: "desc")

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=10&role=user&isPublic=true&location=New York&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "username": "john_doe",
        "email": "john@example.com",
        "location": "New York",
        "profilePhoto": "https://example.com/photo.jpg",
        "skillsOffered": [
          {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
            "name": "JavaScript",
            "category": "Programming"
          }
        ],
        "skillsWanted": [
          {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
            "name": "Python",
            "category": "Programming"
          }
        ],
        "availability": "weekends",
        "isPublic": true,
        "role": "user",
        "banned": false,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "swapStats": {
          "offersMade": 5,
          "requestsReceived": 3,
          "completedSwaps": 2
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "total": 50,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Users retrieved successfully"
}
```

### 2. Search Users

**GET** `/search`

Search users with advanced filtering and text search capabilities.

**Query Parameters:**

- `q` (optional): Search query for username, email, or location (case-insensitive)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of users per page (default: 10, max: 100)
- `role` (optional): Filter by user role ("user" or "admin")
- `isPublic` (optional): Filter by profile visibility ("true" or "false")
- `banned` (optional): Filter by ban status ("true" or "false")
- `availability` (optional): Filter by availability ("weekends", "weekdays", "evenings", "custom")
- `location` (optional): Filter by location (case-insensitive partial match)
- `skillOffered` (optional): Filter by skill ID that users offer
- `skillWanted` (optional): Filter by skill ID that users want
- `sortBy` (optional): Sort field ("username", "email", "location", "createdAt", "updatedAt") (default: "createdAt")
- `sortOrder` (optional): Sort order ("asc" or "desc") (default: "desc")

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/v1/users/search?q=john&page=1&limit=10&skillOffered=64f8a1b2c3d4e5f6a7b8c9d1&location=NY&availability=weekends" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "username": "john_doe",
        "email": "john@example.com",
        "location": "New York",
        "profilePhoto": "https://example.com/photo.jpg",
        "skillsOffered": [
          {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
            "name": "JavaScript",
            "category": "Programming"
          }
        ],
        "skillsWanted": [
          {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
            "name": "Python",
            "category": "Programming"
          }
        ],
        "availability": "weekends",
        "isPublic": true,
        "role": "user",
        "banned": false,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "swapStats": {
          "offersMade": 5,
          "requestsReceived": 3,
          "completedSwaps": 2
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "total": 15,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "searchQuery": "john"
  },
  "message": "User search completed successfully"
}
```

### 3. Get User by ID

**GET** `/:userId`

Retrieve detailed information about a specific user including their swap history.

**Path Parameters:**

- `userId`: The ID of the user to retrieve

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/v1/users/64f8a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com",
      "location": "New York",
      "profilePhoto": "https://example.com/photo.jpg",
      "skillsOffered": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "name": "JavaScript",
          "category": "Programming",
          "description": "Modern JavaScript development"
        }
      ],
      "skillsWanted": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "Python",
          "category": "Programming",
          "description": "Python for data science"
        }
      ],
      "availability": "weekends",
      "isPublic": true,
      "role": "user",
      "banned": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "swapStats": {
        "offersMade": 5,
        "requestsReceived": 3,
        "completedSwaps": 2
      }
    },
    "swaps": {
      "offersMade": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
          "recipient": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
            "username": "jane_smith",
            "email": "jane@example.com",
            "profilePhoto": "https://example.com/photo2.jpg"
          },
          "offeredSkills": [
            {
              "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
              "name": "JavaScript",
              "category": "Programming"
            }
          ],
          "wantedSkills": [
            {
              "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
              "name": "Python",
              "category": "Programming"
            }
          ],
          "status": "pending",
          "message": "I'd love to learn Python from you!",
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "requestsReceived": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
          "requester": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
            "username": "bob_wilson",
            "email": "bob@example.com",
            "profilePhoto": "https://example.com/photo3.jpg"
          },
          "offeredSkills": [
            {
              "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
              "name": "React",
              "category": "Programming"
            }
          ],
          "wantedSkills": [
            {
              "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
              "name": "JavaScript",
              "category": "Programming"
            }
          ],
          "status": "pending",
          "message": "Can you teach me JavaScript?",
          "createdAt": "2024-01-14T15:20:00.000Z"
        }
      ],
      "completedSwaps": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
          "requester": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
            "username": "john_doe",
            "email": "john@example.com",
            "profilePhoto": "https://example.com/photo.jpg"
          },
          "recipient": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d9",
            "username": "alice_jones",
            "email": "alice@example.com",
            "profilePhoto": "https://example.com/photo4.jpg"
          },
          "offeredSkills": [
            {
              "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
              "name": "JavaScript",
              "category": "Programming"
            }
          ],
          "wantedSkills": [
            {
              "_id": "64f8a1b2c3d4e5f6a7b8c9da",
              "name": "Design",
              "category": "Creative"
            }
          ],
          "status": "accepted",
          "message": "Great swap!",
          "createdAt": "2024-01-10T09:15:00.000Z",
          "completedAt": "2024-01-12T14:30:00.000Z"
        }
      ]
    }
  },
  "message": "User details retrieved successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid pagination parameters"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Access token missing. Please login."
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

## Features

### Pagination

- All list endpoints support pagination with `page` and `limit` parameters
- Maximum limit is 100 users per page
- Pagination metadata includes current page, total pages, total count, and navigation flags

### Filtering

- Filter by user role (user/admin)
- Filter by profile visibility (public/private)
- Filter by ban status
- Filter by availability schedule
- Filter by location (case-insensitive partial match)
- Filter by skills offered or wanted (using skill IDs)

### Sorting

- Sort by username, email, location, creation date, or update date
- Ascending or descending order

### Search

- Text search across username, email, and location fields
- Case-insensitive search
- Can be combined with other filters

### Swap Statistics

- Each user includes swap statistics (offers made, requests received, completed swaps)
- Detailed swap information available in user profile endpoint

### Security

- Only public users are visible to non-admin users
- Admin users can see all users including private profiles
- Users can always see their own profile regardless of privacy settings

## Usage Examples

### Find JavaScript developers in New York

```bash
curl -X GET "http://localhost:3000/api/v1/users/search?skillOffered=64f8a1b2c3d4e5f6a7b8c9d1&location=New York" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get users who want to learn Python

```bash
curl -X GET "http://localhost:3000/api/v1/users/search?skillWanted=64f8a1b2c3d4e5f6a7b8c9d2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search for users by name

```bash
curl -X GET "http://localhost:3000/api/v1/users/search?q=john&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get all admin users

```bash
curl -X GET "http://localhost:3000/api/v1/users?role=admin" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
