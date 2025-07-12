# Manual Testing Guide for Swap API

## Prerequisites

1. Make sure your server is running on `localhost:3000`
2. Install `jq` for JSON formatting: `brew install jq` (macOS) or `apt-get install jq` (Ubuntu)
3. Have some skills already created in your database

## Quick Test Commands

### 1. Create Test Users

```bash
# Create User 1
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser1",
    "email": "testuser1@example.com",
    "password": "password123",
    "location": "New York"
  }'

# Create User 2
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2",
    "email": "testuser2@example.com",
    "password": "password123",
    "location": "Los Angeles"
  }'
```

### 2. Login and Get Token

```bash
# Login User 1
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser1@example.com",
    "password": "password123"
  }'
```

### 3. Add Skills to Users

```bash
# Replace YOUR_TOKEN with the actual token from login
# Replace SKILL_IDS with actual skill IDs from your database

# Add skills to User 1
curl -X PUT http://localhost:3000/api/v1/auth/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "skillsOffered": ["SKILL1_ID", "SKILL3_ID"],
    "skillsWanted": ["SKILL2_ID", "SKILL4_ID"]
  }'
```

### 4. Create Swap Request

```bash
# Replace USER2_ID with actual User 2 ID
curl -X POST http://localhost:3000/api/v1/swaps/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recipientId": "USER2_ID",
    "offeredSkillIds": ["SKILL1_ID", "SKILL3_ID"],
    "wantedSkillIds": ["SKILL2_ID", "SKILL4_ID"],
    "message": "I would love to learn these skills from you!"
  }'
```

njs 687223e92ee886a0f6c8a84e
rjs 687223e02ee886a0f6c8a84b
js 687223da2ee886a0f6c8a848

### 5. View Swaps

```bash
# Get current user's swaps
curl -X GET http://localhost:3000/api/v1/swaps/current \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get pending swap requests
curl -X GET http://localhost:3000/api/v1/swaps/pending \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get swap history
curl -X GET http://localhost:3000/api/v1/swaps/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Accept Swap Request

```bash
# Login as User 2 first, then accept
curl -X PUT http://localhost:3000/api/v1/swaps/SWAP_ID/accept \
  -H "Authorization: Bearer USER2_TOKEN"
```

### 7. Complete Swap

```bash
curl -X PUT http://localhost:3000/api/v1/swaps/SWAP_ID/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing Edge Cases

### 1. Try to swap with yourself

```bash
curl -X POST http://localhost:3000/api/v1/swaps/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recipientId": "YOUR_OWN_USER_ID",
    "offeredSkillIds": ["SKILL1_ID"],
    "wantedSkillIds": ["SKILL2_ID"]
  }'
```

### 2. Try to swap skills you don't have

```bash
curl -X POST http://localhost:3000/api/v1/swaps/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recipientId": "USER2_ID",
    "offeredSkillIds": ["SKILL_YOU_DONT_HAVE"],
    "wantedSkillIds": ["SKILL2_ID"]
  }'
```

### 3. Try to accept swap as wrong user

```bash
# Login as User 1 and try to accept a swap sent to User 2
curl -X PUT http://localhost:3000/api/v1/swaps/SWAP_ID/accept \
  -H "Authorization: Bearer USER1_TOKEN"
```

## Expected Responses

### Successful Swap Creation

```json
{
  "statusCode": 201,
  "data": {
    "_id": "swap_id",
    "requester": {
      "_id": "user1_id",
      "username": "testuser1",
      "email": "testuser1@example.com"
    },
    "recipient": {
      "_id": "user2_id",
      "username": "testuser2",
      "email": "testuser2@example.com"
    },
    "offeredSkills": [
      {
        "_id": "skill1_id",
        "name": "JavaScript",
        "category": "Programming"
      }
    ],
    "wantedSkills": [
      {
        "_id": "skill2_id",
        "name": "Python",
        "category": "Programming"
      }
    ],
    "status": "pending",
    "message": "I would love to learn these skills from you!",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Swap request created successfully"
}
```

### Error Response (Self Swap)

```json
{
  "statusCode": 400,
  "message": "Cannot create swap request with yourself"
}
```

### Error Response (Missing Skills)

```json
{
  "statusCode": 400,
  "message": "You don't have all the offered skills in your skills list"
}
```

## Testing Checklist

- [ ] User registration works
- [ ] User login works and returns JWT token
- [ ] Adding skills to user profile works
- [ ] Creating swap request works
- [ ] Viewing current swaps works
- [ ] Viewing pending swaps works
- [ ] Viewing swap history works
- [ ] Accepting swap request works
- [ ] Completing swap works
- [ ] Self-swap prevention works
- [ ] Missing skills validation works
- [ ] Wrong user acceptance prevention works
- [ ] Duplicate swap prevention works

## Troubleshooting

1. **401 Unauthorized**: Check if JWT token is valid and included in Authorization header
2. **404 Not Found**: Check if user IDs and skill IDs exist in database
3. **400 Bad Request**: Check request body format and validation rules
4. **403 Forbidden**: Check if user has permission to perform the action
5. **409 Conflict**: Check if duplicate swap already exists

## Database Setup

Make sure you have some skills in your database. You can create them using the admin interface or by running the seed script:

```bash
# If you have a seed script
node src/scripts/seedSkills.js
```

Or manually create skills via the skills API (requires admin privileges).
