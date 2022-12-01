import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { bots } from '#lib/data';
import bumps from '#models/bumps';
import guilds from '#models/guilds';

// Administrator, Manage Channels, Manage Server, Manage Roles, Manage Webhooks
const MANAGER_PERMISSIONS = [8n, 16n, 32n, 268435456n, 536870912n];

@ApplyOptions<Listener.Options>({ name: 'messageCreate' })
export class ClientListener extends Listener {
  public override async run({ createdAt, embeds, interaction, guildId, member }: Message) {
    if (!member || (!interaction && !member?.permissions.any(MANAGER_PERMISSIONS))) return;

    const guild_DB = await guilds.findOne({ guildId });
    if (!guild_DB && member?.permissions.any(MANAGER_PERMISSIONS)) await guilds.create({ guildId });
    else if (!guild_DB) return null;

    const bot = bots.find(bot => bot.clientId === member.id);
    if (!bot || interaction?.commandName !== bot.commandName) return null;

    const cooldown: number = bot.bumpCoolDown;
    if (!cooldown) return null;

    if (!embeds.length) return null;
    const [embed] = embeds;

    const isSuccess: boolean =
      Boolean(bot.successColor && embed.color === bot.successColor) ||
      Boolean(bot.successText && embed.description?.includes(bot.successText)) ||
      false;

    if (!isSuccess) return null;

    const bump = await bumps.findOne({ guildId, clientId: member.id });
    if (bump) await bump.delete();

    await bumps.create({
      guildId,
      clientId: member.id,
      commandName: interaction?.commandName,
      usedTime: createdAt,
      nextUse: new Date(createdAt.getTime() + cooldown),
      usedBy: interaction?.user.id,
    });

    return null;
  }
}
