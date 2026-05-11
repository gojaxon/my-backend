const express = require("express");
const db = require("../db");

const router = express.Router();

// 🔐 Generate link code
router.post("/generate", (req, res) => {

	const { robloxId } = req.body;

	if (!robloxId) return res.json({ error: "Missing robloxId" });

	const code = Math.random().toString(36).substring(2, 8).toUpperCase();

	db.run(
		"INSERT OR REPLACE INTO users (robloxId, code, linked) VALUES (?, ?, 0)",
		[robloxId, code]
	);

	res.json({ code });
});

module.exports = router;