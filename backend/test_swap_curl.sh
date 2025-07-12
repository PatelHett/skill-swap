#!/bin/bash

# Swap API Test Script using curl
# Make sure your server is running on localhost:3000

BASE_URL="http://localhost:3000/api/v1"
AUTH_TOKEN="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcxZWVhMjU4YTUxYWUwYjQ1MTQ3OGIiLCJlbWFpbCI6ImFkbWluQHNraWxsc3dhcC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTIyOTkwNDksImV4cCI6MTc1OTQ5OTA0OX0.IRrSGStQmHtQRZ83RtyfvQXi0xkUzXiOKnR3OMqIWAA"
USER1_ID="68720e6d227715396084ebec"
USER2_ID="68720e91227715396084ebf0"

# User 1: offered 687223e92ee886a0f6c8a84e, wanted 687223e02ee886a0f6c8a84b, 687223da2ee886a0f6c8a848
# User 2: offered 687223da2ee886a0f6c8a84e, 687223e02ee886a0f6c8a84b, wanted 687223e92ee886a0f6c8a84e

SKILL1_ID="687223e92ee886a0f6c8a84e"  # User 1's offered skill
SKILL2_ID="687223e02ee886a0f6c8a84b"  # User 1's wanted skill 1
SKILL3_ID="687223da2ee886a0f6c8a848"  # User 1's wanted skill 2 (User 2's offered skill 1)
SKILL4_ID="687223e02ee886a0f6c8a84b"  # User 2's offered skill 2
SWAP_ID=""

echo "🚀 Starting Swap API Test with curl"

# Function to make API calls
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    local url="$BASE_URL$endpoint"
    
    echo -e "\n🔗 $method $endpoint"
    
    local response
    if [ "$method" = "GET" ]; then
        response=$(curl -s -X GET "$url" \
            -H "Content-Type: application/json" \
            -H "Authorization: $AUTH_TOKEN")
    else
        response=$(curl -s -X $method "$url" \
            -H "Content-Type: application/json" \
            -H "Authorization: $AUTH_TOKEN" \
            -d "$data")
    fi
    
    echo "$response" | jq '.'
    echo -e "\n---"
    
    # Return the response for further processing
    echo "$response"
}

# Step 1: Using existing users
echo "👥 Using existing users from database..."
echo "User 1 ID: $USER1_ID"
echo "User 2 ID: $USER2_ID"
echo "Using admin token for testing"

# Step 2: Using admin token
echo -e "\n🔐 Using admin token for testing..."
echo "Auth token: ${AUTH_TOKEN:0:20}..."

# Step 3: Add skills to User 1 (68720e6d227715396084ebec)
echo -e "\n➕ Adding skills to User 1..."
make_request "PUT" "/auth/update-profile" '{
    "skillsOffered": ["'$SKILL1_ID'"],
    "skillsWanted": ["'$SKILL2_ID'", "'$SKILL3_ID'"]
}'

# Step 4: Add skills to User 2 (68720e91227715396084ebf0)
echo -e "\n➕ Adding skills to User 2..."
make_request "PUT" "/auth/update-profile" '{
    "skillsOffered": ["'$SKILL3_ID'", "'$SKILL4_ID'"],
    "skillsWanted": ["'$SKILL1_ID'"]
}'

# Step 5: Create swap request
echo -e "\n📝 Creating swap request..."

echo -e "\n📝 Creating swap request..."
SWAP_RESPONSE=$(make_request "POST" "/swaps/request" '{
    "recipientId": "'$USER2_ID'",
    "offeredSkillIds": ["'$SKILL1_ID'"],
    "wantedSkillIds": ["'$SKILL3_ID'", "'$SKILL4_ID'"],
    "message": "I would love to learn these skills from you!"
}')

# Extract swap ID from the response
SWAP_ID=$(echo "$SWAP_RESPONSE" | jq -r '.data._id // empty')
echo "Swap ID: $SWAP_ID"

# Step 6: Test viewing swaps
echo -e "\n👀 Testing swap views..."

# Get current user's swaps
make_request "GET" "/swaps/current"

# View pending requests for User 2
echo -e "\n👀 Viewing pending requests for User 2..."

# Get pending swap requests
make_request "GET" "/swaps/pending"

# Get specific swap details
make_request "GET" "/swaps/$SWAP_ID"

# Step 7: Accept swap request
echo -e "\n✅ Accepting swap request..."
make_request "PUT" "/swaps/$SWAP_ID/accept" "{}"

# Step 8: Complete swap
echo -e "\n🏁 Completing swap..."
make_request "PUT" "/swaps/$SWAP_ID/complete" "{}"

# Step 9: Test swap history
echo -e "\n📚 Testing swap history..."
make_request "GET" "/swaps/history"

# View history for User 1
echo -e "\n📚 Viewing history for User 1..."

make_request "GET" "/swaps/history"

echo -e "\n✅ Complete Swap Flow Test Finished!" 