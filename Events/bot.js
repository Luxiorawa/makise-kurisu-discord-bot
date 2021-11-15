module.exports.registerBotInteractionsEvent = async (CLIENT) => {
	CLIENT.on("interactionCreate", async (interaction) => {
		if (!interaction.isCommand()) return;

		const COMMAND = CLIENT.commands.get(interaction.commandName);

		if (!COMMAND) return;

		try {
			await COMMAND.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	});
};

module.exports.registerBotIsReadyEvent = async (CLIENT) => {
	CLIENT.once("ready", () => {
		console.log("Bot logged in !");
	});
};
