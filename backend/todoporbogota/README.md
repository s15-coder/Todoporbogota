# TodoPorBogota API - Backend

Servidor central para la gestión de usuarios y autenticación de la plataforma TodoPorBogota. Construido con Node.js, TypeScript y MongoDB.

## 1. Requisitos
* Node.js v18 o superior.
* MongoDB Atlas (Cluster configurado).
* Google Cloud Console (ID de Cliente OAuth 2.0).

## 2. Instalación y Configuración

1. Clonar el proyecto e instalar dependencias:
   npm install

2. Configurar variables de entorno:
   Crea un archivo llamado .env en la raíz del proyecto:
   
   PORT=4000
   MONGO_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/todoporbogota
   GOOGLE_CLIENT_ID=tu_cliente_id_de_google.apps.googleusercontent.com
   JWT_SECRET=una_clave_secreta_para_firmar_tokens

3. Iniciar el servidor:
   npm run dev

## 3. Endpoints

POST /api/users/google-login
Recibe un idToken de Google, valida el usuario y retorna un JWT.

Cuerpo (JSON):
{
  "idToken": "token_proporcionado_por_la_app_movil"
}

Respuesta Exitosa (200):
{
  "token": "jwt_del_backend",
  "user": {
    "name": "Nombre",
    "email": "correo@gmail.com"
  }
}

## 4. Estructura de Carpetas
* src/config: Configuración de DB.
* src/controllers: Funciones de manejo de rutas.
* src/models: Definición de esquemas (Mongoose).
* src/routes: Definición de rutas Express.

## 5. Solución de Problemas
* Error de Autenticación: Verifica que el usuario de base de datos tenga permisos de lectura y escritura en Atlas.
* Error de Conexión: Asegúrate de que la IP 0.0.0.0/0 esté permitida en Network Access de Atlas.
