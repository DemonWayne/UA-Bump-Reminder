import type { Message } from 'discord.js';
import { bots } from '#lib/data';
import bumps from '#models/bumps';
import guilds from '#models/guilds';

const DEVS: string[] = ['481344295354368020'];

export const bumpMessage = async ({ author, createdAt, interaction, embeds, guildId }: Message) => {
  if (!interaction && !DEVS.includes(author.id)) return;

  const guild_DB = await guilds.findOne({ guildId });
  if (!guild_DB && DEVS.includes(author.id)) await guilds.create({ guildId });
  else if (!guild_DB) return null;

  const bot = bots.find(bot => bot.clientId === author.id);
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

  const bump = await bumps.findOne({ guildId, clientId: author.id });
  if (bump) await bump.delete();

  await bumps.create({
    guildId,
    clientId: author.id,
    commandName: interaction?.commandName,
    usedTime: createdAt,
    nextUse: new Date(createdAt.getTime() + cooldown),
    usedBy: interaction?.user.id,
  });

  return null;
};
