# Skills API Documentation

This document describes the Skills API endpoints for the Skill Swap Platform.

## Base URL

```
http://localhost:5000/api/v1/skills
```

## Authentication

- Public endpoints: No authentication required
- Protected endpoints: Require JWT token in Authorization header AND admin role
  ```
  Authorization: Bearer <your-jwt-token>
  ```

## Endpoints

### 1. Get All Skills

**GET** `/api/v1/skills`

Get all skills with optional filtering and pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in skill names and categories
- `isActive` (optional): Filter by active status (true/false)

**Example Request:**

```bash
GET /api/v1/skills?page=1&limit=5&category=Design
```

**Example Response:**

```json
{
  "statusCode": 200,
  "data": {
    "skills": [
      {
        "_id": "skill_photoshop",
        "name": "Photoshop",
        "category": "Design",
        "createdBy": "admin",
        "description": "Adobe Photoshop for image editing and graphic design",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalPages": 2,
    "currentPage": 1,
    "total": 10
  },
  "message": "Skills retrieved successfully",
  "success": true
}
```

### 2. Search Skills

**GET** `/api/v1/skills/search`

Search skills by name or category using text search.

**Query Parameters:**

- `q` (required): Search query (minimum 2 characters)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**

```bash
GET /api/v1/skills/search?q=photoshop&page=1&limit=5
```

### 3. Get Skills by Category

**GET** `/api/v1/skills/category/:category`

Get all skills in a specific category.

**Path Parameters:**

- `category`: Category name (case-insensitive)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**

```bash
GET /api/v1/skills/category/Design?page=1&limit=5
```

### 4. Get Skills by User ID

**GET** `/api/v1/skills/user/:userId`

Get all skills created by a specific user.

**Path Parameters:**

- `userId`: User ID (MongoDB ObjectId format)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**

```bash
GET /api/v1/skills/user/6871eea258a51ae0b451478b?page=1&limit=5
```

**Example Response:**

```json
{
  "statusCode": 200,
  "data": {
    "skills": [
      {
        "_id": "skill_photoshop",
        "skillId": "skill_photoshop",
        "name": "Photoshop",
        "category": "Design",
        "createdBy": "admin",
        "creatorId": "6871eea258a51ae0b451478b",
        "description": "Adobe Photoshop for image editing and graphic design",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "total": 1,
    "userId": "6871eea258a51ae0b451478b"
  },
  "message": "Skills by user retrieved successfully",
  "success": true
}
```

### 5. Get Skill by ID

**GET** `/api/v1/skills/:skillId`

Get a specific skill by its ID.

**Path Parameters:**

- `skillId`: Skill ID

**Example Request:**

```bash
GET /api/v1/skills/skill_photoshop
```

**Example Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "skill_photoshop",
    "name": "Photoshop",
    "category": "Design",
    "createdBy": "admin",
    "description": "Adobe Photoshop for image editing and graphic design",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Skill retrieved successfully",
  "success": true
}
```

### 6. Create Skill (Admin Only)

**POST** `/api/v1/skills`

Create a new skill. Requires authentication and admin role.

**Request Body:**

```json
{
  "name": "React",
  "category": "Programming",
  "description": "React.js for building user interfaces"
}
```

**Required Fields:**

- `name`: Skill name (string)
- `category`: Skill category (string)

**Optional Fields:**

- `description`: Skill description (string, max 500 characters)

**Example Response:**

```json
{
  "statusCode": 201,
  "data": {
    "_id": "skill_react",
    "name": "React",
    "category": "Programming",
    "createdBy": "user",
    "creatorId": "user_id_here",
    "description": "React.js for building user interfaces",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Skill created successfully",
  "success": true
}
```

### 7. Update Skill (Admin Only)

**PUT** `/api/v1/skills/:skillId`

Update an existing skill. Requires authentication and admin role.

**Path Parameters:**

- `skillId`: Skill ID

**Request Body:**

```json
{
  "name": "Updated Skill Name",
  "category": "Updated Category",
  "description": "Updated description",
  "isActive": true
}
```

**All fields are optional for updates.**

**Example Response:**

```json
{
  "statusCode": 200,
  "data": {
    "_id": "skill_photoshop",
    "name": "Updated Skill Name",
    "category": "Updated Category",
    "createdBy": "admin",
    "description": "Updated description",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Skill updated successfully",
  "success": true
}
```

### 8. Delete Skill (Admin Only)

**DELETE** `/api/v1/skills/:skillId`

Delete a skill. Requires authentication and admin role.

**Path Parameters:**

- `skillId`: Skill ID

**Example Response:**

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Skill deleted successfully",
  "success": true
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Name and category are required",
  "success": false
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized request",
  "success": false
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Access denied. Admin privileges required",
  "success": false
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Skill not found",
  "success": false
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Skill with this name already exists",
  "success": false
}
```

## Data Model

### Skill Schema

```javascript
{
  _id: ObjectId,         // MongoDB auto-generated ID
  skillId: String,       // Unique skill identifier (e.g., "skill_photoshop")
  name: String,          // Skill name (required)
  category: String,      // Skill category (required)
  createdBy: String,     // "admin" (only admins can create skills)
  creatorId: ObjectId,   // Reference to Admin User
  description: String,   // Optional description (max 500 chars)
  isActive: Boolean,     // Whether skill is active (default: true)
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

## Usage Examples

### Using cURL

1. **Get all skills:**

```bash
curl -X GET "http://localhost:5000/api/v1/skills"
```

2. **Get skills by user ID:**

```bash
curl -X GET "http://localhost:5000/api/v1/skills/user/6871eea258a51ae0b451478b"
```

3. **Create a skill (with admin authentication):**

```bash
curl -X POST "http://localhost:5000/api/v1/skills" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Node.js",
    "category": "Programming",
    "description": "Server-side JavaScript runtime"
  }'
```

4. **Update a skill (admin only):**

```bash
curl -X PUT "http://localhost:5000/api/v1/skills/skill_nodejs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "description": "Updated description for Node.js"
  }'
```

5. **Delete a skill (admin only):**

```bash
curl -X DELETE "http://localhost:5000/api/v1/skills/skill_nodejs" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

## Seeding Data

To populate the database with initial skills data:

```bash
npm run seed:skills
```

This will create 10 predefined skills across different categories.

## Creating Admin User

To create an admin user for testing admin-only endpoints:

```bash
npm run create:admin
```

This will create an admin user with:

- Email: admin@skillswap.com
- Password: admin123
- Role: admin

## Notes

- Skill IDs are automatically generated based on the skill name
- Only admins can create, update, or delete skills
- Regular users can only view and search skills
- Text search uses MongoDB's text index for better performance
- All responses follow a consistent format with statusCode, data, message, and success fields
