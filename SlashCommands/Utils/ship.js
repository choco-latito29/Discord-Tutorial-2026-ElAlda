const {
  SlashCommandBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
  AttachmentBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
} = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Mirad la compatibilidad de amor con otro user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Usuario para medir compatibilidad.")
        .setRequired(true),
    )
    .setContexts(0)
    .setIntegrationTypes(0),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    const { user, options } = interaction;

    const targetUser = options.getUser("user");

    const name1 = (user.globalName || user.username).toLowerCase();
    const name2 = (targetUser.globalName || targetUser.username).toLowerCase();

    let shipName = name1.substring(0, 2) + name2.substring(0, 2);
    shipName = shipName.charAt(0).toUpperCase() + shipName.slice(1);

    const randomColor = Math.floor(Math.random() * 16777215);

    const container = new ContainerBuilder()
      .setAccentColor(randomColor)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `🤔 Estoy midiendo la compatibilidad entre ${user} y ${targetUser}...\n\n` +
            `¡Calculando conexión para **${shipName}**! 💖`,
        ),
      );

    const smg = await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
      allowedMentions: { repliedUser: false },
    });

    const lovePercentage = Math.floor(Math.random() * 100) + 1;

    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const backgroundUrl = "https://i.imgur.com/VvwST6T.jpeg";
    const overleyUrl = "https://i.imgur.com/xXtjYAi.png";

    const avatarUrl = user.displayAvatarURL({
      extension: "png",
      size: 256,
      forceStatic: true,
    });
    const targetAvatarUrl = targetUser.displayAvatarURL({
      extension: "png",
      size: 256,
      forceStatic: true,
    });

    const [backgroundImg, overletImg, userImg, targetImg] = await Promise.all([
      loadImage(backgroundUrl),
      loadImage(overleyUrl),
      loadImage(avatarUrl),
      loadImage(targetAvatarUrl),
    ]);

    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(overletImg, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();

    const cx = canvas.width / 2;
    const cy = 45;

    ctx.moveTo(cx, cy + 30);
    ctx.bezierCurveTo(cx, cy - 15, cx - 100, cy - 15, cx - 100, cy + 60);
    ctx.bezierCurveTo(cx - 100, cy + 130, cx, cy + 180, cx, cy + 190);
    ctx.bezierCurveTo(cx, cy + 180, cx + 100, cy + 130, cx + 100, cy + 60);
    ctx.bezierCurveTo(cx + 100, cy - 15, cx, cy - 15, cx, cy + 30);

    ctx.clip();

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const heartTop = 30;
    const heartBottom = 235;
    const heartHeight = heartBottom - heartTop;

    const fillHeight = heartHeight * (lovePercentage / 100);
    const startY = heartBottom - fillHeight;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, startY);

    for (let x = 0; x <= canvas.width; x += 10) {
      const waveY = startY + Math.sin(x * 0.05) * 8;

      ctx.lineTo(x, waveY);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();

    ctx.fillStyle = "rgba(255, 51, 102, 0.85)";
    ctx.fill();

    ctx.restore();

    ctx.font = "bold 45px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textX = canvas.width / 2;
    const textY = canvas.height / 2 + 10;

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#000000";
    ctx.strokeText(`${lovePercentage} %`, textX, textY);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${lovePercentage} %`, textX, textY);

    const drawCircleAvatar = (img, x, y, size) => {
      ctx.save();

      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2 + 2, 0, Math.PI * 2, true);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    };

    drawCircleAvatar(userImg, 40, 27, 195);
    drawCircleAvatar(targetImg, 456, 27, 195);

    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "love.png",
    });

    let message = " ";

    if (lovePercentage >= 80) {
      message = "🔥 ¡Alerta roja! Cupido hizo un excelente trabajo.";
    } else if (lovePercentage >= 50) {
      message = "👀 Hay potencial, ¡invítale un chocolate!";
    } else {
      message = "💔 Mejor dejemos las cosas en un buen 'Amigos del alma'...";
    }

    const response = new TextDisplayBuilder().setContent(
      `📊 **Análisis Terminado**\n\n` +
        `La compatibilidad de la conexión **${shipName}** (entre ${user} y ${targetUser}) es del **${lovePercentage}%**.\n\n` +
        `${message}`,
    );

    const backgroud = new MediaGalleryBuilder().addItems(
      new MediaGalleryItemBuilder().setURL("attachment://love.png"),
    );

    await smg.edit({
      flags: MessageFlags.IsComponentsV2,
      components: [response, backgroud],
      files: [attachment],
      allowedMentions: { repliedUser: false },
    });
  },
};
