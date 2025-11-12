# Frontend/Backend Architecture Plan

## Proposed Directory Structure

```
zapier-triggers/
├── backend/                    # Python FastAPI backend
│   ├── app/                   # Application code
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── database.py       # SQLAlchemy database setup
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Pydantic schemas
│   │   └── routers/          # API route handlers
│   │       ├── __init__.py
│   │       └── events.py
│   ├── tests/                # Backend tests
│   │   ├── __init__.py
│   │   └── test_events.py
│   ├── pyproject.toml        # Python dependencies (uv)
│   ├── uv.lock              # Lock file
│   └── README.md            # Backend-specific docs
│
├── frontend/                  # Frontend application
│   ├── src/                  # Source code (or app/ for Next.js)
│   │   ├── components/       # React/UI components
│   │   ├── pages/ or app/    # Pages/routes
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client functions
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   ├── package.json          # Node.js dependencies
│   ├── tsconfig.json         # TypeScript config (if using TS)
│   ├── next.config.ts        # Next.js config (if using Next.js)
│   └── README.md            # Frontend-specific docs
│
├── scripts/                   # Shared utility scripts
│   └── mock_sender.py        # Mock event sender
│
├── shared/                    # Shared code/types (optional)
│   └── types/                # Shared TypeScript types
│
├── .gitignore                # Updated for Python + Node.js
├── README.md                 # Main project README
└── docker-compose.yml        # Optional: for local dev (if needed)
```

## Frontend Framework Options

### Option 1: Next.js (Recommended if you want SSR/SSG)
**Pros:**
- Server-side rendering
- Built-in API routes (can proxy to Python backend)
- Great developer experience
- Easy deployment on Vercel
- Already have setup docs for it

**Cons:**
- More opinionated structure
- Slightly more complex for simple SPAs

**Setup:**
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app
```

### Option 2: React + Vite (Recommended for SPAs)
**Pros:**
- Fast development experience
- Simple, flexible structure
- Great for dashboards/admin panels
- Easy to customize

**Cons:**
- No SSR out of the box
- Need to set up routing separately

**Setup:**
```bash
cd frontend
npm create vite@latest . -- --template react-ts
```

### Option 3: Vue 3 + Vite
**Pros:**
- Simple and intuitive
- Great performance
- Good TypeScript support

**Cons:**
- Less common in enterprise (though growing)

## Development Workflow

### Option A: Run Separately (Recommended)
```bash
# Terminal 1: Backend
cd backend
uv run uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Option B: Run Together (Using concurrently)
```json
// Root package.json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && uv run uvicorn app.main:app --reload",
    "dev:frontend": "cd frontend && npm run dev"
  }
}
```

## API Communication

### Development
- Frontend: `http://localhost:3000` (or 5173 for Vite)
- Backend: `http://localhost:8000`
- Frontend calls backend directly (CORS enabled)

### Production
- Option 1: Next.js rewrites (proxy `/api/*` to Python backend)
- Option 2: Separate deployments (frontend calls backend URL)
- Option 3: Next.js API routes proxy to Python backend

## Shared Types Strategy

### Option 1: Manual Sync
- Keep Python schemas in `backend/app/schemas.py`
- Manually create matching TypeScript types in `frontend/src/types/api.ts`

### Option 2: Code Generation (Advanced)
- Use tools like `datamodel-code-generator` to generate TypeScript from Pydantic models
- Or use `openapi-typescript` to generate types from OpenAPI spec

### Option 3: OpenAPI Types (Recommended)
```bash
# Generate TypeScript types from FastAPI's OpenAPI spec
npx openapi-typescript http://localhost:8000/openapi.json -o frontend/src/types/api.ts
```

## Configuration Files

### Root Level
- `.gitignore` - Updated for both Python and Node.js
- `README.md` - Main project overview
- `docker-compose.yml` - Optional, for local dev environment

### Backend
- `pyproject.toml` - Python dependencies
- `.env` - Backend environment variables
- `alembic.ini` - Database migrations (if using Alembic)

### Frontend
- `package.json` - Node.js dependencies
- `.env.local` - Frontend environment variables
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` or `vite.config.ts` - Build tool config

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./triggers.db
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
# or
VITE_API_URL=http://localhost:8000
```

## Deployment Considerations

### Option 1: Separate Deployments
- Backend: Railway, Render, Fly.io, or AWS
- Frontend: Vercel, Netlify, or Cloudflare Pages
- Frontend calls backend via environment variable

### Option 2: Monolithic (Next.js API Routes)
- Deploy everything to Vercel
- Convert Python logic to Next.js API routes
- Less ideal if you want to keep Python backend

### Option 3: Docker Compose
- Both services in containers
- Deploy together on a VPS or container platform

## Migration Steps

1. **Create directories**
   ```bash
   mkdir -p backend frontend scripts shared/types
   ```

2. **Move backend code**
   - Move `app/` → `backend/app/`
   - Move `tests/` → `backend/tests/`
   - Move `pyproject.toml` → `backend/pyproject.toml`
   - Move `uv.lock` → `backend/uv.lock`

3. **Move shared scripts**
   - Move `mock_sender.py` → `scripts/mock_sender.py`

4. **Initialize frontend**
   - Choose framework (Next.js or React+Vite)
   - Set up project structure
   - Configure API client

5. **Update imports**
   - Update Python imports if needed
   - Update script paths

6. **Update documentation**
   - Update README.md
   - Create backend/README.md
   - Create frontend/README.md

## Recommended Next Steps

1. **Choose frontend framework** (Next.js vs React+Vite)
2. **Decide on shared types strategy** (manual vs generated)
3. **Plan API client structure** (axios, fetch, or tRPC)
4. **Set up development scripts** (concurrently or separate)
5. **Configure CORS** properly for frontend origin

## Questions to Consider

1. **What will the frontend do?**
   - Dashboard to view events?
   - Admin panel to manage events?
   - Public-facing API explorer?
   - All of the above?

2. **Do you need SSR?**
   - If yes → Next.js
   - If no → React+Vite is simpler

3. **Team structure?**
   - Full-stack developers → Monorepo works great
   - Separate teams → Consider separate repos

4. **Deployment preferences?**
   - Vercel → Next.js fits perfectly
   - Other platforms → More flexible

