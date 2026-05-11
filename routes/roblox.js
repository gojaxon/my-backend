const express = require("express");
const db = require("../db");

const router = express.Router();

/* STATUS CHECK */
router.get("/status", (req, res) => {

	const id = req.query.userId;

	db.get(
		"SELECT * FROM users WHERE robloxId = ?",
		[id],
		(err, row) => {

			if (!row) return res.json({ linked: false });

			res.json(row);
		}
	);
});

module.exports = router;