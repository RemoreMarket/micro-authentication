# micro-authentication
📌 Rol
Gestiona toda la lógica de identidad, autenticación y autorización, incluyendo:

Registro

Login

Refresh tokens

Login social (OAuth con Google, Facebook, Apple)

Seguridad con JWT, Redis y Guards

Envío de eventos a otros servicios (como user-service)

📦 Modelo de Datos del auth-service
¡Importante!: Este microservicio no guarda datos del usuario final como nombre o foto, solo se encarga del acceso.

Entidad implícita (en memoria o externa): Usuario Auth
{
  id: UUID,            // UUID del usuario
  email: string,       // Clave principal para autenticación
  password: string,    // Hash de contraseña (solo si no es OAuth)
}
En realidad, esta entidad no se guarda aquí. Se valida con JWT y se sincroniza con user-service.

Refresh Tokens en Redis
Estructura almacenada:

Key: refresh:<user_id>
Value: <refresh_token>
TTL: 7 días
🧠 APIs y Operaciones (GraphQL)
Mutations:
register(email, password, fullName): AuthPayload

login(email, password): AuthPayload

refreshToken(token): AuthPayload

logout(): Boolean

loginWithGoogle(), etc.

Queries:
me: User (verifica token actual y pide datos a user-service)

✅ ¿Por qué usar GraphQL aquí?
Porque los clientes móviles necesitan control preciso sobre los datos que consultan.

Permite unificar login, me, refreshToken en un mismo endpoint.

Apollo Federation permite que este servicio sea parte de un super esquema.

⚙️ Tecnologías Clave
NestJS + GraphQL: arquitectura escalable y declarativa

Passport.js: integración con OAuth

Redis: para refresh tokens y sesiones temporales

Apollo Federation: para exponer el auth a través del gateway unificado

Guards: para proteger rutas usando JWT
