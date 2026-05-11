const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./links.db");

db.serialize(() => {

	db.run(`
	CREATE TABLE IF NOT EXISTS users (
		robloxId TEXT PRIMARY KEY,
		discordId TEXT,
		premium INTEGER DEFAULT 0,
		banned INTEGER DEFAULT 0
	)`);

	db.run(`
	CREATE TABLE IF NOT EXISTS audit (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		robloxId TEXT,
		action TEXT,
		time DATETIME DEFAULT CURRENT_TIMESTAMP
	)`);
});

module.exports = db;