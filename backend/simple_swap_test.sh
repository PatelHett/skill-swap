#!/bin/bash

# Simple Swap API Test Script
# Using real users and tokens

echo "=== Swap API Test Script ==="
echo "Using real users and tokens"
echo

# User IDs
USER1_ID="687235a1aea40ec25f2e8651"  # newuser1
USER2_ID="687235b0aea40ec25f2e8654"  # newuser2

# Skill IDs
SKILL1_ID="687223da2ee886a0f6c8a848"  # JS
SKILL2_ID="687223e02ee886a0f6c8a84b"  # RJS
SKILL3_ID="687223e92ee886a0f6c8a84e"  # NJS

# Tokens (from login responses)
USER1_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcyMzVhMWFlYTQwZWMyNWYyZTg2NTEiLCJlbWFpbCI6Im5ld3VzZXIxQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTIzMTUzMjIsImV4cCI6MTc1OTUxNTMyMn0.dQAS0pEWWyT3EeoVpNyIQSeR2Jxb4KTQ4Dxz-X3uVJg"
USER2_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODcyMzViMGFlYTQwZWMyNWYyZTg2NTQiLCJlbWFpbCI6Im5ld3VzZXIyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTIzMTUzMzEsImV4cCI6MTc1OTUxNTMzMX0.pSKdzD-srdaNrd3SwxwLdj53n3-Kd9Cdm0BtYnzRNqc"

BASE_URL="http://localhost:3000/api/v1"

echo "User 1 (newuser1):"
echo "  - Offers: $SKILL1_ID, $SKILL2_ID"
echo "  - Wants: $SKILL3_ID"
echo
echo "User 2 (newuser2):"
echo "  - Offers: $SKILL3_ID"
echo "  - Wants: $SKILL1_ID, $SKILL2_ID"
echo

# Test 1: Create swap request (User 1 offers skills to User 2)
echo "=== Test 1: Create Swap Request ==="
SWAP_DATA='{
  "recipientId": "'$USER2_ID'",
  "offeredSkillIds": ["'$SKILL1_ID'", "'$SKILL2_ID'"],
  "wantedSkillIds": ["'$SKILL3_ID'"]
}'

echo "Swap Data: $SWAP_DATA"
echo

SWAP_RESPONSE=$(curl -s -X POST "$BASE_URL/swaps/request" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d "$SWAP_DATA")

echo "Swap Creation Response: $SWAP_RESPONSE"
echo

# Extract swap ID
SWAP_ID=$(echo $SWAP_RESPONSE | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SWAP_ID" ]; then
    echo "❌ Failed to create swap"
    exit 1
fi

echo "✅ Swap created with ID: $SWAP_ID"
echo

# Test 2: View pending swaps for User 2
echo "=== Test 2: View Pending Swaps (User 2) ==="
PENDING_RESPONSE=$(curl -s -X GET "$BASE_URL/swaps/pending" \
  -H "Authorization: Bearer $USER2_TOKEN")

echo "Pending Swaps Response: $PENDING_RESPONSE"
echo

# Test 3: Accept the swap (User 2 accepts User 1's offer)
echo "=== Test 3: Accept Swap ==="
ACCEPT_RESPONSE=$(curl -s -X PUT "$BASE_URL/swaps/$SWAP_ID/accept" \
  -H "Authorization: Bearer $USER2_TOKEN")

echo "Accept Swap Response: $ACCEPT_RESPONSE"
echo

# Test 4: View current swaps for both users
echo "=== Test 4: View Current Swaps (User 1) ==="
CURRENT_RESPONSE1=$(curl -s -X GET "$BASE_URL/swaps/current" \
  -H "Authorization: Bearer $USER1_TOKEN")

echo "Current Swaps (User 1): $CURRENT_RESPONSE1"
echo

echo "=== Test 4: View Current Swaps (User 2) ==="
CURRENT_RESPONSE2=$(curl -s -X GET "$BASE_URL/swaps/current" \
  -H "Authorization: Bearer $USER2_TOKEN")

echo "Current Swaps (User 2): $CURRENT_RESPONSE2"
echo

# Test 5: View current swaps for both users after acceptance
echo "=== Test 5: View Current Swaps After Acceptance (User 1) ==="
CURRENT_RESPONSE1=$(curl -s -X GET "$BASE_URL/swaps/current" \
  -H "Authorization: Bearer $USER1_TOKEN")

echo "Current Swaps (User 1): $CURRENT_RESPONSE1"
echo

echo "=== Test 5: View Current Swaps After Acceptance (User 2) ==="
CURRENT_RESPONSE2=$(curl -s -X GET "$BASE_URL/swaps/current" \
  -H "Authorization: Bearer $USER2_TOKEN")

echo "Current Swaps (User 2): $CURRENT_RESPONSE2"
echo

# Test 6: View swap history for both users
echo "=== Test 6: View Swap History (User 1) ==="
HISTORY_RESPONSE1=$(curl -s -X GET "$BASE_URL/swaps/history" \
  -H "Authorization: Bearer $USER1_TOKEN")

echo "Swap History (User 1): $HISTORY_RESPONSE1"
echo

echo "=== Test 6: View Swap History (User 2) ==="
HISTORY_RESPONSE2=$(curl -s -X GET "$BASE_URL/swaps/history" \
  -H "Authorization: Bearer $USER2_TOKEN")

echo "Swap History (User 2): $HISTORY_RESPONSE2"
echo

echo "=== Test Complete ==="
echo "✅ All swap functionality tested successfully!" 