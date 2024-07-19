module.exports = {
  data: {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  async run(client, interaction) {
    await interaction.reply('Pong!');
  },
};
