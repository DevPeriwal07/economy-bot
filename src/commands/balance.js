const queries = require('../utils/queries');
const { stripIndents } = require('common-tags');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'balance',
    description: 'Check your balance.',
    options: [
      {
        name: 'user',
        type: ApplicationCommandOptionType.User,
        description: 'The user whose balance you want to see.',
        required: false,
      },
    ],
  },
  async run(client, interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    const data = await queries.getUserCurrency(targetUser.id);

    if (!data) {
      await interaction.reply({
        content: 'That user does not exists',
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.displayName}'s Balance`)
      .setDescription(
        stripIndents`
          **Wallet:** ${data.coins.toLocaleString()}
          **Bank:** ${data.bank.toLocaleString()}
        `,
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
