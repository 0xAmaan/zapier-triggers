import uuid

from sqlalchemy import JSON, Column, DateTime, String
from sqlalchemy.sql import func

from app.database import Base


class Event(Base):
    """Event model for storing incoming events"""

    __tablename__ = "events"

    id = Column(
        String, primary_key=True, default=lambda: f"evt_{uuid.uuid4().hex[:12]}"
    )
    source = Column(String, index=True, nullable=False)
    event_type = Column(String, index=True, nullable=False)
    payload = Column(JSON, nullable=False)
    status = Column(String, default="pending", index=True)
    created_at = Column(DateTime, server_default=func.now())
    acknowledged_at = Column(DateTime, nullable=True)
