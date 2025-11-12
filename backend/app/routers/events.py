from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from datetime import datetime

router = APIRouter(prefix="/api/v1", tags=["events"])


@router.post("/events", response_model=schemas.EventResponse, status_code=201)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    """
    Ingest a new event into the system.

    - **source**: The source system sending the event (e.g., "stripe", "gmail")
    - **event_type**: The type of event (e.g., "payment.succeeded", "email.received")
    - **payload**: JSON payload containing event data
    """
    db_event = models.Event(
        source=event.source,
        event_type=event.event_type,
        payload=event.payload
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return schemas.EventResponse(
        event_id=db_event.id,
        status="received",
        created_at=db_event.created_at,
        message="Event successfully ingested"
    )


@router.get("/inbox", response_model=schemas.InboxResponse)
def get_inbox(
    status: str = Query(default="pending", description="Filter events by status"),
    limit: int = Query(default=50, ge=1, le=1000, description="Maximum number of events to return"),
    db: Session = Depends(get_db)
):
    """
    Retrieve events from the inbox.

    - **status**: Filter by event status (default: "pending")
    - **limit**: Maximum number of events to return (default: 50, max: 1000)
    """
    events = db.query(models.Event)\
        .filter(models.Event.status == status)\
        .order_by(models.Event.created_at.desc())\
        .limit(limit)\
        .all()

    event_details = []
    for e in events:
        event_details.append(schemas.EventDetail(
            event_id=e.id,
            source=e.source,
            event_type=e.event_type,
            payload=e.payload,
            status=e.status,
            created_at=e.created_at,
            acknowledged_at=e.acknowledged_at
        ))

    return schemas.InboxResponse(
        events=event_details,
        total=len(event_details)
    )


@router.delete("/events/{event_id}", response_model=schemas.AcknowledgeResponse)
def acknowledge_event(event_id: str, db: Session = Depends(get_db)):
    """
    Acknowledge/delete an event from the inbox.

    - **event_id**: The unique identifier of the event to acknowledge
    """
    event = db.query(models.Event).filter(models.Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.status = "acknowledged"
    event.acknowledged_at = datetime.utcnow()
    db.commit()

    return schemas.AcknowledgeResponse(
        event_id=event.id,
        status="acknowledged",
        acknowledged_at=event.acknowledged_at
    )


@router.get("/events/{event_id}", response_model=schemas.EventDetail)
def get_event(event_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a specific event by its ID.

    - **event_id**: The unique identifier of the event
    """
    event = db.query(models.Event).filter(models.Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return schemas.EventDetail(
        event_id=event.id,
        source=event.source,
        event_type=event.event_type,
        payload=event.payload,
        status=event.status,
        created_at=event.created_at,
        acknowledged_at=event.acknowledged_at
    )
