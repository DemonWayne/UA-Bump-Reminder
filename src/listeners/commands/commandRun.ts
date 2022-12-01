import { ChatInputCommand, Events, Listener } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Listener.Options>({ name: 'chatInputCommandRun' })
export class ClientListener extends Listener<typeof Events.ChatInputCommandRun> {
  public override run(interaction: ChatInputCommand.Interaction, command: ChatInputCommand) {
    this.container.client.logger.info(
      `[Command] ${interaction.user.tag} використав команду ${command.name} ${
        interaction.guild && interaction.channel?.type !== 'DM'
          ? `на сервері ${interaction.guild.name} у каналі ${interaction.channel?.name}`
          : `у приватних повідомленнях`
      }`,
    );
  }
}
