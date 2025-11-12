# Docker Setup for AWS Deployment

## What Was Changed

### 1. Added PostgreSQL Support
- **File**: `app/database.py`
- **What it does**: Automatically detects if you're using SQLite or PostgreSQL based on the `DATABASE_URL` environment variable
- **Benefit**: Your code works locally with SQLite AND in production with PostgreSQL without any changes

### 2. Added PostgreSQL Driver
- **File**: `pyproject.toml`
- **What changed**: Added `psycopg2-binary>=2.9.9` dependency
- **What it does**: Lets Python talk to PostgreSQL databases

### 3. Created Dockerfile
- **File**: `Dockerfile`
- **What it does**: Packages your FastAPI app into a Docker container
- **How it works**:
  - Uses Python 3.11 (slim version to keep it small)
  - Installs PostgreSQL libraries
  - Installs `uv` package manager
  - Installs all your dependencies
  - Copies your code
  - Exposes port 8000
  - Runs your FastAPI app with `uvicorn`

### 4. Created Docker Compose File
- **File**: `docker-compose.yml`
- **What it does**: Lets you run PostgreSQL + FastAPI together with one command
- **Services**:
  - `postgres`: PostgreSQL 16 database
  - `backend`: Your FastAPI app
- **Features**:
  - Auto-creates database `zapier_triggers`
  - Auto-connects FastAPI to Postgres
  - Health checks ensure database is ready before starting backend
  - Hot reload enabled (code changes auto-restart)

### 5. Created Environment Template
- **File**: `.env.example`
- **What it does**: Shows what environment variables you need
- **How to use**: Copy to `.env` and modify as needed

## Testing Locally

### Prerequisites
- Docker Desktop installed and running
- Your backend code

### Step 1: Start Docker Desktop
Make sure Docker Desktop is running (you'll see the Docker icon in your menu bar)

### Step 2: Install Dependencies with uv
```bash
cd backend
uv sync
```

### Step 3: Start Everything with Docker Compose
```bash
docker compose up -d --build
```

This command:
- Builds your FastAPI Docker image
- Downloads PostgreSQL image
- Starts both containers
- Connects them together

### Step 4: Check Logs
```bash
# See all logs
docker compose logs -f

# See just backend logs
docker compose logs -f backend

# See just database logs
docker compose logs -f postgres
```

### Step 5: Test Your API
```bash
# Health check
curl http://localhost:8000/health

# Create an event
curl -X POST http://localhost:8000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "source": "stripe",
    "event_type": "payment.succeeded",
    "payload": {"amount": 100}
  }'

# Get inbox
curl http://localhost:8000/api/v1/inbox
```

### Step 6: Stop Everything
```bash
docker compose down
```

To also delete the database data:
```bash
docker compose down -v
```

## How Database Switching Works

Your `database.py` now automatically detects which database to use:

```python
# If DATABASE_URL starts with "sqlite://" → Uses SQLite
# If DATABASE_URL starts with "postgresql://" → Uses PostgreSQL
```

### Local Development (Without Docker)
```bash
# .env file
DATABASE_URL=sqlite:///./triggers.db
```
Your app uses SQLite as before - no changes needed!

### Local Development (With Docker)
```bash
# docker-compose.yml sets this automatically
DATABASE_URL=postgresql://zapier_user:zapier_password@postgres:5432/zapier_triggers
```
Your app connects to the PostgreSQL container

### AWS Production (Coming Next)
```bash
# AWS will provide something like:
DATABASE_URL=postgresql://user:pass@your-rds-instance.us-east-1.rds.amazonaws.com:5432/zapier_triggers
```
Your app connects to AWS RDS PostgreSQL

## Next Steps: AWS Deployment

Now that your backend is containerized and works with PostgreSQL, we can deploy to AWS:

1. **AWS ECS (Elastic Container Service)**
   - Runs your Docker container in the cloud
   - Auto-scaling, load balancing, health checks

2. **AWS RDS (Relational Database Service)**
   - Managed PostgreSQL database
   - Automatic backups, scaling, security

3. **AWS Amplify (Frontend)**
   - Hosts your Next.js app
   - CI/CD from GitHub
   - Auto-deploys on push

4. **Environment Variables**
   - Store `DATABASE_URL` and other secrets in AWS Secrets Manager
   - ECS injects them into your container at runtime

## Troubleshooting

### "Cannot connect to Docker daemon"
→ Start Docker Desktop

### "Port 5432 already in use"
→ You already have PostgreSQL running locally
→ Either stop it, or change the port in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use 5433 instead
```

### "uv: command not found"
→ Install uv: `pip install uv`

### Container keeps restarting
```bash
docker compose logs backend
```
Check the logs for errors

### Want to reset the database?
```bash
docker compose down -v  # Deletes all data
docker compose up -d    # Start fresh
```
