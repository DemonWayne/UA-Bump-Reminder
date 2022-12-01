import type { Role } from 'discord.js';
import { SapphireClient } from '@sapphire/framework';
import { bots } from './data';
import bumpsModel from '#models/bumps';
import { connect } from 'mongoose';
import guilds from '#models/guilds';

export class AdvancedClient extends SapphireClient {
  public login() {
    this.logger.info(`Бот почав запускатися!`);
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

      const bot = bots.find(({ clientId }) => clientId === bump.clientId);
      if (!bot) return;

      const guild_DB = await guilds.findOne({ guildId: guild.id });
      if (!guild_DB) return;

      const bumpChannels = guild_DB.bumpChannels
        .map((id: string) => guild.channels.cache.get(id))
        .filter(bumpChannel => bumpChannel && bumpChannel.type === 'GUILD_TEXT');
      if (!bumpChannels.length) return;

      const bumpRoles = guild_DB.bumpRoles
        .map(role => guild.roles.cache.get(role))
        .filter((role): role is Role => Boolean(role));

      const bumpUsers = guild_DB.bumpUsers.map(user => `<@${user}>`);

      for (const bumpChannel of bumpChannels) {
        if (!bumpChannel || bumpChannel.type !== 'GUILD_TEXT') continue;

        const rolesForMention = bumpRoles.filter(
          role =>
            bumpChannel.permissionsFor(guild.id)?.has('VIEW_CHANNEL') ||
            role.permissions.has(8n) ||
            bumpChannel.permissionsFor(role).has('VIEW_CHANNEL'),
        );

        bumpChannel
          .send({
            content: `${rolesForMention.map(r => r).join(' ')} ${bumpUsers.join(' ')} прийшов час бампу! ${
              bot.emoji ? `${bot.emoji}` : `<@${bump.clientId}>`
            } \`/${bump.commandName}\``,
          })
          .catch(err => this.logger.error(err));
      }

      await bump.delete();
    }
  }

  private connectDatabase() {
    if (!process.env?.DATABASE_URL) throw new Error('Не вказано посилання на базу даних');
    connect(process.env.DATABASE_URL, {}, err => {
      if (err) throw err;
      else this.logger.info('[Database] MongoDB successfully connected.');
    });
  }
}
