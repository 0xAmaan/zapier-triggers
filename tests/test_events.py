"""
Basic tests for the Zapier Triggers API

To run tests:
    uv run pytest tests/

For coverage:
    uv run pytest --cov=app tests/
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Test the root endpoint returns API info"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Zapier Triggers API"
    assert "version" in data
    assert "docs" in data


def test_health_endpoint():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_create_event():
    """Test creating a new event"""
    event_data = {
        "source": "test",
        "event_type": "test.event",
        "payload": {"message": "test payload"}
    }
    response = client.post("/api/v1/events", json=event_data)
    assert response.status_code == 201
    data = response.json()
    assert "event_id" in data
    assert data["status"] == "received"
    assert "created_at" in data


def test_create_event_validation():
    """Test event creation with invalid data"""
    # Empty source should fail
    event_data = {
        "source": "",
        "event_type": "test.event",
        "payload": {}
    }
    response = client.post("/api/v1/events", json=event_data)
    assert response.status_code == 422


def test_get_inbox():
    """Test retrieving events from inbox"""
    response = client.get("/api/v1/inbox")
    assert response.status_code == 200
    data = response.json()
    assert "events" in data
    assert "total" in data
    assert isinstance(data["events"], list)


def test_event_lifecycle():
    """Test the complete event lifecycle: create -> retrieve -> acknowledge"""
    # Create an event
    event_data = {
        "source": "lifecycle",
        "event_type": "test.lifecycle",
        "payload": {"step": "create"}
    }
    create_response = client.post("/api/v1/events", json=event_data)
    assert create_response.status_code == 201
    event_id = create_response.json()["event_id"]

    # Retrieve the event
    get_response = client.get(f"/api/v1/events/{event_id}")
    assert get_response.status_code == 200
    event = get_response.json()
    assert event["event_id"] == event_id
    assert event["status"] == "pending"

    # Acknowledge the event
    delete_response = client.delete(f"/api/v1/events/{event_id}")
    assert delete_response.status_code == 200
    ack_data = delete_response.json()
    assert ack_data["status"] == "acknowledged"
    assert ack_data["event_id"] == event_id


def test_get_nonexistent_event():
    """Test retrieving a non-existent event"""
    response = client.get("/api/v1/events/evt_nonexistent")
    assert response.status_code == 404


def test_acknowledge_nonexistent_event():
    """Test acknowledging a non-existent event"""
    response = client.delete("/api/v1/events/evt_nonexistent")
    assert response.status_code == 404


def test_inbox_with_limit():
    """Test inbox pagination with limit parameter"""
    # Create multiple events
    for i in range(5):
        event_data = {
            "source": "test",
            "event_type": "pagination.test",
            "payload": {"index": i}
        }
        client.post("/api/v1/events", json=event_data)

    # Test with limit
    response = client.get("/api/v1/inbox?limit=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data["events"]) <= 3


def test_source_normalization():
    """Test that source is normalized to lowercase"""
    event_data = {
        "source": "UPPERCASE",
        "event_type": "TEST.EVENT",
        "payload": {"test": "data"}
    }
    response = client.post("/api/v1/events", json=event_data)
    assert response.status_code == 201
    event_id = response.json()["event_id"]

    # Verify normalization
    get_response = client.get(f"/api/v1/events/{event_id}")
    event = get_response.json()
    assert event["source"] == "uppercase"
    assert event["event_type"] == "test.event"
