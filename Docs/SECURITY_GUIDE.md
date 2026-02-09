# 🛡️ Guía de Seguridad y Configuración

En este proyecto exploramos **3 métodos** para manejar la configuración y las credenciales (tokens, claves API) de tu Bot de Discord.

El objetivo principal es evitar subir **Secretos** a GitHub para prevenir hackeos.

> ⚠️ **IMPORTANTE:** Los archivos incluidos en este repositorio ([.env](../.env), [config.json](../config.json), [config.js](../config.js)) son **PLANTILLAS**. Debes editarlos con tus propios datos reales.

---

## 🥇 Método 1: Variables de Entorno (.env)

**Estado:** ✅ _Recomendado (Estándar de la Industria)_

Es la forma más segura. Las variables viven en el entorno del sistema operativo, no en el código. Se usa la librería [dotenv](https://www.npmjs.com/package/dotenv).

### 1. Edita el Archivo ([.env](../.env))

En el repositorio encontrarás un archivo `.env` de ejemplo. Ábrelo y reemplaza los textos por tus claves reales.

_Nota: Si vas a subir tu propia versión del bot a GitHub, asegúrate de que tu `.env` con datos reales esté en el `.gitignore`._

```ini
# Edita los valores dentro de las comillas
TOKEN_DISCORD_BOT = "AQUI VA EL TOKEN DEL BOT"

KEY = "AQUI VA CUALQUIER OTRA CLAVE SECRETA QUE QUIERAS GUARDAR"

```

### 2. Importación ([index.js](../index.js))

Así es como el bot lee estas variables protegidas:

```javascript
const { Client, ActivityType } = require("discord.js");
require("dotenv").config({ quiet: true });
require("colors");

const { Client } = require("discord.js");
const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot encendido como: ${client.user.tag}`.green.bold);

  client.user.setActivity("Nuevo video en Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/el_aldas",
  });
});

client.login(process.env.TOKEN_DISCORD_BOT);
```

### 3. Otra forma de importación ([index.js](../index.js))

> ⚙️ (Opcional) Si usas un archivo separado para desarrollo:

```javascript
const { Client, ActivityType } = require("discord.js");
require("dotenv").config({ quiet: true, path: ".env.development" });
require("colors");

const { Client } = require("discord.js");
const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot encendido como: ${client.user.tag}`.green.bold);

  client.user.setActivity("Nuevo video en Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/el_aldas",
  });
});

client.login(process.env.TOKEN_DISCORD_BOT);
```

---

## 🥈 Método 2: Archivo JSON (`config.json`)

**Estado:** ⚠️ _Útil para Configuración Pública (Colores, Prefijos)_

Es un formato estático muy limpio y organizado, pero **NO permite comentarios**.

### 1. Edita el Archivo ([config.json](../config.json))

Modifica el archivo existente con tus preferencias.

```json
{
  "TOKEN_DISCORD_BOT": "AQUI VA EL TOKEN DEL BOT",
  "KEY": "AQUI VA CUALQUIER OTRA CLAVE SECRETA QUE QUIERAS GUARDAR"
}
```

### 2. Importación ([index.js](../index.js))

Node.js permite importar archivos JSON directamente como si fueran objetos.

```javascript
const { Client, ActivityType } = require("discord.js");
const config = require("./config.json");
require("colors");

const { Client } = require("discord.js");
const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot encendido como: ${client.user.tag}`.green.bold);

  client.user.setActivity("Nuevo video en Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/el_aldas",
  });
});

client.login(config.TOKEN_DISCORD_BOT);
```

---

## 🥉 Método 3: Módulo JavaScript (`config.js`)

**Estado:** ⚠️ _Versátil (Permite lógica y comentarios)_

A diferencia del JSON, aquí puedes usar código real de JavaScript y escribir explicaciones.

### 1. Edita el Archivo ([config.js](../config.js))

Al igual que los anteriores, reemplaza los valores de ejemplo.

```javascript
module.exports = {
  TOKEN_DISCORD_BOT: "AQUI VA EL TOKEN DEL BOT",
  KEY: "AQUI VA CUALQUIER OTRA CLAVE SECRETA QUE QUIERAS GUARDAR",
};
```

### 2. Importación ([index.js](../index.js))

```javascript
const { Client, ActivityType } = require("discord.js");
const { TOKEN_DISCORD_BOT } = require("./config.js");
require("colors");

const { Client } = require("discord.js");
const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot encendido como: ${client.user.tag}`.green.bold);

  client.user.setActivity("Nuevo video en Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/el_aldas",
  });
});

client.login(TOKEN_DISCORD_BOT);
```

---

## 🆚 Tabla Comparativa

| Característica     | `.env`                | `config.json`          | `config.js`                  |
| ------------------ | --------------------- | ---------------------- | ---------------------------- |
| **Seguridad**      | ⭐⭐⭐⭐⭐ (Alto)     | ⭐⭐ (Bajo)            | ⭐⭐ (Bajo)                  |
| **Comentarios**    | ✅ Sí (`#`)           | ❌ No                  | ✅ Sí (`//`)                 |
| **Tipos de datos** | Solo Texto (String)   | Texto, Números, Arrays | Todo (Funciones, Objetos...) |
| **Uso Ideal**      | **Tokens y Secretos** | Colores, textos fijos  | Lógica compleja de config    |

---
