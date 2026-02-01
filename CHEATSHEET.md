# ⚡ Hoja de Trucos (Discord.js v14)

Referencia rápida de las variables y estados utilizados en el curso **ELALDA 2026**.

## 🎭 Estados del Bot (ActivityType)

Para usar estos estados, impórtalos con `const { ActivityType } = require("discord.js");`

| Código                   | Descripción      | Ejemplo Visual                        |
| :----------------------- | :--------------- | :------------------------------------ |
| `ActivityType.Playing`   | 🎮 Juega a...    | _Juega a Visual Studio Code_          |
| `ActivityType.Watching`  | 👀 Ve...         | _Ve a los usuarios_                   |
| `ActivityType.Listening` | 🎧 Escucha...    | _Escucha Spotify_                     |
| `ActivityType.Competing` | 🏆 Compite en... | _Compite en Torneo_                   |
| `ActivityType.Streaming` | 🟣 Transmite...  | _En directo en Twitch_ (Requiere URL) |
| `ActivityType.Custom`    | 💬 Personalizado | _(Solo texto y emoji, sin prefijo)_   |

---

## 🛠️ Variables Mágicas (Client)

Usa estas variables dentro de tus `console.log` o estados para mostrar datos reales.

### 📊 Estadísticas del Servidor

| Variable                                                     | Qué devuelve                                 | Ejemplo |
| :----------------------------------------------------------- | :------------------------------------------- | :------ |
| `client.guilds.cache.size`                                   | Cantidad de Servidores                       | `5`     |
| `client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)` | Usuarios Totales (Suma de todos los servers) | `1450`  |
| `client.channels.cache.size`                                 | Canales Totales (Texto + Voz)                | `34`    |
| `client.emojis.cache.size`                                   | Emojis que el bot puede ver                  | `20`    |

### 🤖 Identidad del Bot

| Variable                                     | Descripción            | Ejemplo      |
| :------------------------------------------- | :--------------------- | :----------- |
| `client.user.tag`                            | Nombre + Discriminador | `TuBot#1234` |
| `client.user.username`                       | Solo el nombre         | `TuBot`      |
| `client.user.id`                             | ID única del bot       | `982374...`  |
| `client.user.createdAt.toLocaleDateString()` | Fecha de nacimiento    | `1/2/2026`   |

### ⚙️ Datos Técnicos (Nerd Stats)

| Variable                                                    | Descripción        | Ejemplo    |
| :---------------------------------------------------------- | :----------------- | :--------- |
| `client.ws.ping`                                            | Latencia (Ping)    | `45ms`     |
| `process.version`                                           | Versión de Node.js | `v22.0.0`  |
| `(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)` | Memoria RAM usada  | `25.50 MB` |

---

> 💡 **Nota:** Algunas variables como el conteo de usuarios pueden tardar unos segundos en estar disponibles justo después de encender el bot (`clientReady`).
