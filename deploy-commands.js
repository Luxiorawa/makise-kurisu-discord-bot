require("dotenv/config");

const CONFIG_FILE = require("./Config/config.js");

const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

(async () => {
	const TOKEN = CONFIG_FILE.discord.bot.token;
	const CLIENT_ID = CONFIG_FILE.discord.client.id;
	const GUILD_ID = CONFIG_FILE.discord.server.id;

	const COMMANDS = [];

	await dynamicallyLoadCommands(COMMANDS);

	const REST_INSTANCE = new REST({ version: "9" }).setToken(TOKEN);

	try {
		process.env.NODE_ENV === "production"
			? await registerCommandsGloballyOnBot(REST_INSTANCE, CLIENT_ID, COMMANDS)
			: await registerCommandsOnOwnServer(REST_INSTANCE, CLIENT_ID, GUILD_ID, COMMANDS);

		console.log("Successfully registered application commands");
	} catch (error) {
		console.error(error);
	}
})();

async function registerCommandsOnOwnServer(REST_INSTANCE, CLIENT_ID, GUILD_ID, COMMANDS) {
	return await REST_INSTANCE.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
		body: COMMANDS,
	});
}

async function registerCommandsGloballyOnBot(REST_INSTANCE, CLIENT_ID, COMMANDS) {
	return await REST_INSTANCE.put(Routes.applicationCommand(CLIENT_ID), {
		body: COMMANDS,
	});
}

async function dynamicallyLoadCommands(COMMANDS) {
	const COMMAND_FILES = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

	for (const FILE of COMMAND_FILES) {
		const COMMAND = require(`./commands/${FILE}`);
		COMMANDS.push(COMMAND.data.toJSON());
	}
}
