import { ApplicationCommandOptionType, MessageEmbed } from 'discord.js';
import { ChatInputCommand, ChatInputCommandErrorPayload, Events, Listener } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Listener.Options>({ name: 'chatInputCommandError' })
export class ClientListener extends Listener<typeof Events.ChatInputCommandError> {
  public override run(error: Error, { command, interaction }: ChatInputCommandErrorPayload) {
    this.container.logger.error(`[Error] Відбулась помилка у коді.\nПомилка: ${error}`);

    if (process.env.DEVS?.split(/,\s?/).includes(interaction.user.id)) {
      const stringCommand = this.ChatInputCommandToMessageString(command, interaction);

      return interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setColor(0xeb4034)
              .setDescription(`**Сталася помилка у коді**`)
              .addFields([
                {
                  name: '**Відладка**',
                  value: [
                    `**Користувач**: ${interaction.user} (\`${interaction.user.id}\`)`,
                    `**Сервер**: ${interaction.guild?.name} (\`${interaction.guild?.id}\`)`,
                    `**Канал**: ${interaction.channel} (\`${interaction.channel?.id}\`)`,
                  ].join('\n'),
                },
                { name: '**Команда:**', value: stringCommand },
              ])
              .setFooter({
                text: `${interaction.client.user?.username}`,
                iconURL: process.env?.ICON_URL || 'https://cdn-icons-png.flaticon.com/512/1541/1541504.png',
              }),
          ],
          ephemeral: true,
        })
        .catch(() => this.container.logger.error('Сталася помилка під час відтправки помилки.'));
    }

    return interaction
      .reply({
        embeds: [
          new MessageEmbed()
            .setColor(0xeb4034)
            .setTitle('**🚫 | Помилка**')
            .setDescription('**Відбулася помилка у коді команди. Повідомте розробникам про це!**')
            .setFooter({
              text: `${interaction.client.user?.username}`,
              iconURL: process.env?.ICON_URL || 'https://cdn-icons-png.flaticon.com/512/1541/1541504.png',
            }),
        ],
        ephemeral: true,
      })
      .catch(() => this.container.logger.error('Сталася помилка під час відтправки помилки.'));
  }

  private ChatInputCommandToMessageString(command: ChatInputCommand, interaction: ChatInputCommand.Interaction) {
    const DEFAULT_OPTIONS: Array<ApplicationCommandOptionType> = ['BOOLEAN', 'INTEGER', 'NUMBER', 'STRING'];

    let string = `/${command.name}`;

    for (const { channel, member, name, role, type, value, user } of interaction.options.data) {
      if (DEFAULT_OPTIONS.includes(type)) string += ` **\`${name}:\`** \`${value}\``;
      else if (type === 'CHANNEL') string += ` **\`${name}:\`** ${channel}`;
      else if (type === 'MENTIONABLE') string += ` **\`${name}:\`** ${role || member || user}`;
      else if (type === 'ROLE') string += ` **\`${name}:\` ${role}`;
      else if (type === 'USER') string += ` **\`${name}:\`** ${user}`;
    }

    return string;
  }
}
