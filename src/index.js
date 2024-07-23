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
  fs.readdirSync(commandsPath).forEach((folderPath) => {
    fs.readdirSync(path.join(commandsPath, folderPath)).forEach((filePath) => {
      const file = require(path.join(commandsPath, folderPath, filePath));
      globals.commands.set(file.data.name, file);
    });
  });

  // Register Commands
  client.guilds.fetch(guildId).then(async (guild) => {
    const commands = Array.from(globals.commands.values()).map((c) => c.data); // c.data is the command object
    await guild.commands.set(commands);
  });

  // Load Events
  fs.readdirSync(path.join(__dirname, 'events')).forEach((filePath) => {
    const file = require(path.join(__dirname, 'events', filePath));

    client.on(filePath.split('.')[0], file.handle.bind(client));
  });
});

client.login(token);
