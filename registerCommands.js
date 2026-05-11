const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const config = require("./config");

/* ================= COMMANDS ================= */

const commands = [

	new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban a Roblox user")
		.addStringOption(o =>
			o.setName("robloxid")
				.setDescription("Roblox ID")
				.setRequired(true)
		),

	new SlashCommandBuilder()
		.setName("unban")
		.setDescription("Unban a Roblox user")
		.addStringOption(o =>
			o.setName("robloxid")
				.setDescription("Roblox ID")
				.setRequired(true)
		),

	new SlashCommandBuilder()
		.setName("premium")
		.setDescription("Set premium status")
		.addStringOption(o =>
			o.setName("robloxid")
				.setDescription("Roblox ID")
				.setRequired(true)
		)
		.addBooleanOption(o =>
			o.setName("value")
				.setDescription("true = give, false = remove")
				.setRequired(true)
		),

	new SlashCommandBuilder()
		.setName("unlink")
		.setDescription("Unlink a user")
		.addStringOption(o =>
			o.setName("robloxid")
				.setDescription("Roblox ID")
				.setRequired(true)
		),

	new SlashCommandBuilder()
		.setName("userinfo")
		.setDescription("Get user info")
		.addStringOption(o =>
			o.setName("robloxid")
				.setDescription("Roblox ID")
				.setRequired(true)
		),

	new SlashCommandBuilder()
		.setName("analytics")
		.setDescription("View system analytics")
].map(cmd => cmd.toJSON());

/* ================= DEPLOY ================= */

const rest = new REST({ version: "10" }).setToken(config.BOT_TOKEN);

(async () => {
	try {
		console.log("📡 Registering slash commands...");

		await rest.put(
			Routes.applicationGuildCommands(
				config.CLIENT_ID,
				config.GUILD_ID
			),
			{ body: commands }
		);

		console.log("✅ Slash commands registered successfully!");
	} catch (err) {
		console.error("❌ Failed to register commands:", err);
	}
})();