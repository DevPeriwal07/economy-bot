const prisma = require('../../utils/prisma');
const { colors } = require('../../globals');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  data: {
    name: 'withdraw',
    description: 'Withdraw your coins from your bank.',
    options: [
      {
        name: 'amount',
        description: 'The amount of coins you want to withdraw.',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 1,
      },
    ],
  },

  async run(client, interaction) {
    const amount = BigInt(interaction.options.getInteger('amount'));

    // Ensure amount is valid
    if (amount < 1) {
      await interaction.reply({
        content: 'You have to specify an amount greater than or equal to 1.',
        ephemeral: true,
      });
      return;
    }

    // Fetch user data from the database
    const userData = await prisma.user.findUnique({
      where: { id: interaction.user.id },
      select: { bank: true },
    });

    // Check if user has enough coins to withdraw
    if (userData.bank < amount) {
      await interaction.reply({
        content: `You don't have enough **${amount.toLocaleString()}** coins to withdraw.`,
        ephemeral: true,
      });
      return;
    }

    // Update user data in the database
    const updatedUserData = await prisma.user.update({
      where: { id: interaction.user.id },
      data: {
        coins: { increment: amount },
        bank: { decrement: amount },
      },
      select: { coins: true, bank: true },
    });

    const withdrawn = userData.bank - updatedUserData.bank;

    const author = {
      name: `${interaction.user.displayName}'s successful withdraw`,
      iconURL: interaction.user.displayAvatarURL(),
    };

    const description = `You've successfully withdrawn **${withdrawn.toLocaleString()}** coin${
      withdrawn > 1 ? 's' : ''
    }. You now have **${updatedUserData.coins.toLocaleString()}** coin${
      updatedUserData.coins !== BigInt(1) ? 's' : ''
    }.`;

    const embed = new EmbedBuilder()
      .setAuthor(author)
      .setDescription(description)
      .setColor(colors.success)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
