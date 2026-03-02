# Todo por Bogotá Backend API

Backend principal de autenticación y datos para la app Todo por Bogotá.
Stack: Express + TypeScript + MongoDB (Mongoose) + Google OAuth + JWT.

## Requisitos

- Node.js 18+
- MongoDB (Atlas o local)
- OAuth Client ID de Google (Web)

## Variables de entorno

Crea `backend/todoporbogota/.env` con:

```env
PORT=5000
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/todoporbogota
GOOGLE_CLIENT_ID=tu_cliente_id_de_google.apps.googleusercontent.com
JWT_SECRET=una_clave_larga_y_segura
```

## Ejecutar en local

```bash
cd backend/todoporbogota
npm install
npm run dev
```

Servidor por defecto: `http://localhost:5000`

## Endpoints de autenticación

### `POST /api/users/google-login`

Valida el token de Google, registra usuario si no existe y devuelve JWT + usuario.

Body:

```json
{
  "idToken": "token_de_google"
}
```

Respuesta 200:

```json
{
  "token": "jwt_firmado_por_backend",
  "user": {
    "_id": "...",
    "name": "Nombre",
    "email": "correo@gmail.com",
    "avatar": "https://...",
    "role": "citizen",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### `GET /api/users/me`

Retorna el usuario autenticado a partir del JWT.

Header requerido:

```http
Authorization: Bearer <token>
```

Respuesta 200:

```json
{
  "user": {
    "_id": "...",
    "name": "Nombre",
    "email": "correo@gmail.com",
    "avatar": "https://...",
    "role": "citizen",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Scripts

- `npm run dev`: modo desarrollo con recarga
- `npm run build`: compila TypeScript a `dist`
- `npm start`: ejecuta build compilado

## Notas

- Este backend también sirve el frontend compilado desde `backend/todoporbogota/view` en flujo de deploy.
- Si usas frontend en dev (`localhost:5173`), configura `VITE_API_URL=http://localhost:5000` en el frontend.
