import { Events, Listener } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Guild } from 'discord.js';
import guilds from '#models/guilds';

@ApplyOptions<Listener.Options>({ name: 'guildCreate' })
export class ClientListener extends Listener<typeof Events.GuildCreate> {
  public override async run(guild: Guild) {
    const guild_DB = await guilds.findOne({ guildId: guild.id });

    this.container.logger.info(
      `Бот був додан до серверу ${guild.name}. ${guild_DB ? 'Сервер вже є' : 'Сервера немає'} у базі даних.`,
    );

    if (guild_DB) return null;
    await guilds.create({ guildsId: guild.id });

    this.container.logger.info(`Сервер ${guild.name} [${guild.id}] додан до бази даних.`);

    return guild;
  }
}
