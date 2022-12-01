import { ChatInputCommand, Command } from '@sapphire/framework';
import { GuildMember, MessageEmbed, Role } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import guilds from '#models/guilds';

@ApplyOptions<Command.Options>({ name: 'mention' })
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
    registry.registerChatInputCommand(builder =>
      builder
        .setName('згадувати')
        .setDescription('Додати або прибрати роль або юзера з переліку тих кого треба згадувати')
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
        .addMentionableOption(options =>
          options.setName('згадування').setDescription('Оберіть роль або юзера').setRequired(true),
        ),
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputInteraction) {
    if (!interaction.inGuild()) return null;

    const action = interaction.options.getString('дія');
    const mention = interaction.options.getMentionable('згадування');

    const isRole = mention instanceof Role;
    const isMember = mention instanceof GuildMember;
    if (!mention || (!isRole && !isMember)) {
      return interaction.reply({
        embeds: [
          this.errorEmbed(
            `Сталася помилка! Невдалося отримати ${isRole ? 'роль яку' : 'користувача якого'} Ви вказали.`,
            '🚫',
          ),
        ],
        ephemeral: true,
      });
    }

    let guild_DB = await guilds.findOne({ guildId: interaction.guildId }).exec();
    if (!guild_DB) guild_DB = await guilds.create({ guildId: interaction.guildId });
    if (!guild_DB.bumpRoles || !(guild_DB.bumpRoles instanceof Array)) {
      return interaction.reply({
        embeds: [this.errorEmbed(`Сталася помилка!\nПомилка: bumpRoles is not Array\nЗверніться до розробника!`)],
        ephemeral: true,
      });
    } else if (!guild_DB.bumpUsers || !(guild_DB.bumpUsers instanceof Array)) {
      return interaction.reply({
        embeds: [this.errorEmbed(`Сталася помилка!\nПомилка: bumpUsers is not Array\nЗверніться до розробника!`)],
        ephemeral: true,
      });
    }

    if (action === 'add') {
      if (
        (isRole && guild_DB.bumpRoles.includes(mention.id)) ||
        (isMember && guild_DB.bumpUsers.includes(mention.id))
      ) {
        return interaction.reply({
          embeds: [this.errorEmbed(`Ц${mention instanceof Role ? 'я роль' : 'ей користувач'} вже є у переліку.`)],
          ephemeral: true,
        });
      } else if ((isRole && guild_DB.bumpRoles.length >= 15) || (isMember && guild_DB.bumpUsers.length >= 15)) {
        return interaction.reply({
          embeds: [
            this.errorEmbed(
              `Сталася помилка! Ви можете додати лише 15 ${isRole ? 'ролей' : 'користувачів'} до переліку.`,
            ),
          ],
          ephemeral: true,
        });
      }

      await guilds.findOneAndUpdate(
        { guildId: interaction.guildId },
        { $push: { [isRole ? 'bumpRoles' : 'bumpUsers']: mention.id } },
      );
    } else {
      const i = isRole
        ? guild_DB.bumpRoles.findIndex((bumpRole: string) => bumpRole === mention.id)
        : guild_DB.bumpUsers.findIndex((bumpUser: string) => bumpUser === mention.id);

      if (i < 0) {
        return interaction.reply({
          embeds: [this.errorEmbed(`${isRole ? 'роль яку' : 'користувача якого'} Ви згадали не знайдено у переліку.`)],
          ephemeral: true,
        });
      }

      guild_DB[isRole ? 'bumpRoles' : 'bumpUsers'].splice(i, 1);
      await guilds.findOneAndUpdate(
        { guildId: interaction.guildId },
        { $set: { [isRole ? 'bumpRoles' : 'bumpUsers']: guild_DB[isRole ? 'bumpRoles' : 'bumpUsers'] } },
      );
    }

    return interaction.reply({
      embeds: [
        new MessageEmbed({
          color: 0x829524,
          title: '✅ | Команда успішно виконана',
          description: `${isRole ? 'Роль' : 'Користувач'} ${mention} ${
            action === 'add' ? `додан${isRole ? 'а' : ''} до` : `прибран${isRole ? 'а' : ''} з`
          } переліку тих кого треба згадати.`,
        }),
      ],
      ephemeral: true,
    });
  }

  private errorEmbed(content: string, emoji = '📛') {
    return new MessageEmbed({ color: 0xc95942, title: `${emoji} | Помилка`, description: content });
  }
}
