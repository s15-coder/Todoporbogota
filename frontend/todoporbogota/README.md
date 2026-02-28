# Todo por Bogotá Frontend

Frontend principal de la plataforma Todo por Bogotá.
Stack: React 19 + Vite + React Router.

## Ejecutar en local

```bash
cd frontend/todoporbogota
npm install
npm run dev
```

App en desarrollo: `http://localhost:5173`

## Variables de entorno

Crea `frontend/todoporbogota/.env` con:

```env
VITE_GOOGLE_CLIENT_ID=tu_cliente_id_de_google.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

Notas:

- `VITE_GOOGLE_CLIENT_ID` debe coincidir con el `GOOGLE_CLIENT_ID` del backend.
- En Google Cloud Console agrega `http://localhost:5173` como Authorized JavaScript Origin.

## Flujo de autenticación actual

- Botón en navbar: **Regístrate o Ingresa**.
- Abre popup con proveedores (Google activo, Facebook próximamente).
- Login con Google llama `POST /api/users/google-login`.
- Sesión persistida en `localStorage` (`authToken`, `authUser`).
- Avatar en navbar abre menú con:
	- **Ver mi perfil**
	- **Cerrar sesión**

## Ruta de perfil

- Ruta frontend: `/perfil`
- Página consume `GET /api/users/me` usando `Authorization: Bearer <token>`.
- Muestra datos del usuario autenticado (`name`, `email`, `avatar`, `role`, `createdAt`).

## Scripts

- `npm run dev`: desarrollo con HMR
- `npm run build`: build de producción
- `npm run preview`: previsualizar build local

## Build para flujo de deploy del monorepo

Este frontend se compila y se mueve al backend (`backend/todoporbogota/view`) mediante el script raíz:

```bash
sh .scripts/build-deploy.sh
```

En Windows, si `sh` falla en PowerShell, ejecuta con Git Bash:

```powershell
& "C:\Program Files\Git\bin\bash.exe" .scripts/build-deploy.sh
```
