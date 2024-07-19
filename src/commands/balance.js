const prisma = require('../utils/prisma');
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

    const data = await prisma.user.findUnique({
      where: {
        id: targetUser.id,
      },
    });

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
