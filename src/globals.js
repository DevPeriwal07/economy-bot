const { Collection } = require('discord.js');

// A collection of <command.name, command.module>
const commands = new Collection();

module.exports = {
  commands,
};
