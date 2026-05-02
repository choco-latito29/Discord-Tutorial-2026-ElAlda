# 📝 Temario y Funcionalidades por Episodio

Resumen técnico de la serie de tutoriales de **ELALDA** (2026) para el desarrollo de bots en Discord.js v14.

---

### 🟢 Fase 1: Cimientos y Configuración

- **Episodio #1:** Inicialización con `npm init`, instalación de `discord.js` y gestión de `GatewayIntentBits`.
- **Episodio #2:** Manejo de `ActivityType` y `setActivity` para estados dinámicos.
- **Episodio #3:** Seguridad con `dotenv` y archivos `.env` protegidos por `.gitignore`.
- **Episodio #4:** Construcción de un Handler de Slash Commands profesional usando `Collection` y `fs`.
- **Episodio #5:** Entorno de desarrollo móvil en Android (WebCode + Markor).

### ⚡ Fase 2: Arquitectura y Escalabilidad

- **Episodio #6:** Implementación de un Event Handler modular (`loadEvents`).
- **Episodio #7:** Sistema de estados rotativos automáticos con `setInterval`.

### 🛡️ Fase 3: Sistema de Auditoría (Saga de Logs)

- **Episodio #8 (Canales):** Comando `/setlogs` y detección de creación/edición/borrado de canales.
- **Episodio #9 (Roles):** Detección de cambios en roles (color, posición, permisos) con sistema de cooldowns.
- **Episodio #10 (Mensajes):** Registro de `messageUpdate`, `messageDelete` y `messageDeleteBulk` con soporte para galerías de imágenes (`MediaGalleryBuilder`).

### 🎨 Fase 4: Comandos de Diversión y Canvas

- **Episodio #11 (Comando Love/Ship):** \* Instalación de la librería `@napi-rs/canvas` (Alternativa moderna, rápida y basada en Rust frente al canvas tradicional).
  - Manipulación de imágenes: Avatar circular, bordes y superposición de capas.
  - Generación de porcentajes aleatorios y envío de buffers mediante `AttachmentBuilder`.

### ⚙️ Fase 5: Sistemas de Servidor y Bases de Datos

- **Episodio #12 (Sistema de Autorol Dinámico):**
  - Estructuración avanzada con `addSubcommand` (`add`, `view`, `delete`).
  - Implementación de **Autocomplete Interaction** para filtrado reactivo de opciones (separación entre usuarios y bots) e identificación de roles fantasma.
  - Ciberseguridad de Discord: Bloqueo del rol predeterminado `@everyone`, filtrado de permisos críticos (`Administrator`) y validación de jerarquías (`highest.position`).
  - Integración de persistencia de datos (JSON) usando manejadores personalizados (`getData` y `setData`).
  - Diseño de interfaces UI/UX Premium utilizando `ContainerBuilder`, `TextDisplayBuilder` y `SeparatorBuilder`.

### 🚀 Fase 6: Despliegue y Producción (Hosting)

- **Episodio #13 (Hosting GRATIS 24/7 con Bot-Hosting):**
  - Configuración inicial de servidor en **Bot-Hosting.net** mediante autenticación con Discord.
  - **Gestión de Recursos (Uptime):** Administración del sistema de economía virtual de la plataforma (reclamo de monedas cada 3 horas) para costear la renovación automática y evitar la suspensión del servicio.
  - **Despliegue de Código (Upload):** Compresión del proyecto local en formato `.RAR` o `.ZIP` para luego ser subida a través del panel Pterodactyl/Web de la plataforma.
  - **Optimización de Dependencias:** Exclusión estricta de la carpeta `node_modules` y `package-lock.json` antes de la compresión para reducir el peso del archivo, evitar desgaste de ancho de banda y prevenir errores de compatibilidad entre el entorno de desarrollo y el servidor de producción.
  - Descompresión en la nube, arranque del entorno Node.js y ejecución en consola 24/7.
