# Todo por Bogotá - Monorepo

Repositorio principal con frontend y backend de Todo por Bogotá.

## Estructura

- `frontend/todoporbogota`: React + Vite (UI, rutas, login popup, perfil)
- `backend/todoporbogota`: Express + TypeScript + MongoDB + Google OAuth + JWT
- `api/index.ts`: wrapper serverless para Vercel
- `.scripts/build-deploy.sh`: build frontend y mover a `backend/todoporbogota/view`

## Desarrollo local

### 1) Frontend

```bash
cd frontend/todoporbogota
npm install
npm run dev
```

URL: `http://localhost:5173`

### 2) Backend

```bash
cd backend/todoporbogota
npm install
npm run dev
```

URL API: `http://localhost:5000`

## Variables de entorno

### Frontend (`frontend/todoporbogota/.env`)

```env
VITE_GOOGLE_CLIENT_ID=tu_cliente_id_de_google.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

### Backend (`backend/todoporbogota/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/todoporbogota
GOOGLE_CLIENT_ID=tu_cliente_id_de_google.apps.googleusercontent.com
JWT_SECRET=una_clave_larga_y_segura
```

## Autenticación actual

- Login social por Google desde el navbar.
- Endpoint login: `POST /api/users/google-login`.
- Endpoint sesión actual: `GET /api/users/me` con `Authorization: Bearer <token>`.
- Menú de perfil en avatar con acciones:
  - Ver mi perfil (`/perfil`)
  - Cerrar sesión

## Build y deploy

Para empaquetar frontend dentro del backend:

```bash
sh .scripts/build-deploy.sh
```

En Windows, si `sh` falla en PowerShell, ejecutar con Git Bash:

```powershell
& "C:\Program Files\Git\bin\bash.exe" .scripts/build-deploy.sh
```

Deploy a Vercel:

```bash
vercel
```

## Nota importante

Compilar en modo deploy prepara artefactos localmente, pero no despliega hasta ejecutar `vercel`.
