from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import engine
from app.routers import events

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Zapier Triggers API",
    description="""
    Real-time event ingestion system for Zapier workflows.

    ## Features

    * **Ingest Events**: Send events from any system via POST /api/v1/events
    * **Retrieve Events**: Get pending events from the inbox via GET /api/v1/inbox
    * **Acknowledge Events**: Mark events as processed via DELETE /api/v1/events/{id}

    ## Event Flow

    1. External systems POST events to `/api/v1/events`
    2. Events are stored with status "pending"
    3. Zapier workflows retrieve events from `/api/v1/inbox`
    4. After processing, events are acknowledged via DELETE
    """,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(events.router)


@app.get("/", tags=["health"])
def root():
    """Root endpoint - API health check"""
    return {
        "message": "Zapier Triggers API",
        "version": "0.1.0",
        "status": "operational",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health", tags=["health"])
def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "service": "zapier-triggers-api"}
