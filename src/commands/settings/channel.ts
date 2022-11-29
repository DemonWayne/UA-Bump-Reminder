import { ChatInputCommand, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { MessageEmbed } from 'discord.js';
import guilds from '#models/guilds';

@ApplyOptions<Command.Options>({ name: 'channel' })
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName('канал')
        .setDescription('Додати або прибрати канал з переліку тих куди буде відсилатись повідомлення')
        .setDefaultMemberPermissions(536870912n)
        .addStringOption(option =>
          option
            .setName('дія')
            .setDescription('Оберіть дію')
            .setRequired(true)
            .setChoices(
              ...[
                { name: 'додати', value: 'add' },
                { name: 'прибрати', value: 'remove' },
              ],
            ),
        )
        .addChannelOption(options => options.setName('канал').setDescription('Оберіть канал').setRequired(true)),
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!interaction.inGuild()) return null;

    const action = interaction.options.getString('дія');
    const channel = interaction.options.getChannel('канал');
    if (!channel || channel.type !== 'GUILD_TEXT') {
      return interaction.reply({ content: 'Треба вказати текстовий канал!', ephemeral: true });
    } else if (!channel.viewable && action === 'add') {
      return interaction.reply({
        content: 'Нажаль в мене немає доступу до цього каналу, вкажіть інший канал.',
        ephemeral: true,
      });
    }

    let guild_DB = await guilds.findOne({ guildId: interaction.guildId }).exec();
    if (!guild_DB) guild_DB = await guilds.create({ guildId: interaction.guildId });
    if (!guild_DB.bumpChannels || !(guild_DB.bumpChannels instanceof Array)) {
      return interaction.reply({ content: 'Сталася помилка! Зверніться до розробника!', ephemeral: true });
    }

    if (action === 'add') {
      if (guild_DB.bumpChannels.includes(channel.id)) {
        return interaction.reply({ content: 'Цей канал вже є у переліку.', ephemeral: true });
      } else if (guild_DB.bumpChannels.length >= 10) {
        return interaction.reply({
          content: 'Сталася помилка! Ви можете додати лише 10 каналів до переліку.',
          ephemeral: true,
        });
      }

      await guilds.findOneAndUpdate({ guildId: interaction.guildId }, { $push: { bumpChannels: channel.id } });
    } else {
      const i = guild_DB.bumpChannels.findIndex((bumpChannel: string) => bumpChannel === channel.id);
      if (i < 0) {
        return interaction.reply({ content: 'Канал котрий ви вказали не знайден у переліку.', ephemeral: true });
      }

      guild_DB.bumpChannels.splice(i, 1);
      await guilds.findOneAndUpdate(
        { guildId: interaction.guildId },
        { $set: { bumpChannels: guild_DB.bumpChannels } },
      );
    }

    return interaction.reply({
      embeds: [
        new MessageEmbed({
          color: 0x829524,
          title: '✅ | Команда успішно виконана',
          description: `Канал ${channel} ${action === 'add' ? 'додан до' : 'прибран з'} переліку каналів.`,
        }),
      ],
      ephemeral: true,
    });
  }
}
