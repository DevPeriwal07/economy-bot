const globals = require('../globals');
const prisma = require('../utils/prisma');
const queries = require('../utils/queries');

exports.handle = async function (interaction) {
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    const command = globals.commands.get(commandName);

    console.assert(command, `${commandName} command not found`);

    await queries.createUserAccount(interaction.user.id);

    try {
      await command.run(this, interaction);
    } catch (error) {
      console.log(error);
    } finally {
      await handleAfterCommand(interaction);
    }
  }
};

async function handleAfterCommand(interaction) {
  const { user } = interaction;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { commandsRan: { increment: 1 } },
    }),
  ]);
}
