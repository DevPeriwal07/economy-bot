const globals = require('../globals');

exports.handle = async function (interaction) {
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    const command = globals.commands.get(commandName);

    if (!command) {
      await interaction.reply({
        content: 'That command does not exists.',
        ephemeral: true,
      });

      return;
    }

    await command.run(this, interaction);
  }
};
