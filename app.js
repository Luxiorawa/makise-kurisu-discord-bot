require("dotenv/config");

const configFile = require("./Config/config.js");
const { Client, Intents } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
	console.log("Bot logged in !");
});

client.login(configFile?.discord.bot.token);
