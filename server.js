const express = require("express");
const axios = require("axios");
const db = require("./db");
const config = require("./config");
const { giveRole, removeRole } = require("./discordBot");

const app = express();
app.use(express.json());