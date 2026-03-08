# Copilot Instructions - Todo por Bogotá

## Project Architecture

**Monorepo structure** with three city projects: `todoporbogota` (primary), `todoporcolombia`, `todopormedallo`.

### Stack

- **Frontend**: React 19 + Vite + React Router v7 (client-side routing)
- **Backend**: Express + TypeScript + MongoDB (Mongoose) + Google OAuth
- **Deployment**: Vercel serverless functions via `/api/index.ts` wrapper

### Critical Deployment Pattern

The frontend builds into `backend/todoporbogota/view/` directory, allowing a single deployment that serves both the static frontend and API. The backend Express app serves the built frontend from this directory. **Never** change this pattern without updating the build script and Vercel config.

## Development Workflows

### Frontend Development

```bash
cd frontend/todoporbogota
npm install
npm run dev  # Vite dev server on http://localhost:5173
```

### Backend Development

Build frontend first, then run backend:

```bash
sh .scripts/build-deploy.sh  # Builds frontend → backend/todoporbogota/view
cd backend/todoporbogota
npm install
npm run dev  # ts-node-dev on port 4000
```

### Deployment (Master Branch Only)

```bash
sh .scripts/build-deploy.sh
vercel  # Follow prompts for your account
```

## Code Patterns & Conventions

### Frontend Architecture

- **Data-driven pages**: All content lives in static JSON files at `frontend/todoporbogota/src/data/*.json`
- **Component structure**:
  - `pages/` - Route components (one per URL)
  - `components/` - Reusable components (Card, FilterBar, Navbar, etc.)
  - `layouts/` - Layout wrapper with `<Outlet>` for nested routes
- **Co-located styles**: Each component has its own `.css` file (e.g., `Card.jsx` + `Card.css`)
- **Filter pattern**: Use `useMemo` for filtered data (see [Iniciativas.jsx](frontend/todoporbogota/src/pages/Iniciativas/Iniciativas.jsx))

Example page structure:

```jsx
import { useState, useMemo } from "react";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import FilterBar from "../../components/FilterBar/FilterBar";
import Card from "../../components/Card/Card";
import data from "../../data/example.json";

export default function ExamplePage() {
  const [filter, setFilter] = useState("Todos");
  const filtered = useMemo(
    () => data.filter((item) => filter === "Todos" || item.category === filter),
    [filter],
  );

  return (
    <div className="example">
      <SectionHeader title="Title" subtitle="Description" />
      <FilterBar
        filters={[...new Set(data.map((d) => d.category))]}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
      <div className="example__grid">
        {filtered.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
```

### Backend Patterns

- **Serverless MongoDB**: Database connection uses global caching for Vercel ([db.ts](backend/todoporbogota/src/config/db.ts))
  - Always check `cached.conn` before creating new connections
  - Use `bufferCommands: false` for serverless compatibility
- **Google OAuth flow**: See [userRoutes.ts](backend/todoporbogota/src/routes/userRoutes.ts)
  - Verify Google token → Find/create user → Return JWT
- **API routes**: Prefixed with `/api/*` (e.g., `/api/users`) - see [app.ts](backend/todoporbogota/src/app.ts)
- **Static serving**: Express serves frontend from `../view` directory with SPA fallback

### Data Structure Pattern

JSON files follow this structure (see [iniciativas.json](frontend/todoporbogota/src/data/iniciativas.json)):

```json
{
  "id": 1,
  "title": "...",
  "description": "...",
  "category": "...",
  "locality": "...",
  "image": "/bogota-photos/...",
  "featured": true,
  "status": "Activa",
  "participants": 120,
  "startDate": "2024-03-15"
}
```

## Environment Variables

Backend requires:

- `MONGO_URI` - MongoDB connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default 4000)

## Key Files Reference

- [.scripts/build-deploy.sh](.scripts/build-deploy.sh) - Automated build script (builds frontend → moves to backend/view)
- [vercel.json](vercel.json) - Vercel deployment config (routes everything through api/index.ts)
- [api/index.ts](api/index.ts) - Serverless function wrapper (imports backend app)
- [frontend/todoporbogota/src/App.jsx](frontend/todoporbogota/src/App.jsx) - React Router setup
- [backend/todoporbogota/src/app.ts](backend/todoporbogota/src/app.ts) - Express app configuration

## Future Plans (from notes/)

- Require signed commits
- Protect master branch (require PR approvals)
- Add Pablo as admin
