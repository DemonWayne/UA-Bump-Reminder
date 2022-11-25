import type { ColorResolvable, EmojiResolvable, Snowflake } from 'discord.js';

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
