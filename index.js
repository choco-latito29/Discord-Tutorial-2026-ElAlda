const { Client, ActivityType } = require("discord.js");

const client = new Client({ intents: 53608447 });

client.once("clientReady", () => {
  console.log(`Bot encendido como: ${client.user.tag}`);

  //* --- 🎭 OPCIONES DE ESTADO (ActivityType) ---
  //* Cambia el 'type' más abajo por uno de estos:
  //? ActivityType.Playing    -> Juega a ...
  //? ActivityType.Watching   -> Ve ...
  //? ActivityType.Listening  -> Escucha ...
  //? ActivityType.Competing  -> Compite en ...
  //? ActivityType.Streaming  -> Transmite (Requiere URL de Twitch)
  //? ActivityType.Custom     -> Estado personalizado (Status de texto)

  //* --- 🛠️ VARIABLES MÁGICAS (Estadísticas en tiempo real) ---
  //* Copia estas variables dentro de las comillas invertidas ` ` para usarlas:

  //? --- 📊 Estadísticas del Servidor ---
  //? client.guilds.cache.size                                     -> 🏠 Servidores (Ej: 5)
  //? client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)   -> 👥 Usuarios Totales
  //? client.channels.cache.size                                   -> 💬 Canales Totales (Texto + Voz + Categorías)
  //? client.emojis.cache.size                                     -> 😄 Emojis que el bot puede ver

  //? --- 🤖 Identidad del Bot ---
  //? client.user.tag                                              -> 🏷️ TuBot#1234
  //? client.user.username                                         -> 🤖 TuBot
  //? client.user.id                                               -> 🆔 ID (982374...)
  //? client.user.createdAt.toLocaleDateString()                   -> 🎂 Fecha de creación (Ej: 1/2/2026)

  //? --- ⚙️ Datos Técnicos ---
  //? client.ws.ping                                               -> 📡 Ping (Latencia en ms)
  //? process.version                                              -> 🟢 Versión de Node.js (Ej: v22.0.0)
  //? (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)    -> 🧠 Memoria RAM usada (Ej: 25.50 MB)

  //! IMPORTANTE: Los conteos (usuarios/servidores) pueden tardar unos segundos en cargar al encender.
  //TODO: Crear un sistema para que el estado cambie cada 10 minutos (Rotativo).

  // 👇 AQUÍ ELIGES QUÉ USAR (Ejemplo: Streaming)
  client.user.setActivity("Nuevo video en Youtube/Twitch", {
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/el_aldas", //! 🟣 Esto hace que el estado se ponga morado [Solo funciona con links de Twitch]
  });
});

client.login("TOKEN_BOT_AQUI");
