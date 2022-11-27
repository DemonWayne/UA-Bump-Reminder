import type { ColorResolvable, EmojiResolvable, Snowflake } from 'discord.js';
import type { LocalizationMap } from 'discord-api-types/v10';

export interface Bot {
  // Client / Bot ID
  readonly clientId: Snowflake;
  // Bot name
  readonly name: string;
  // Bump Command name
  readonly commandName: string;
  // Bump CoolDown
  readonly bumpCoolDown: number;
  // Custom Emoji of bot
  readonly emoji?: EmojiResolvable;
  // Success Embed Color
  readonly successColor?: ColorResolvable;
  // Success Embed Text
  readonly successText?: string;
}

export interface APIApplicationCommandOptionChoice<ValueType = string | number> {
  name: string;
  name_localizations?: LocalizationMap | null;
  value: ValueType;
}
