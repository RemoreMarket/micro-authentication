
🔐 Micro-Authentication Service
Gestiona toda la lógica de identidad, autenticación y autorización del sistema.

📌 Rol del Servicio
Este servicio maneja únicamente acceso e identidad. No almacena información personal del usuario como nombre o fotos, solo se enfoca en seguridad y autenticación.

Funciones principales:

✅ Registro y Login

🔄 Refresh tokens

🌐 OAuth Login Social (Google, Facebook, Apple)

🛡️ Seguridad robusta con JWT, Redis y Guards

📤 Eventos hacia otros microservicios (user-service)

📦 Modelo de Datos (Simplificado)
⚠️ Importante: Este servicio no guarda información personal (nombre, foto, bio).
Solamente valida la identidad y emite eventos.


Refresh Tokens (Redis):

Key	Value	TTL
refresh:<user_id>	<refresh_token>	7 días
🚀 APIs y Operaciones GraphQL
🧩 Mutations
register(email, password, fullName): AuthPayload

login(email, password): AuthPayload

refreshToken(token): AuthPayload

logout(): Boolean

loginWithGoogle(), loginWithFacebook(), loginWithApple()

🔍 Queries
me: User – verifica token actual y obtiene información desde user-service.

¿Por qué usar GraphQL aquí?

📱 Clientes móviles necesitan control granular sobre datos.

🎯 Único endpoint para login, me, refreshToken.

🌐 Apollo Federation permite un esquema federado entre múltiples servicios.

🛠️ Stack Tecnológico Clave
Tecnología	Rol
NestJS + GraphQL	Arquitectura escalable y declarativa
Passport.js	OAuth y social login
Redis	Gestión segura de refresh tokens
Apollo Federation	Gateway federado unificado
JWT & Guards	Protección robusta de endpoints
🛰️ Comunicación con user-service
Vía Apollo Federation:

Implementa resolvers federados parciales del tipo User.

user-service es dueño y fuente principal de los datos personales.

Resolución automática desde gateway:

graphql
Copy
Edit
query {
  me {
    id
    fullName
    profilePicture
  }
}
Vía Eventos (NATS o interno):

Al registrarse un usuario nuevo, emite:

typescript
Copy
Edit
this.client.emit('user.created', {
  id: 'uuid',
  email: 'user@mail.com',
  fullName: 'John Doe',
  ....
});
El user-service escucha el evento y crea el usuario.

🎯 Ventajas de Separar Servicios (auth vs. user)
Razón	Beneficio
📦 Separación de responsabilidades	Código más limpio, fácil de mantener y seguro
🔐 Seguridad	Gestión segura y aislamiento de tokens
🚀 Escalabilidad	Escala cada servicio según necesidad
🧩 Modularidad	Fácilmente sustituible por Auth0, Keycloak
⚡ Federación y rendimiento	Carga optimizada y rápida en clientes
🌟 Diagrama Visual Simplificado
diff
Copy
Edit
Mobile App 
    │
    │ GraphQL (Apollo Client)
    ▼
Apollo Gateway 🌐 (Federation)
    ├───────────┬───────────┐
    ▼           ▼           ▼
[ auth-service ]      [ user-service ]



