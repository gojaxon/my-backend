const express = require("express");
const config = require("./config");

const authRoute = require("./routes/auth");
const robloxRoute = require("./routes/roblox");
const adminRoute = require("./routes/admin");

const app = express();
app.use(express.json());

app.use("/api", authRoute);
app.use("/api", robloxRoute);
app.use("/api/admin", adminRoute);

app.listen(config.PORT, () => {
	console.log("Backend running on port", config.PORT);
});