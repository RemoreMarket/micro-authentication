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

Comunicación entre auth-service y user-service
Vía Apollo Federation:
auth-service implementa una parte del tipo User (resolver federado)

user-service es el owner del User real

Desde el gateway, se resuelve automáticamente:

query {
  me {
    id
    fullName
    profilePicture
  }
}
Vía Eventos (NATS o interno):
Cuando un usuario se registra en auth-service, este emite un evento:

this.client.emit('user.created', {
  id: 'uuid',
  email: 'user@mail.com',
  fullName: 'John',
});
Y user-service escucha ese evento y guarda al usuario en su base de datos.

🎯 ¿Por qué están separados?
Separar auth-service y user-service tiene ventajas muy claras:

Razón	Beneficio
Separación de responsabilidades	Código más limpio y seguro
Seguridad	auth-service maneja tokens sin exponer datos personales
Escalabilidad	Puedes escalar user-service o auth según necesidad
Modularidad	Puedes reemplazar auth-service con Auth0 o Keycloak
Federación y rendimiento	Carga más rápida y resoluciones optimizadas
✅ Resumen Visual Simplificado
Mobile App
    |
    | GraphQL (Apollo Client)
    v
[ Gateway - Apollo Federation ]
    |
    |-----------------------------|
    |                             |
    v                             v
[ auth-service ]           [ user-service ]
  - Login/Register           - Perfil del usuario
  - Tokens                   - Foto, nombre, bio
  - OAuth                    - Roles y actualizaciones
  - Redis refresh            - Dataloader para batch de usuarios
