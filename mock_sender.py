#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mock Event Sender

Continuously sends mock events to the Zapier Triggers API to demonstrate
real-time event streaming capabilities.
"""

import requests
import time
import random
from datetime import datetime
import sys

API_URL = "http://localhost:8000/api/v1/events"

MOCK_EVENTS = [
    {
        "source": "stripe",
        "event_type": "payment.succeeded",
        "payload": lambda: {
            "amount": random.randint(1000, 9999),
            "currency": "usd",
            "customer_id": f"cus_{random.randint(10000, 99999)}"
        }
    },
    {
        "source": "stripe",
        "event_type": "payment.failed",
        "payload": lambda: {
            "amount": random.randint(1000, 9999),
            "currency": "usd",
            "error": random.choice(["insufficient_funds", "card_declined", "expired_card"])
        }
    },
    {
        "source": "gmail",
        "event_type": "email.received",
        "payload": lambda: {
            "from": f"user{random.randint(1, 100)}@example.com",
            "subject": random.choice([
                "Important Update",
                "Meeting Request",
                "Project Status",
                "Invoice Attached",
                "Quick Question"
            ]),
            "has_attachment": random.choice([True, False])
        }
    },
    {
        "source": "slack",
        "event_type": "message.sent",
        "payload": lambda: {
            "channel": random.choice(["#general", "#engineering", "#sales", "#support"]),
            "user": f"user{random.randint(1, 10)}",
            "text": random.choice([
                "Project completed!",
                "Need help with deployment",
                "Meeting in 5 minutes",
                "New PR ready for review"
            ])
        }
    },
    {
        "source": "github",
        "event_type": "push",
        "payload": lambda: {
            "repo": random.choice([
                "zapier/triggers-api",
                "zapier/workflows",
                "zapier/integrations"
            ]),
            "commits": random.randint(1, 5),
            "branch": random.choice(["main", "develop", "feature/new-api"])
        }
    },
    {
        "source": "github",
        "event_type": "pull_request.opened",
        "payload": lambda: {
            "repo": "zapier/triggers-api",
            "pr_number": random.randint(100, 999),
            "author": f"developer{random.randint(1, 20)}"
        }
    },
    {
        "source": "shopify",
        "event_type": "order.created",
        "payload": lambda: {
            "order_id": f"ord_{random.randint(10000, 99999)}",
            "total": round(random.uniform(25.0, 500.0), 2),
            "items": random.randint(1, 5)
        }
    },
    {
        "source": "twilio",
        "event_type": "sms.received",
        "payload": lambda: {
            "from": f"+1555{random.randint(1000000, 9999999)}",
            "body": random.choice([
                "Thanks for the update!",
                "When is my order arriving?",
                "Please call me back",
                "Confirm appointment"
            ])
        }
    },
]


def send_event():
    """Send a random mock event to the API"""
    template = random.choice(MOCK_EVENTS)
    event = {
        "source": template["source"],
        "event_type": template["event_type"],
        "payload": template["payload"]()  # Call the lambda to generate dynamic data
    }

    try:
        response = requests.post(API_URL, json=event, timeout=5)
        if response.status_code in [200, 201]:
            data = response.json()
            timestamp = datetime.now().strftime('%H:%M:%S')
            print(
                f"[OK] [{timestamp}] {event['source']}.{event['event_type']} "
                f"-> {data['event_id']}"
            )
            return True
        else:
            print(f"[FAIL] HTTP {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("[ERROR] Cannot connect to API. Is the server running?")
        return False
    except requests.exceptions.Timeout:
        print("[ERROR] Request timed out")
        return False
    except Exception as e:
        print(f"[ERROR] {e}")
        return False


def main():
    """Main loop for sending mock events"""
    print("=" * 60)
    print("Mock Event Sender for Zapier Triggers API")
    print("=" * 60)
    print(f"Sending events to: {API_URL}")
    print("Interval: 2-5 seconds (random)")
    print("Press Ctrl+C to stop")
    print("=" * 60)
    print()

    # Test connection first
    print("Testing API connection...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=2)
        if response.status_code == 200:
            print("[OK] Connected to API successfully!\n")
        else:
            print("[WARN] API returned unexpected status\n")
    except Exception:
        print("[ERROR] Cannot connect to API. Make sure it's running!\n")
        print("        Start the API with: uv run uvicorn app.main:app --reload\n")
        sys.exit(1)

    event_count = 0
    try:
        while True:
            if send_event():
                event_count += 1
                if event_count % 10 == 0:
                    print(f"\n[INFO] Sent {event_count} events so far...\n")

            # Random delay between 2-5 seconds
            time.sleep(random.uniform(2, 5))

    except KeyboardInterrupt:
        print("\n")
        print("=" * 60)
        print(f"Stopped. Total events sent: {event_count}")
        print("=" * 60)
        sys.exit(0)


if __name__ == "__main__":
    main()
