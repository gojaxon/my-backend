const db = require("./db");

function log(event, robloxId = null, meta = {}) {
	db.run(
		"INSERT INTO audit (robloxId, action) VALUES (?, ?)",
		[robloxId, `${event} ${JSON.stringify(meta)}`]
	);
}

function getStats(callback) {
	db.all("SELECT action FROM audit", [], (err, rows) => {

		const stats = {
			totalActions: rows.length,
			bans: 0,
			unbans: 0,
			premiums: 0,
			links: 0
		};

		rows.forEach(r => {
			if (r.action.includes("BANNED")) stats.bans++;
			if (r.action.includes("UNBANNED")) stats.unbans++;
			if (r.action.includes("PREMIUM")) stats.premiums++;
			if (r.action.includes("VERIFIED")) stats.links++;
		});

		callback(stats);
	});
}

module.exports = { log, getStats };