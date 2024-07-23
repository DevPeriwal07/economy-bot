const prisma = require('../../utils/prisma');
const { colors } = require('../../globals');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  data: {
    name: 'deposit',
    description: 'Deposit your coins into your bank.',
    options: [
      {
        name: 'amount',
        description: 'The amount of coins you want to deposit.',
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
      select: { coins: true, bank: true, bankSpace: true },
    });

    // Check if user has enough coins to deposit
    if (userData.coins < amount) {
      await interaction.reply({
        content: `You don't have enough **${amount.toLocaleString()}** coins to deposit.`,
        ephemeral: true,
      });
      return;
    }

    // Check if user has enough bank space
    if (userData.bank + amount > userData.bankSpace) {
      await interaction.reply({
        content: `You don't have enough bank space to deposit **${amount.toLocaleString()}** coins.`,
        ephemeral: true,
      });
      return;
    }

    // Update user data in the database
    const updatedUserData = await prisma.user.update({
      where: { id: interaction.user.id },
      data: {
        coins: { decrement: amount },
        bank: { increment: amount },
      },
      select: { coins: true, bank: true },
    });

    const deposited = updatedUserData.bank - userData.bank;

    const author = {
      name: `${interaction.user.displayName}'s successful deposit`,
      iconURL: interaction.user.displayAvatarURL(),
    };

    const description = `You've successfully deposited **${deposited.toLocaleString()}** coin${
      deposited > 1 ? 's' : ''
    }. You now have **${updatedUserData.coins.toLocaleString()}** coin${
      updatedUserData.coins !== BigInt(1) ? 's' : ''
    } left!`;

    const embed = new EmbedBuilder()
      .setAuthor(author)
      .setDescription(description)
      .setColor(colors.success)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
