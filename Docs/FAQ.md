# ❓ Frequently Asked Questions (FAQ)

### 1. The bot won't start and throws an "Intents" error

Make sure you have enabled the **Privileged Gateway Intents** (Presence, Server Members, Message Content) in the [Discord Developer Portal](https://discord.com/developers/applications).

### 2. Why don't my logs show who deleted a message?

If the message was deleted by the author themselves, Discord does not generate an audit log. The bot will only show the moderator if the action time is less than 5 seconds from the event.
