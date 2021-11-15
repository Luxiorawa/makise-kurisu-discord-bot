require("dotenv/config");

const fs = require("fs");
const CONFIG_FILE = require("./Config/config.js");
const { Client, Collection, Intents } = require("discord.js");
const { registerBotInteractionsEvent, registerBotIsReadyEvent } = require("./Events/bot.js");

(async () => {
	const CLIENT = new Client({ intents: [Intents.FLAGS.GUILDS] });

	await searchAllBotCommands(CLIENT);
	await registerBotInteractionsEvent(CLIENT);
	await registerBotIsReadyEvent(CLIENT);

	CLIENT.login(CONFIG_FILE?.discord.bot.token);
})();

async function searchAllBotCommands(CLIENT) {
	CLIENT.commands = new Collection();

	const COMMAND_FILES = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

	for (const FILE of COMMAND_FILES) {
		const COMMAND = require(`./Commands/${FILE}`);

		CLIENT.commands.set(COMMAND.data.name, COMMAND);
	}
}
