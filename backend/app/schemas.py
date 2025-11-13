from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, field_validator


class EventCreate(BaseModel):
    """Schema for creating a new event"""

    source: str
    event_type: str
    payload: Dict[str, Any]

    @field_validator("source")
    @classmethod
    def source_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("source cannot be empty")
        return v.lower()

    @field_validator("event_type")
    @classmethod
    def event_type_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("event_type cannot be empty")
        return v.lower()


class EventResponse(BaseModel):
    """Schema for event creation response"""

    event_id: str
    status: str
    created_at: datetime
    message: str


class EventDetail(BaseModel):
    """Schema for detailed event information"""

    model_config = ConfigDict(from_attributes=True)

    event_id: str
    source: str
    event_type: str
    payload: Dict[str, Any]
    status: str
    created_at: datetime
    acknowledged_at: Optional[datetime] = None


class InboxResponse(BaseModel):
    """Schema for inbox response with list of events"""

    events: list[EventDetail]
    total: int


class AcknowledgeResponse(BaseModel):
    """Schema for event acknowledgment response"""

    event_id: str
    status: str
    acknowledged_at: datetime
