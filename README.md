# 🤖 Discord Bot - Series 2026 (ElAlda)

![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v22+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Status](https://img.shields.io/badge/Estado-En_Desarrollo-orange?style=for-the-badge)
![License](https://img.shields.io/badge/Licencia-MIT-blue?style=for-the-badge)

[![Soporte](https://img.shields.io/badge/Discord-Soporte-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/invite/bkx66vSHDD)
[![YouTube](https://img.shields.io/badge/YouTube-ElAlda-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@elalda)
[![Kick](https://img.shields.io/badge/Kick-ElAlda-53FC18?style=for-the-badge&logo=kick&logoColor=black)](https://kick.com/elaldass)

![GitHub stars](https://img.shields.io/github/stars/choco-latito29/Discord-Tutorial-2026-ElAlda?style=for-the-badge&color=ffe900)
![GitHub forks](https://img.shields.io/github/forks/choco-latito29/Discord-Tutorial-2026-ElAlda?style=for-the-badge&color=orange)
![GitHub watchers](https://img.shields.io/github/watchers/choco-latito29/Discord-Tutorial-2026-ElAlda?style=for-the-badge&color=blueviolet)
![GitHub repo size](https://img.shields.io/github/repo-size/choco-latito29/Discord-Tutorial-2026-ElAlda?style=for-the-badge&color=success)
![Visitas](https://hits.sh/github.com/choco-latito29/Discord-Tutorial-2026-ElAlda.svg?style=for-the-badge&label=Visitas+Totales&extraCount=0&color=e24329)

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=5865F2&width=500&lines=Estado:+Transmitiendo+en+Kick+🟣;Viendo+a+servidores+y+usuarios+👀;Desarrollado+con+Discord.js+v14+🚀;¡No+olvides+dejar+tu+Estrella!+⭐;Ejecutando+en+Node.js+v22+🟢;Hecho+con+código+y+chocolate+🍫;24%2F7+Activo+(casi+siempre)+⚡" alt="Typing SVG" />
</p>

Bienvenido al repositorio oficial de mi bot de Discord. Este proyecto documenta mi progreso siguiendo la serie de tutoriales de **ELALDA** (2026), aplicando mejores prácticas, documentación robusta y código limpio.

## 👤 Autor

- **Desarrollador:** [𝒞𝒽𝑜𝒸𝑜](https://github.com/choco-latito29)
- **Repositorio:** [Mis Repositorios](https://github.com/choco-latito29?tab=repositories)

## 📺 Progreso del Curso (ELALDA)

| Episodio | Título / Tema                                                                 |    Estado     |
| :------: | :---------------------------------------------------------------------------- | :-----------: |
|  **#1**  | [COMO CREAR UN BOT DE DISCORD DESDE 0](https://youtu.be/kIWCxEzrSfo)          | ✅ Completado |
|  **#2**  | [COMO PONER PRESENCIA A TU BOT DE DISCORD](https://youtu.be/ySilekiFeGk)      | ✅ Completado |
|  **#3**  | [COMO PONER PRIVADO TU TOKEN (SEGURIDAD)](https://youtu.be/k9PKx_At8To)       | ✅ Completado |
|  **#4**  | [COMO CREAR SLASHCOMMANDS HANDLER](https://youtu.be/DpPQBi4ar_k)              | ✅ Completado |
|  **#5**  | [COMO CREAR TU BOT DE DISCORD DESDE TU CELULAR](https://youtu.be/6p0Ea5Qt_JU) | ✅ Completado |
|  **#6**  | [COMO CREAR EVENT HANDLER](https://youtu.be/phi6cHBCTlY)                      | ✅ Completado |

### 📝 Temario y Funcionalidades por Episodio

Resumen técnico de lo aprendido e implementado en cada video:

#### 🎬 Episodio #1: Configuración y "Hola Mundo"

- **Inicialización:** Creación del entorno Node.js (`npm init`) y estructura de archivos.
- **Dependencias:** Instalación y configuración de `discord.js` (v14).
- **Client:** Instanciación de la clase `Client` y gestión de `GatewayIntentBits`.
- **Login:** Conexión segura con la API de Discord mediante Token.

#### 🎬 Episodio #2: Presencia y Estado (Status)

- **ActivityType:** Implementación de la clase para definir estados (_Playing, Watching, Listening..._).
- **setActivity:** Método para mostrar mensajes personalizados en el perfil del bot.
- **Datos Dinámicos:** Inyección de variables en el estado (Conteo de Servidores `guilds.cache.size` y Usuarios).
- **Client User:** Manipulación de propiedades del usuario del bot (`tag`, `username`, `id`).

#### 🎬 Episodio #3: Variables de Entorno y Seguridad

- **Dotenv:** Implementación de la librería `dotenv` para gestión de variables de entorno.
- **Seguridad:** Uso de `.gitignore` para proteger el Token y credenciales sensibles.
- **Arquitectura:** Separación de configuración estética (`config.json`) y secretos (`.env`).
- **Validación:** Comprobación de existencia de claves API antes de iniciar el bot.

#### 🎬 Episodio #4: Slash Commands Handler

- **Colecciones:** Uso de `Collection` de Discord.js para mapear y almacenar comandos en memoria.
- **File System (fs):** Lectura dinámica de carpetas y filtrado de archivos `.js` usando `fs.readdirSync`.
- **Event Handler:** Modularización de eventos (`ClientReady`, `interactionCreate`) en la carpeta `/Events`.
- **Slash Handler:** Registro automático de comandos con `application.commands.set()` hacia la API de Discord.
- **Builders:** Creación profesional de comandos e interfaces usando `SlashCommandBuilder`, `ContainerBuilder`, `TextDisplayBuilder` y `MessageFlags`.

#### 🎬 Episodio #5: Bot de Discord en Celular (Android)

- **Entorno Móvil:** Instalación y configuración de aplicaciones (como WebCode) para programar localmente desde un dispositivo Android.
- **Gestión de Archivos:** Uso de editores externos para manipular archivos sin soporte nativo, como `package.json` y el archivo de secretos `.env`.
- **Terminal Integrada:** Uso de la consola móvil para la instalación de dependencias (`npm install discord.js`, `dotenv`) y el encendido del bot (`node index.js`).
- **Archivos Ocultos:** Configuración del File Manager para permitir la visualización y edición de archivos del sistema como `.env`.

#### 🎬 Episodio #6: Event Handler

- **Event Handler:** Creación del cargador automático de eventos (`eventHandler.js`) para modularizar la estructura.
- **File System (fs):** Uso de `readdirSync` para leer subcarpetas y archivos `.js` de manera dinámica y anidada.
- **Optimización:** Limpieza del archivo principal `index.js` delegando la carga a la función `loadEvents()`.
- **Eventos Dinámicos:** Configuración automática de `client.on` (múltiples veces) y `client.once` (una sola vez) basándose en las propiedades de cada archivo de evento.

## 📂 Estructura del Proyecto

Organización profesional de archivos para mantener el código limpio y escalable:

```javascript
📦 ALDA-TUTORIAL-2026
 ┣ 📂 .github                  # Carpeta de configuración de GitHub
 ┃ ┣ 📂 ISSUE_TEMPLATE         # Plantillas para reportes de errores
 ┃ ┃ ┣ 📜 bug_report.md
 ┃ ┃ ┗ 📜 feature_request.md
 ┃ ┣ 📜 CODE_OF_CONDUCT.md     # Normas de comunidad
 ┃ ┣ 📜 CONTRIBUTING.md        # Guía para colaboradores
 ┃ ┣ 📜 FUNDING.yml            # Botón de "Sponsor"
 ┃ ┣ 📜 pull_request_template.md # Plantilla de Pull Request
 ┃ ┗ 📜 SECURITY.md            # Política de seguridad
 ┣ 📂 Docs                     # Documentación y Guías
 ┃ ┣ 📜 CHEATSHEET.md
 ┃ ┗ 📜 SECURITY_GUIDE.md
 ┣ 📂 Events                   # ⚡ Eventos dinámicos del cliente
 ┃ ┗ 📂 Interaction            # Categoría de evento: Interacciones
 ┃   ┗ 📜 interactionCreate.js # Manejador de interacciones
 ┣ 📂 Handlers                 # ⚙️ Cargadores automáticos
 ┃ ┗ 📜 slashHandler.js        # Lógica para registrar comandos
 ┃ ┣ 📜 eventHandler.js        # Lógica para registrar eventos
 ┣ 📂 SlashCommands            # 💻 Comandos del bot por categorías
 ┃ ┗ 📂 Utils                  # Categoría: Utilidad
 ┃   ┗ 📜 ping.js              # Comando de latencia (Ejemplo)
 ┣ 📜 .editorconfig            # Estilos de código
 ┣ 📜 .env                     # Plantilla de variables (Sin claves reales)
 ┣ 📜 .gitattributes           # Configuración de Git
 ┣ 📜 .gitignore               # Archivos ignorados (Seguridad)
 ┣ 📜 config.js                # Configuración avanzada (JS)
 ┣ 📜 config.json              # Configuración básica (JSON)
 ┣ 📜 index.js                 # 🧠 Archivo principal (Main)
 ┣ 📜 LICENSE                  # Licencia MIT
 ┣ 📜 package-lock.json        # Árbol de dependencias exactas
 ┣ 📜 package.json             # Dependencias del proyecto
 ┗ 📜 README.md                # Este archivo
```

## 📚 Documentación y Recursos

Lista curada de herramientas y documentación oficial utilizada en este proyecto:

- **📄 [Hoja de Trucos (Cheat Sheet)](./Docs/CHEATSHEET.md):** Lista rápida de variables y estados para copiar y pegar.
- **🛡️ [Guía de Seguridad (Security Guide)](./Docs/SECURITY_GUIDE.md):** Aprende a configurar `.env`, `config.json` y `config.js` correctamente.

### 🧠 Lenguaje y Entorno

- **JavaScript (ES6+):**
  - [MDN Web Docs](https://developer.mozilla.org/es/docs/Web/JavaScript) - La biblia de JavaScript.
  - [JavaScript Info](https://es.javascript.info/) - Guía moderna detallada.
- **Node.js:**
  - [Descargar Node.js](https://nodejs.org/es/) - Entorno de ejecución (LTS recomendado).
  - [Docs Oficiales](https://nodejs.org/docs/latest/api/) - Referencia de la API.

### 🤖 Discord.js (Librería)

- **Paquete NPM:** [discord.js](https://www.npmjs.com/package/discord.js) - Descarga y versiones. Referencias básicas.
- **Documentación:** [Discord.js Docs](https://discord.js.org/docs/packages/discord.js/main) - Referencia técnica completa.
- **Guía Oficial:** [Discord.js Guide](https://discordjs.guide/) - Tutoriales y ejemplos paso a paso.
- **Soporte:** [Discord.js Server](https://discord.gg/djs) - Servidor oficial de ayuda.

### 🔐 Dotenv (Seguridad y Variables)

- **Paquete NPM:** [dotenv](https://www.npmjs.com/package/dotenv) - Página oficial de descarga e instalación (`npm i dotenv`).
- **Documentación:** [Dotenv GitHub](https://github.com/motdotla/dotenv#readme) - Referencia técnica, opciones de configuración y solución de problemas.

### 📝 Editores de Código (IDE)

- [Visual Studio Code](https://code.visualstudio.com/) - El estándar actual (Recomendado).
- [VS Code Insiders](https://code.visualstudio.com/insiders/) - Versión beta con las últimas novedades.
- [Sublime Text](https://www.sublimetext.com/) - Ligero y rápido.
- [Zed](https://zed.dev/) - Editor de alto rendimiento colaborativo.

### 📱 Desarrollo en Móvil (Android)

- **[WebCode (Play Store)](https://play.google.com/store/apps/details?id=com.qamar.webcode):** IDE móvil gratuito con terminal integrada para ejecutar Node.js y descargar paquetes NPM.
- **[Markor / Editor Externo (GitHub)](https://github.com/gsantner/markor/releases):** Editor de texto avanzado sin anuncios (link en la descripción del video #5 de ELALDA) necesario para editar archivos `.json` y `.env` en Android.

### 🛠️ Herramientas de Desarrollo

- **Discord Developer Portal:** [Applications](https://discord.com/developers/applications) - Para crear y gestionar tu bot.
- **Intents Calculator:** [Discord Intents](https://discord-intents-calculator.vercel.app/) - Para calcular los privilegios necesarios.
- **Permissions Calculator:** [Discord Permissions](https://discordapi.com/permissions.html) - Generador de enlaces de invitación.

## 🛡️ Seguridad

Nos tomamos muy en serio la seguridad. Si descubres una vulnerabilidad en este bot o en el código:

1.  **NO** abras un Issue público (para no exponer el fallo a hackers).
2.  Revisa nuestra [Política de Seguridad](./.github/SECURITY.md) para ver cómo reportarlo de forma privada.

## 🚀 Instalación y Uso

### 🔄 Actualización (Si ya tienes el bot)

> ⚠️ Si ya clonaste el repositorio anteriormente y quieres bajar los cambios del último video, **no clones de nuevo**. Simplemente abre tu terminal en la carpeta del bot y ejecuta:

```bash
git pull

```

---

### 🆕 Instalación desde cero

Sigue estos pasos si es la primera vez que descargas el bot:

1. **Clonar el repositorio:**

```bash
git clone https://github.com/choco-latito29/Discord-Tutorial-2026-ElAlda.git

```

2. **Instalar dependencias:**
   Navega a la carpeta del proyecto e instala los paquetes necesarios:

```bash
cd Discord-Tutorial-2026-ElAlda

npm install

```

3. **Configuración Segura (.env):**
   Este proyecto ya utiliza el estándar de seguridad profesional.
   - Abre el archivo llamado `.env` que está en la carpeta.
   - Pega tu Token dentro de las comillas:

   ```ini
   TOKEN_DISCORD_BOT = "TU_TOKEN_REAL_AQUI"
   ```

_(Nota: Si usas un archivo `.env.development` privado como enseñamos en el tutorial, asegúrate de configurarlo ahí)._

4. **Encender el bot:**
   Ahora que el token está seguro, inicia el bot:

```bash
node index.js

```

---

<p align="center">
  Please give a ⭐️ if you like this project! <br>
  Copyright © 2026 <a href="https://github.com/choco-latito29">𝒞𝒽𝑜𝒸𝑜</a>
</p>
