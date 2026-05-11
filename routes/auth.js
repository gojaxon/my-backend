const express = require("express");
const db = require("../db");
const config = require("../config");
const { giveRole } = require("../discordBot");

const router = express.Router();

/* ================= LINK ACCOUNT ================= */

router.post("/link", async (req, res) => {

	const { robloxId, discordId } = req.body;

	if (!robloxId || !discordId) {
		return res.json({ ok: false, error: "Missing data" });
	}

	// Save / update user
	db.run(
		"INSERT OR REPLACE INTO users (robloxId, discordId, premium, banned) VALUES (?, ?, 0, 0)",
		[robloxId, discordId]
	);

	// Give VERIFIED role
	try {
		await giveRole(discordId, config.ROLES.VERIFIED);
	} catch (err) {
		console.log("Role error:", err);
	}

	// Log
	db.run(
		"INSERT INTO audit (robloxId, action) VALUES (?, ?)",
		[robloxId, "LINKED"]
	);

	res.json({ ok: true, message: "Linked successfully" });
});

module.exports = router;