#!/bin/bash

# Test script for Reviews API
# Make sure the server is running on localhost:3000

BASE_URL="http://localhost:3000/api/v1"
AUTH_TOKEN=""
USER1_TOKEN=""
USER2_TOKEN=""
USER1_ID=""
USER2_ID=""
SWAP_ID=""
REVIEW_ID=""

echo "🧪 Testing Reviews API"
echo "======================"

# Function to make authenticated requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    
    if [ -n "$data" ]; then
        curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data"
    else
        curl -s -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token"
    fi
}

# Function to extract values from JSON response
extract_value() {
    local json=$1
    local key=$2
    echo "$json" | grep -o "\"$key\":[^,}]*" | cut -d':' -f2 | tr -d '"' | tr -d ' '
}

# Step 1: Register and login users
echo "1. Registering test users..."

# Register user 1
USER1_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testuser1",
        "email": "testuser1@example.com",
        "password": "password123"
    }')

echo "User 1 registration response: $USER1_RESPONSE"

# Register user 2
USER2_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testuser2",
        "email": "testuser2@example.com",
        "password": "password123"
    }')

echo "User 2 registration response: $USER2_RESPONSE"

# Login user 1
echo "2. Logging in users..."
LOGIN1_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "testuser1@example.com",
        "password": "password123"
    }')

USER1_TOKEN=$(extract_value "$LOGIN1_RESPONSE" "accessToken")
echo "User 1 token: $USER1_TOKEN"

# Login user 2
LOGIN2_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "testuser2@example.com",
        "password": "password123"
    }')

USER2_TOKEN=$(extract_value "$LOGIN2_RESPONSE" "accessToken")
echo "User 2 token: $USER2_TOKEN"

# Get user IDs
echo "3. Getting user IDs..."
USERS_RESPONSE=$(make_request "GET" "/users" "" "$USER1_TOKEN")
USER1_ID=$(extract_value "$USERS_RESPONSE" "_id" | head -1)
echo "User 1 ID: $USER1_ID"

# Get user 2 ID by searching
SEARCH_RESPONSE=$(make_request "GET" "/users/search?q=testuser2" "" "$USER1_TOKEN")
USER2_ID=$(extract_value "$SEARCH_RESPONSE" "_id" | head -1)
echo "User 2 ID: $USER2_ID"

# Step 4: Create a swap (we need a completed swap to test reviews)
echo "4. Creating a test swap..."
# First, let's get some skills
SKILLS_RESPONSE=$(curl -s -X GET "$BASE_URL/skills" \
    -H "Authorization: Bearer $USER1_TOKEN")

SKILL1_ID=$(extract_value "$SKILLS_RESPONSE" "_id" | head -1)
SKILL2_ID=$(extract_value "$SKILLS_RESPONSE" "_id" | tail -1)

echo "Using skills: $SKILL1_ID and $SKILL2_ID"

# Create swap
SWAP_RESPONSE=$(make_request "POST" "/swaps/request" "{
    \"recipient\": \"$USER2_ID\",
    \"offeredSkills\": [\"$SKILL1_ID\"],
    \"wantedSkills\": [\"$SKILL2_ID\"],
    \"message\": \"Test swap for review testing\"
}" "$USER1_TOKEN")

echo "Swap creation response: $SWAP_RESPONSE"
SWAP_ID=$(extract_value "$SWAP_RESPONSE" "_id")
echo "Swap ID: $SWAP_ID"

# Accept the swap (simulate completed swap)
if [ -n "$SWAP_ID" ]; then
    echo "5. Accepting swap to simulate completion..."
    ACCEPT_RESPONSE=$(make_request "PUT" "/swaps/$SWAP_ID/accept" "" "$USER2_TOKEN")
    echo "Accept response: $ACCEPT_RESPONSE"
fi

# Step 6: Test creating a review
echo "6. Testing review creation..."
if [ -n "$SWAP_ID" ]; then
    REVIEW_RESPONSE=$(make_request "POST" "/reviews" "{
        \"rating\": 5,
        \"comment\": \"Excellent skill swap experience! Very professional and helpful.\",
        \"swapId\": \"$SWAP_ID\"
    }" "$USER1_TOKEN")
    
    echo "Review creation response: $REVIEW_RESPONSE"
    REVIEW_ID=$(extract_value "$REVIEW_RESPONSE" "_id")
    echo "Review ID: $REVIEW_ID"
fi

# Step 7: Test getting user reviews
echo "7. Testing get user reviews..."
if [ -n "$USER2_ID" ]; then
    USER_REVIEWS_RESPONSE=$(make_request "GET" "/reviews/user/$USER2_ID" "" "$USER1_TOKEN")
    echo "User reviews response: $USER_REVIEWS_RESPONSE"
fi

# Step 8: Test getting user average rating
echo "8. Testing get user average rating..."
if [ -n "$USER2_ID" ]; then
    USER_RATING_RESPONSE=$(make_request "GET" "/reviews/user/$USER2_ID/rating" "" "$USER1_TOKEN")
    echo "User rating response: $USER_RATING_RESPONSE"
fi

# Step 9: Test getting reviews written by user
echo "9. Testing get reviews written by user..."
if [ -n "$USER1_ID" ]; then
    WRITTEN_REVIEWS_RESPONSE=$(make_request "GET" "/reviews/by-user/$USER1_ID" "" "$USER1_TOKEN")
    echo "Written reviews response: $WRITTEN_REVIEWS_RESPONSE"
fi

# Step 10: Test updating a review
echo "10. Testing review update..."
if [ -n "$REVIEW_ID" ]; then
    UPDATE_RESPONSE=$(make_request "PUT" "/reviews/$REVIEW_ID" "{
        \"rating\": 4,
        \"comment\": \"Updated: Great experience, but could be improved slightly.\"
    }" "$USER1_TOKEN")
    
    echo "Review update response: $UPDATE_RESPONSE"
fi

# Step 11: Test getting user details with rating stats
echo "11. Testing user details with rating stats..."
if [ -n "$USER2_ID" ]; then
    USER_DETAILS_RESPONSE=$(make_request "GET" "/users/$USER2_ID" "" "$USER1_TOKEN")
    echo "User details with rating stats: $USER_DETAILS_RESPONSE"
fi

# Step 12: Test getting all users with rating stats
echo "12. Testing get all users with rating stats..."
ALL_USERS_RESPONSE=$(make_request "GET" "/users" "" "$USER1_TOKEN")
echo "All users with rating stats: $ALL_USERS_RESPONSE"

# Step 13: Test search users with rating stats
echo "13. Testing search users with rating stats..."
SEARCH_USERS_RESPONSE=$(make_request "GET" "/users/search?q=testuser" "" "$USER1_TOKEN")
echo "Search users with rating stats: $SEARCH_USERS_RESPONSE"

# Step 14: Test error cases
echo "14. Testing error cases..."

# Try to create review without authentication
echo "Testing review creation without auth..."
NO_AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/reviews" \
    -H "Content-Type: application/json" \
    -d '{
        "rating": 5,
        "comment": "This should fail",
        "swapId": "invalid"
    }')
echo "No auth response: $NO_AUTH_RESPONSE"

# Try to create review with invalid rating
echo "Testing review creation with invalid rating..."
INVALID_RATING_RESPONSE=$(make_request "POST" "/reviews" "{
    \"rating\": 6,
    \"comment\": \"This should fail\",
    \"swapId\": \"$SWAP_ID\"
}" "$USER1_TOKEN")
echo "Invalid rating response: $INVALID_RATING_RESPONSE"

# Try to create duplicate review
echo "Testing duplicate review creation..."
DUPLICATE_RESPONSE=$(make_request "POST" "/reviews" "{
    \"rating\": 3,
    \"comment\": \"This should fail - duplicate\",
    \"swapId\": \"$SWAP_ID\"
}" "$USER1_TOKEN")
echo "Duplicate review response: $DUPLICATE_RESPONSE"

echo ""
echo "✅ Reviews API testing completed!"
echo "Check the responses above to verify all functionality is working correctly." 