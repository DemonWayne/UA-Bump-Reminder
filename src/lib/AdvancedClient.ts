import { Client, Role } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import { bots } from './data';
import bumpsModel from '#models/bumps';
import { connect } from 'mongoose';
import guilds from '#models/guilds';

export class AdvancedClient extends Client {
  public constructor(clientOptions: ClientOptions) {
    super(clientOptions);
  }

  public login() {
    this.connectDatabase();
    return super.login();
  }

  public async checkBumps() {
    const bumps = await bumpsModel.find({ nextUse: { $lte: Date.now() } }).exec();

    for (const bump of bumps) {
      const guild = this.guilds.cache.get(bump.guildId);
      if (!guild) {
        await bump.delete();
        return;
      }

      const bot = bots.find(bt => bt.clientId === bump.clientId);
      if (!bot) return;

      const guild_DB = await guilds.findOne({ guildId: guild.id });
      if (!guild_DB) return;

      const bumpChannel = guild.channels.cache.get(guild_DB.bumpChannel);
      if (!bumpChannel || bumpChannel.type !== 'GUILD_TEXT') return;

      const bumpRoles = guild_DB.bumpRoles
        .map(role => guild.roles.cache.get(role))
        .filter((role): role is Role => Boolean(role));

      bumpChannel
        .send({
          content: `${bumpRoles.map(r => r).join(' ')} прийшов час бампу! ${
            bot.emoji ? `${bot.emoji}` : `<@${bump.clientId}>`
          } \`/${bump.commandName}\``,
        })
        .catch(err => console.error(err));

      await bump.delete();
    }
  }

  private connectDatabase() {
    if (!process.env?.DATABASE_URL) throw new Error('Не вказано посилання на базу даних');
    connect(process.env.DATABASE_URL, {}, err => {
      if (err) throw err;
      else console.info('[Database] MongoDB successfully connected.');
    });
  }
}
