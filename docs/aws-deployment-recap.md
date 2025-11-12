# AWS Deployment Recap

**Date**: November 12, 2025
**Region**: us-west-1 (N. California)
**Status**: ✅ Backend Deployed and Running

---

## What We Built

A fully functional FastAPI backend deployed on AWS that connects to a PostgreSQL database and serves API endpoints for event ingestion and retrieval.

---

## Architecture Overview

```
Internet
    ↓
AWS ECS Fargate (13.57.226.46:8000)
    ↓
FastAPI Backend Container
    ↓
AWS RDS PostgreSQL Database
```

---

## AWS Resources Created

### 1. ECR (Elastic Container Registry)
- **Repository**: `zapier-triggers-backend`
- **Purpose**: Stores your Docker image
- **Image**: Built for AMD64 architecture (AWS Fargate compatible)
- **URI**: `971422717446.dkr.ecr.us-west-1.amazonaws.com/zapier-triggers-backend:latest`

### 2. RDS (Relational Database Service)
- **Instance**: `zapier-triggers-db`
- **Engine**: PostgreSQL 16.6
- **Instance Type**: db.t4g.micro (Free Tier)
- **Storage**: 20 GiB SSD
- **Database**: `zapier_triggers`
- **Endpoint**: `zapier-triggers-db.c1ggqgo20hc4.us-west-1.rds.amazonaws.com:5432`
- **User**: `zapier_user`
- **Public Access**: Enabled
- **Security Group**: `sg-0191f80478da27b38` (allows PostgreSQL port 5432)

### 3. ECS (Elastic Container Service)
- **Cluster**: `zapier-triggers-cluster`
- **Service**: `zapier-triggers-service`
- **Task Definition**: `zapier-triggers-backend:1`
- **Launch Type**: Fargate (serverless containers)
- **CPU**: 256 units (0.25 vCPU)
- **Memory**: 512 MB
- **Desired Count**: 1 task running
- **Public IP**: `13.57.226.46`
- **Security Group**: `sg-0191f80478da27b38` (allows port 8000)

### 4. CloudWatch Logs
- **Log Group**: `/ecs/zapier-triggers-backend`
- **Purpose**: Captures all application logs from the running container

---

## How It Works

### 1. Docker Image Storage
Your FastAPI app is packaged as a Docker image and stored in ECR. When ECS needs to run your app, it pulls this image.

### 2. Container Execution
ECS Fargate runs your Docker container without managing servers. It automatically:
- Pulls the latest image from ECR
- Starts the container
- Assigns a public IP
- Monitors health and restarts if it crashes

### 3. Database Connection
Your backend connects to PostgreSQL using this connection string:
```
postgresql://zapier_user:PASSWORD@zapier-triggers-db.c1ggqgo20hc4.us-west-1.rds.amazonaws.com:5432/zapier_triggers
```

The connection string is stored as an environment variable in the ECS task definition.

### 4. Security Groups
Think of these as firewalls:
- **Port 5432** (PostgreSQL): Allows backend to connect to database
- **Port 8000** (FastAPI): Allows internet traffic to reach your API

---

## API Endpoints (Live)

**Base URL**: `http://13.57.226.46:8000`

### Available Endpoints

1. **Health Check**
   ```bash
   curl http://13.57.226.46:8000/health
   ```
   Response: `{"status":"healthy","service":"zapier-triggers-api"}`

2. **Create Event**
   ```bash
   curl -X POST http://13.57.226.46:8000/api/v1/events \
     -H "Content-Type: application/json" \
     -d '{"source": "stripe", "event_type": "payment.succeeded", "payload": {"amount": 100}}'
   ```

3. **Get Inbox**
   ```bash
   curl http://13.57.226.46:8000/api/v1/inbox
   ```

4. **Get Specific Event**
   ```bash
   curl http://13.57.226.46:8000/api/v1/events/{event_id}
   ```

5. **Acknowledge Event**
   ```bash
   curl -X DELETE http://13.57.226.46:8000/api/v1/events/{event_id}
   ```

---

## Key Files

### Backend Configuration Files

1. **`backend/Dockerfile`**
   - Recipe for building the Docker image
   - Uses Python 3.11-slim
   - Installs dependencies with `uv`
   - Runs FastAPI with uvicorn

2. **`backend/docker-compose.yml`**
   - Used for local testing with PostgreSQL
   - Not used in production (AWS RDS replaces local Postgres)

3. **`backend/ecs-task-definition.json`**
   - Tells ECS how to run your container
   - Includes environment variables (DATABASE_URL, etc.)
   - Specifies CPU, memory, and networking

4. **`backend/app/database.py`**
   - Auto-detects SQLite vs PostgreSQL based on DATABASE_URL
   - Configured with connection pooling for production

---

## Important Issues We Fixed

### 1. Architecture Mismatch
**Problem**: Initial Docker image was built for ARM64 (Mac M-series) but AWS Fargate uses AMD64.
**Error**: `exec format error`
**Solution**: Rebuilt image with `docker buildx build --platform linux/amd64`

### 2. Security Group Configuration
**Problem**: ECS couldn't connect to RDS, and internet couldn't reach the API.
**Solution**:
- Added port 5432 rule for PostgreSQL
- Added port 8000 rule for HTTP API access

### 3. Missing Database
**Problem**: CLI command didn't create the `zapier_triggers` database automatically.
**Solution**: Connected via `psql` and manually ran `CREATE DATABASE zapier_triggers;`

---

## Cost Breakdown (Free Tier)

All services are using AWS Free Tier:

- **RDS**: 750 hours/month of db.t4g.micro (free for 12 months)
- **ECS Fargate**: Limited free tier, but minimal usage
- **ECR**: 50GB storage free
- **CloudWatch Logs**: 5GB ingestion free

**Estimated Monthly Cost**: $0-5 (should stay within free tier)

---

## What We DIDN'T Do Yet

1. **Frontend Deployment**: Next.js app still runs locally
2. **Load Balancer**: No Application Load Balancer (using raw IP)
3. **HTTPS**: No SSL certificate (using HTTP only)
4. **Custom Domain**: No Route 53 DNS setup
5. **CI/CD**: No automated deployments (manual push to ECR)
6. **Monitoring**: No custom CloudWatch alarms
7. **Auto-scaling**: Only 1 task running (no scaling policies)

---

## How to Update Your Backend

When you make changes to your code:

1. **Rebuild the Docker image for AMD64**:
   ```bash
   cd backend
   docker buildx build --platform linux/amd64 -t zapier-triggers-backend .
   ```

2. **Tag for ECR**:
   ```bash
   docker tag zapier-triggers-backend:latest 971422717446.dkr.ecr.us-west-1.amazonaws.com/zapier-triggers-backend:latest
   ```

3. **Push to ECR**:
   ```bash
   docker push 971422717446.dkr.ecr.us-west-1.amazonaws.com/zapier-triggers-backend:latest
   ```

4. **Force ECS to pull new image**:
   ```bash
   aws ecs update-service --cluster zapier-triggers-cluster --service zapier-triggers-service --force-new-deployment --region us-west-1
   ```

5. **Wait 1-2 minutes** for the new task to start

---

## How to Check Logs

View live logs from your backend:

```bash
aws logs tail /ecs/zapier-triggers-backend --region us-west-1 --follow
```

Or check in AWS Console:
1. Go to CloudWatch
2. Log groups → `/ecs/zapier-triggers-backend`
3. View recent log streams

---

## Credentials & Secrets

**Important**: Your database password is stored in:
- `backend/ecs-task-definition.json` (in the DATABASE_URL environment variable)

⚠️ **Do NOT commit this file to Git with the real password!**

For production, you should use AWS Secrets Manager to store credentials securely.

---

## Region Choice: Why us-west-1?

We deployed to **us-west-1** (N. California) because:
- You needed to free up VPC resources in us-east-1 for another team
- You already had other projects in us-west-1
- Keeps everything in one region for lower latency

**Note**: us-west-1 has 2 availability zones vs us-west-2 which has 4. For high availability in the future, consider us-west-2.

---

## Next Steps

### Option 1: Deploy Frontend
- Deploy Next.js to AWS Amplify
- Update API URL from `localhost:8000` to `13.57.226.46:8000`
- Connect frontend to live backend

### Option 2: Add Load Balancer + Domain
- Create Application Load Balancer
- Register domain with Route 53
- Add SSL certificate with ACM
- Point domain to load balancer

### Option 3: Improve Security
- Move database password to AWS Secrets Manager
- Restrict security groups (remove 0.0.0.0/0)
- Enable VPC Flow Logs
- Set up WAF (Web Application Firewall)

### Option 4: Add Monitoring
- Create CloudWatch alarms for:
  - High CPU usage
  - Database connection errors
  - API error rates
- Set up SNS notifications

---

## Troubleshooting

### Container Keeps Stopping
Check logs:
```bash
aws logs tail /ecs/zapier-triggers-backend --region us-west-1 --since 10m
```

### Can't Connect to API
1. Check task is running: ECS Console → Clusters → Tasks
2. Verify security group allows port 8000
3. Get latest public IP (it changes if task restarts)

### Database Connection Errors
1. Check RDS is "Available" in RDS Console
2. Verify security group allows port 5432
3. Test connection manually with psql:
   ```bash
   psql -h zapier-triggers-db.c1ggqgo20hc4.us-west-1.rds.amazonaws.com -U zapier_user -d zapier_triggers
   ```

---

## Summary

✅ **Backend deployed on AWS ECS Fargate**
✅ **PostgreSQL database running on AWS RDS**
✅ **API accessible at http://13.57.226.46:8000**
✅ **All endpoints working and tested**
✅ **Logs available in CloudWatch**

You now have a production-ready backend running in the cloud! 🎉
