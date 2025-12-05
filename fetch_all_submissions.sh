#!/bin/bash

# LeetCode Session Cookie for bolers
COOKIE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYXV0aF91c2VyX2lkIjoiMTM5NzY2OTUiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJhbGxhdXRoLmFjY291bnQuYXV0aF9iYWNrZW5kcy5BdXRoZW50aWNhdGlvbkJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI4YjE4ZDExMWVlNjEyNGUzMWNiMzY0N2Y2NjRjYTkyMDA1YWY5ZGZkOGYxMDM2NDJjNjRiNWEzNWNhY2ViY2VjIiwic2Vzc2lvbl91dWlkIjoiZDA5YzcxMjEiLCJpZCI6MTM5NzY2OTUsImVtYWlsIjoiY29sbGluYm9sZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJib2xlcnMiLCJ1c2VyX3NsdWciOiJib2xlcnMiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvV2lkYWw5aHN2ay9hdmF0YXJfMTcyMDYyNzkzNC5wbmciLCJyZWZyZXNoZWRfYXQiOjE3NjQ5MDY5NjgsImlwIjoiMTQwLjE4MC4yNDAuMjMyIiwiaWRlbnRpdHkiOiJmMThiNTIxM2I2ZGUyNDkwZWM5YmUyMThiMGYwMjViMCIsImRldmljZV93aXRoX2lwIjpbIjMzYTc1MzQzNTcwM2VkMjA4YTQzN2Y5OTc5OTQzOTJmIiwiMTQwLjE4MC4yNDAuMjMyIl19.7GGrJ0rEZht0f2qw_RC5vGIcxT94-SEl2heVoGxPSR0"

OUTPUT_FILE="bolers_submissions.json"
LIMIT=20
OFFSET=0
HAS_NEXT=true
ALL_SUBMISSIONS="[]"
TOTAL=0

echo "Fetching all submissions for bolers..."

while [ "$HAS_NEXT" = "true" ]; do
    echo "Fetching offset $OFFSET..."
    
    RESPONSE=$(curl -s 'https://leetcode.com/graphql' \
        -H 'Content-Type: application/json' \
        -H "Cookie: LEETCODE_SESSION=$COOKIE" \
        -d "{\"query\":\"query submissionList(\$offset: Int, \$limit: Int) { submissionList(offset: \$offset, limit: \$limit) { lastKey hasNext submissions { id title titleSlug status statusDisplay lang runtime timestamp url } } }\",\"variables\":{\"offset\":$OFFSET,\"limit\":$LIMIT}}")
    
    # Extract hasNext
    HAS_NEXT=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(str(d['data']['submissionList']['hasNext']).lower())")
    
    # Extract submissions and merge
    SUBMISSIONS=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d['data']['submissionList']['submissions']))")
    
    # Count submissions in this batch
    BATCH_COUNT=$(echo "$SUBMISSIONS" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
    TOTAL=$((TOTAL + BATCH_COUNT))
    
    # Merge with all submissions
    ALL_SUBMISSIONS=$(python3 -c "
import json
all_subs = json.loads('$ALL_SUBMISSIONS')
new_subs = json.loads('$SUBMISSIONS')
all_subs.extend(new_subs)
print(json.dumps(all_subs))
")
    
    echo "  Got $BATCH_COUNT submissions (total: $TOTAL)"
    
    OFFSET=$((OFFSET + LIMIT))
    
    # Small delay to be nice to the API
    sleep 0.5
done

# Save to file
echo "$ALL_SUBMISSIONS" | python3 -m json.tool > "$OUTPUT_FILE"

echo ""
echo "Done! Total submissions: $TOTAL"
echo "Saved to: $OUTPUT_FILE"

