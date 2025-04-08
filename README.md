🧠 Primero: Visión General del auth-service con Apollo Federation
🔗 ¿Cómo funciona auth-service?
El microservicio auth-service es responsable de:

Registro (register)

Login (login)

Logout (logout)

Refresh de tokens (refreshTokens)

Soporte a login social (Google, Apple, Facebook)

Emitir eventos

Comunicar con user-service vía GraphQL para guardar usuarios

Usar Redis para tokens refresh

Usar Apollo Federation para integrarse en el Gateway GraphQL

🔁 ¿Cómo usa Apollo Federation?
Este servicio expone su propio schema GraphQL (usando @nestjs/graphql)

No define tipos federados directamente, pero invoca a un microservicio federado (user-service)

Se conecta al Gateway vía ApolloGateway usando su URL (AUTH_SERVICE_URL)

No requiere @extends ni @key aquí, pero sí puede tenerlos si expusiera User

📡 ¿Y los eventos?
Tiene un publisher de eventos (user-events.publisher.ts), actualmente para emitir:

user.registered

user.social.login

En una versión avanzada puede integrarse con NATS/Kafka para emitir eventos de dominio

🧱 ¿Qué hace el middleware?
roles.middleware.ts es un ejemplo de middleware que valida headers (como x-role)

Se puede usar en rutas específicas para restringir por rol (admin, user, etc.)