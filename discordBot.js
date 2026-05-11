const { Client, GatewayIntentBits } = require("discord.js");
const db = require("./db");
const config = require("./config");

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

/* ================= SECURITY ================= */

function isAdmin(userId) {
	return config.ADMINS.includes(userId);
}

/* ================= COMMAND HANDLER ================= */

client.on("interactionCreate", async (i) => {

	if (!i.isChatInputCommand()) return;

	// 🔐 GLOBAL SECURITY CHECK
	if (!isAdmin(i.user.id)) {
		return i.reply({
			content: "❌ You are not authorized to use this command.",
			ephemeral: true
		});
	}

	const id = i.options.getString("robloxid");

	/* ================= BAN ================= */
	if (i.commandName === "ban") {

		db.run("UPDATE users SET banned = 1 WHERE robloxId = ?", [id]);

		db.run("INSERT INTO audit (robloxId, action) VALUES (?, ?)", [
			id,
			"ADMIN_BAN"
		]);

		return i.reply(`🚫 Banned ${id}`);
	}

	/* ================= UNBAN ================= */
	if (i.commandName === "unban") {

		db.run("UPDATE users SET banned = 0 WHERE robloxId = ?", [id]);

		db.run("INSERT INTO audit (robloxId, action) VALUES (?, ?)", [
			id,
			"ADMIN_UNBAN"
		]);

		return i.reply(`✅ Unbanned ${id}`);
	}

	/* ================= PREMIUM ================= */
	if (i.commandName === "premium") {

		const value = i.options.getBoolean("value");

		db.run(
			"UPDATE users SET premium = ? WHERE robloxId = ?",
			[value ? 1 : 0, id]
		);

		db.run("INSERT INTO audit (robloxId, action) VALUES (?, ?)", [
			id,
			"ADMIN_PREMIUM_" + value
		]);

		return i.reply(`💰 Premium set to ${value} for ${id}`);
	}

	/* ================= UNLINK ================= */
	if (i.commandName === "unlink") {

		db.run("DELETE FROM users WHERE robloxId = ?", [id]);

		db.run("INSERT INTO audit (robloxId, action) VALUES (?, ?)", [
			id,
			"ADMIN_UNLINK"
		]);

		return i.reply(`🔓 Unlinked ${id}`);
	}

	/* ================= USER INFO ================= */
	if (i.commandName === "userinfo") {

		db.get("SELECT * FROM users WHERE robloxId = ?", [id], (err, row) => {

			if (!row) return i.reply("❌ User not found");

			i.reply(
`👤 Roblox: ${row.robloxId}
💬 Discord: ${row.discordId}
💰 Premium: ${row.premium}
🚫 Banned: ${row.banned}`
			);
		});
	}

	/* ================= ANALYTICS ================= */
	if (i.commandName === "analytics") {

		db.all("SELECT action FROM audit", [], (err, rows) => {

			let bans = 0;
			let unbans = 0;
			let premium = 0;
			let links = 0;

			rows.forEach(r => {
				if (r.action.includes("BAN")) bans++;
				if (r.action.includes("UNBAN")) unbans++;
				if (r.action.includes("PREMIUM")) premium++;
				if (r.action.includes("VERIFIED")) links++;
			});

			i.reply(
`📊 SYSTEM ANALYTICS

🔗 Links: ${links}
🚫 Bans: ${bans}
🔓 Unbans: ${unbans}
💰 Premium changes: ${premium}
📜 Total actions: ${rows.length}`
			);
		});
	}
});

/* ================= READY ================= */

client.once("ready", () => {
	console.log("Discord bot online");
});

client.login(config.BOT_TOKEN);