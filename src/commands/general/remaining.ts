import { ChatInputCommand, Command } from '@sapphire/framework';
import { type GuildMember, MessageEmbed } from 'discord.js';
import { bots } from '#lib/data';
import bumps from '#models/bumps';
import { formattingTime } from '#utils/formatter';

export default class UserCommand extends Command {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    const choices: any = [];
    bots.forEach(bot => choices.push({ name: bot.name, value: bot.clientId }));

    registry.registerChatInputCommand(builder =>
      builder
        .setName('залишилось')
        .setDescription('Подивитись скільки часу залишилось до бампів')
        .addStringOption(option =>
          option
            .setName('бот')
            .setDescription('Оберіть бота')
            .setChoices(...choices),
        ),
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!interaction.guild) return null;
    const botId = interaction.options.getString('бот');

    const botsInfo: GuildMember[] = [];
    for await (const bot of bots) {
      const botMember = await interaction.guild.members.fetch(bot.clientId).catch(() => undefined);
      if (botMember) botsInfo.push(botMember);
    }

    if (!botsInfo.length) return null;

    const bumpsInfo = botId
      ? await bumps.findOne({ guildId: interaction.guildId, clientId: botId }).exec()
      : await bumps.find({ guildId: interaction.guildId }).exec();

    const bot = bots.find(bot => bot.clientId === botId);

    if (!bumpsInfo || (bumpsInfo instanceof Array && !bumpsInfo.length)) {
      return interaction.reply({
        embeds: [
          new MessageEmbed({
            color: 0xc95942,
            description: `**Час до бамп${
              bumpsInfo instanceof Array
                ? `ів:**\n${botsInfo
                    .map(({ id }) => {
                      const bumpBot = bots.find(({ clientId }) => clientId === id);
                      return `${bumpBot && bumpBot.emoji ? bumpBot.emoji : `<@${id}>`} \`/${
                        bumpBot?.commandName
                      }\`**: Немає інформації щодо наступного бампу**`;
                    })
                    .join('\n')}`
                : `у:**\n${bot && bot.emoji ? bot.emoji : `<@${bot?.clientId}>`} \`/${
                    bot?.commandName
                  }\`**: Немає інформації щодо наступного бампу**`
            }`,
          }),
        ],
      });
    }

    return interaction.reply({
      embeds: [
        new MessageEmbed({
          color: 0x42c981,
          description: `Час до бамп${
            bumpsInfo instanceof Array
              ? `ів:\n${botsInfo
                  .map(botInfo => {
                    const bump = bumpsInfo.find(bumpInfo => bumpInfo.clientId === botInfo.id);
                    const bumpBot = bots.find(({ clientId }) => clientId === botInfo.id);
                    return `${bumpBot && bumpBot.emoji ? bumpBot.emoji : `<@${bumpBot?.clientId}>`} \`/${
                      bumpBot?.commandName
                    }\`: **${
                      bump
                        ? `${formattingTime(bump.nextUse.getTime() - new Date().getTime())} <t:${(
                            bump.nextUse.getTime() / 1000
                          ).toFixed(0)}:T>`
                        : 'Немає інформації щодо наступного бампу'
                    }**`;
                  })
                  .join('\n')}`
              : `у:\n${bot && bot.emoji ? bot.emoji : `<@${bumpsInfo.clientId}>`} \`/${
                  bumpsInfo.commandName
                }\`: **${formattingTime(bumpsInfo.nextUse.getTime() - new Date().getTime())} <t:${(
                  bumpsInfo.nextUse.getTime() / 1000
                ).toFixed(0)}:T>**`
          }`,
        }),
      ],
    });
  }
}
