const { Collection } = require('discord.js');

// A collection of <command.name, command.module>
const commands = new Collection();

const colors = {
  base: '#fb923c',
  success: '#a3e635',
};

module.exports = {
  commands,
  colors,
};
