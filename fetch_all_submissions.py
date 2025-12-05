#!/usr/bin/env python3
import json
import urllib.request
import time
from collections import Counter
from datetime import datetime

COOKIE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYXV0aF91c2VyX2lkIjoiMTM5NzY2OTUiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJhbGxhdXRoLmFjY291bnQuYXV0aF9iYWNrZW5kcy5BdXRoZW50aWNhdGlvbkJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI4YjE4ZDExMWVlNjEyNGUzMWNiMzY0N2Y2NjRjYTkyMDA1YWY5ZGZkOGYxMDM2NDJjNjRiNWEzNWNhY2ViY2VjIiwic2Vzc2lvbl91dWlkIjoiZDA5YzcxMjEiLCJpZCI6MTM5NzY2OTUsImVtYWlsIjoiY29sbGluYm9sZXJAZ21haWwuY29tIiwidXNlcm5hbWUiOiJib2xlcnMiLCJ1c2VyX3NsdWciOiJib2xlcnMiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvV2lkYWw5aHN2ay9hdmF0YXJfMTcyMDYyNzkzNC5wbmciLCJyZWZyZXNoZWRfYXQiOjE3NjQ5MDY5NjgsImlwIjoiMTQwLjE4MC4yNDAuMjMyIiwiaWRlbnRpdHkiOiJmMThiNTIxM2I2ZGUyNDkwZWM5YmUyMThiMGYwMjViMCIsImRldmljZV93aXRoX2lwIjpbIjMzYTc1MzQzNTcwM2VkMjA4YTQzN2Y5OTc5OTQzOTJmIiwiMTQwLjE4MC4yNDAuMjMyIl19.7GGrJ0rEZht0f2qw_RC5vGIcxT94-SEl2heVoGxPSR0"

QUERY = """
query submissionList($offset: Int, $limit: Int) {
    submissionList(offset: $offset, limit: $limit) {
        lastKey
        hasNext
        submissions {
            id
            title
            titleSlug
            status
            statusDisplay
            lang
            runtime
            timestamp
            url
        }
    }
}
"""

def fetch_all_submissions():
    all_submissions = []
    offset = 0
    limit = 20
    has_next = True
    
    print("Fetching all submissions for bolers...")
    
    while has_next:
        print(f"Fetching offset {offset}...", end=" ")
        
        req = urllib.request.Request(
            'https://leetcode.com/graphql',
            data=json.dumps({
                'query': QUERY,
                'variables': {'offset': offset, 'limit': limit}
            }).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Cookie': f'LEETCODE_SESSION={COOKIE}'
            }
        )
        
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        result = data['data']['submissionList']
        
        submissions = result['submissions']
        all_submissions.extend(submissions)
        has_next = result['hasNext']
        
        print(f"Got {len(submissions)} (total: {len(all_submissions)})")
        
        offset += limit
        time.sleep(0.3)  # Be nice to the API
    
    return all_submissions

if __name__ == '__main__':
    submissions = fetch_all_submissions()
    
    # Save to file
    with open('bolers_submissions.json', 'w') as f:
        json.dump(submissions, f, indent=2)
    
    print(f"\n✅ Done! Total submissions: {len(submissions)}")
    print("📁 Saved to: bolers_submissions.json")
    
    # Print some stats
    years = Counter()
    for sub in submissions:
        ts = int(sub['timestamp'])
        year = datetime.fromtimestamp(ts).year
        years[year] += 1
    
    print("\n📊 Submissions by year:")
    for year in sorted(years.keys()):
        print(f"  {year}: {years[year]}")
