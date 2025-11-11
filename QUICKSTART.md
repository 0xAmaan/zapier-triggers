# Quick Start Guide

Get the Zapier Triggers API running in 5 minutes!

## Prerequisites

- Python 3.11 or higher
- uv package manager ([install here](https://github.com/astral-sh/uv))

## Step 1: Install Dependencies

```bash
uv sync
```

## Step 2: Start the API Server

```bash
uv run uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Step 3: Test the API

Open a new terminal and try these commands:

### Health Check
```bash
curl http://localhost:8000/health
```

### Send an Event
```bash
curl -X POST http://localhost:8000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "source": "test",
    "event_type": "quickstart",
    "payload": {"message": "Hello Zapier!"}
  }'
```

### View the Inbox
```bash
curl http://localhost:8000/api/v1/inbox
```

## Step 4: View Interactive Docs

Open your browser to:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Step 5: Run Mock Event Sender

In a separate terminal, run the mock sender to see events streaming in:

```bash
python mock_sender.py
```

You'll see events from Stripe, Gmail, Slack, GitHub, and more!

## Next Steps

- Check out the full [README.md](README.md) for detailed documentation
- Explore the API endpoints in the interactive docs
- Run the test suite: `uv run pytest`
- Build your first Zapier workflow using these events!

## Common Commands

| Command | Description |
|---------|-------------|
| `uv run uvicorn app.main:app --reload` | Start dev server with hot reload |
| `python mock_sender.py` | Send mock events continuously |
| `uv run pytest` | Run all tests |
| `uv run pytest --cov=app` | Run tests with coverage |
| `curl http://localhost:8000/docs` | View API documentation |

## Troubleshooting

**Port already in use?**
```bash
# Use a different port
uv run uvicorn app.main:app --port 8001
```

**Database issues?**
```bash
# Reset the database
rm triggers.db
# Restart the server
```

**Need help?**
- Check the `/docs` endpoint for API reference
- Review the test files in `tests/` for examples
- Read the full README.md

---

Happy building! 🚀
