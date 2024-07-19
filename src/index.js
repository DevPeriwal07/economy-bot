const fs = require('fs');
const path = require('path');
const globals = require('./globals');
const { Client } = require('discord.js');
const { token, guildId } = require('../config.json');

const client = new Client({
  intents: 'Guilds',
});

client.once('ready', () => {
  console.log('The client is ready!');

  // Set commands
  const commandsPath = path.join(__dirname, 'commands');
  fs.readdirSync(commandsPath).forEach((filePath) => {
    const file = require(path.join(commandsPath, filePath));

    globals.commands.set(file.data.name, file);
  });

  // Register Commands
  client.guilds.fetch(guildId).then(async (guild) => {
    const commands = Array.from(globals.commands.values()).map((c) => c.data); // c.data is the command object
    await guild.commands.set(commands);
  });
});

client.on('interactionCreate', async (interaction) => {
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

    await command.run(client, interaction);
  }
});

client.login(token);
