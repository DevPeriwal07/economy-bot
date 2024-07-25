const { colors } = require('../../globals');
const prisma = require('../../utils/prisma');
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

    let userData = await prisma.user.findUnique({
      where: {
        id: targetUser.id,
      },
      select: {
        coins: true,
        bank: true,
        bankSpace: true,
      },
    });

    if (!userData) {
      userData = await prisma.user.create({
        data: {
          id: targetUser.id,
        },
        select: {
          coins: true,
          bank: true,
          bankSpace: true,
        },
      });
    }

    const author = {
      name: `${targetUser.displayName}'s balance`,
      iconURL: targetUser.displayAvatarURL(),
    };

    const embed = new EmbedBuilder()
      .setAuthor(author)
      .setDescription(
        stripIndents`
          **Wallet:** ${userData.coins.toLocaleString()}
          **Bank:** ${userData.bank.toLocaleString()} / ${userData.bankSpace.toLocaleString()}
        `,
      )
      .setColor(colors.base)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
