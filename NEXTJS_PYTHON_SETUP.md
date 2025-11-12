# Next.js + Python (FastAPI) Integration Guide

This guide explains how to set up and use Next.js with a Python FastAPI backend, based on the architecture used in this project.

## Overview

This project uses a hybrid architecture:
- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Backend**: FastAPI (Python) for API endpoints
- **Integration**: Next.js rewrites/proxies API calls to the Python backend

## Architecture

### Development Mode
- Next.js runs on `http://localhost:3000`
- FastAPI runs on `http://localhost:8000`
- Next.js rewrites `/api/py/*` requests to `http://127.0.0.1:8000/api/py/*`

### Production Mode
- Next.js API routes act as a proxy layer
- Python backend can be deployed as Vercel serverless functions or separate service
- Next.js rewrites `/api/py/*` to the production Python API endpoint

## Project Structure

```
.
├── api/                    # Python FastAPI backend
│   └── index.py           # FastAPI application
├── app/                    # Next.js App Router
│   ├── api/               # Next.js API routes (proxy layer)
│   │   └── transcript/
│   │       └── route.ts   # Proxies to Python API
│   └── ...
├── next.config.ts         # Next.js configuration with rewrites
├── package.json           # Node.js dependencies & scripts
├── pyproject.toml         # Python dependencies (using uv)
└── vercel.json            # Vercel deployment config
```

## Setup Instructions

### 1. Install Dependencies

**Node.js dependencies:**
```bash
npm install
# or
yarn install
# or
bun install
```

**Python dependencies:**
```bash
# Using uv (recommended)
uv sync

# Or using pip
pip install -r requirements.txt
```

### 2. Configure Next.js Rewrites

In `next.config.ts`, set up rewrites to proxy API calls to your Python backend:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/py/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/py/:path*"  // Local FastAPI
            : "/api/",  // Production endpoint (adjust as needed)
      },
    ];
  },
};

export default nextConfig;
```

### 3. Set Up Python FastAPI Backend

Create your FastAPI application in `api/index.py`:

```python
from fastapi import FastAPI, HTTPException, Query

app = FastAPI()

@app.get("/api/py/hello")
def hello():
    return {"message": "Hello from FastAPI"}

@app.get("/api/py/yt")
async def get_transcript(video_id: str = Query(...)):
    # Your Python logic here
    return {"transcript": "..."}
```

### 4. Create Next.js API Route (Optional Proxy Layer)

Create a Next.js API route that proxies to your Python backend. This is useful for:
- Error handling and retries
- Response transformation
- Additional middleware

Example: `app/api/transcript/route.ts`

```typescript
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000"
      : "https://your-production-api.com";

  const response = await fetch(`${baseUrl}/api/py/yt?video_id=${videoId}`);
  const data = await response.json();
  
  return Response.json(data);
};
```

### 5. Development Scripts

Add scripts to `package.json` to run both services:

```json
{
  "scripts": {
    "fastapi-dev": "uv run -m uvicorn api.index:app --reload",
    "next-dev": "next dev --turbopack",
    "dev": "concurrently \"npm run next-dev\" \"npm run fastapi-dev\""
  }
}
```

**Dependencies needed:**
- `concurrently` - Run multiple commands simultaneously

```bash
npm install concurrently
```

### 6. Run Development Environment

Start both services:
```bash
npm run dev
```

This will:
- Start Next.js on `http://localhost:3000`
- Start FastAPI on `http://localhost:8000`
- Proxy `/api/py/*` requests from Next.js to FastAPI

## Usage Examples

### From Next.js Frontend

Call your Python API through the Next.js proxy:

```typescript
// Direct call (uses Next.js rewrite)
const response = await fetch('/api/py/yt?video_id=abc123');
const data = await response.json();

// Or through Next.js API route
const response = await fetch('/api/transcript?videoId=abc123');
const data = await response.json();
```

### From Python FastAPI

Your FastAPI endpoints are accessible at:
- Development: `http://localhost:8000/api/py/hello`
- Through Next.js proxy: `http://localhost:3000/api/py/hello`

## Deployment Options

### Option 1: Vercel Serverless Functions

Vercel supports Python serverless functions. Create `api/index.py` and Vercel will automatically deploy it.

**Requirements:**
- `api/index.py` must export a FastAPI app
- Vercel will detect Python and install dependencies from `requirements.txt` or `pyproject.toml`

**vercel.json:**
```json
{
  "functions": {
    "api/index.py": {
      "runtime": "python3.9"
    }
  }
}
```

### Option 2: Separate Python Service

Deploy FastAPI separately (e.g., Railway, Render, Fly.io) and update `next.config.ts`:

```typescript
destination: "https://your-python-api.com/api/py/:path*"
```

### Option 3: Next.js API Routes Only

Convert Python logic to Next.js API routes using Python runtime (if supported) or rewrite in TypeScript.

## Key Configuration Files

### `next.config.ts`
- Configures rewrites to proxy `/api/py/*` to Python backend
- Different destinations for dev vs production

### `package.json`
- Node.js dependencies
- Scripts to run both services concurrently

### `pyproject.toml` (or `requirements.txt`)
- Python dependencies
- FastAPI, uvicorn, and other Python packages

### `vercel.json`
- Vercel deployment configuration
- Can specify Python runtime settings

## Best Practices

1. **Environment Variables**: Use environment variables for API URLs
   ```typescript
   const baseUrl = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";
   ```

2. **Error Handling**: Add retry logic and error handling in Next.js API routes
   ```typescript
   const maxRetries = 3;
   for (let attempt = 1; attempt <= maxRetries; attempt++) {
     try {
       const response = await fetch(url);
       if (response.ok) return await response.json();
     } catch (error) {
       if (attempt === maxRetries) throw error;
       await new Promise(resolve => setTimeout(resolve, 1000));
     }
   }
   ```

3. **Type Safety**: Define TypeScript types for API responses
   ```typescript
   interface TranscriptResponse {
     transcript: Array<{ text: string; start: number; duration: number }>;
     chapters: Array<{ title: string; start_time: number; end_time: number }>;
   }
   ```

4. **CORS**: If deploying separately, configure CORS in FastAPI
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-nextjs-app.com"],
       allow_methods=["GET", "POST"],
   )
   ```

## Troubleshooting

### Python server not starting
- Check Python version: `python --version` (should match `pyproject.toml`)
- Install dependencies: `uv sync` or `pip install -r requirements.txt`
- Check port 8000 is available

### Rewrites not working
- Verify `next.config.ts` rewrites configuration
- Check Next.js is running in development mode
- Ensure FastAPI is running on the correct port

### CORS errors
- Add CORS middleware to FastAPI
- Or use Next.js API routes as proxy (avoids CORS)

### Production deployment issues
- Verify Python runtime is configured in Vercel
- Check environment variables are set
- Ensure `pyproject.toml` or `requirements.txt` exists

## Example: Complete Flow

1. **User clicks button** → Frontend calls `/api/transcript?videoId=abc123`
2. **Next.js API route** → `app/api/transcript/route.ts` receives request
3. **Proxy to Python** → Fetches from `http://127.0.0.1:8000/api/py/yt?video_id=abc123`
4. **FastAPI processes** → Extracts transcript, returns JSON
5. **Response transformed** → Next.js route transforms and returns to frontend
6. **Frontend updates** → React component receives data and updates UI

## Additional Resources

- [Next.js Rewrites Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vercel Python Runtime](https://vercel.com/docs/functions/runtimes/python)
- [Concurrently Package](https://www.npmjs.com/package/concurrently)

