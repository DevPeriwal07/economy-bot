const { Collection } = require('discord.js');

// A collection of <command.name, command.module>
const commands = new Collection();

const colors = {
  success: '#a3e635',
};

module.exports = {
  commands,
  colors,
};
