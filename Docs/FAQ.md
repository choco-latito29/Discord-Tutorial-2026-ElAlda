# ❓ Preguntas Frecuentes (FAQ)

### 1. El bot no enciende y da error de "Intents"

Asegúrate de tener activados los **Privileged Gateway Intents** (Presence, Server Members, Message Content) en el [Discord Developer Portal](https://discord.com/developers/applications).

### 2. ¿Por qué mis logs no muestran quién borró un mensaje?

Si el mensaje fue borrado por el propio autor, Discord no genera un log de auditoría. El bot solo mostrará el moderador si el tiempo de acción es menor a 5 segundos respecto al evento.
