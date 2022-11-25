import 'dotenv/config';
import '@sapphire/plugin-logger/register';
import { AdvancedClient } from '#lib/AdvancedClient';
import type { Message } from 'discord.js';
import { bumpMessage } from '#utils/message';

const client = new AdvancedClient({
  intents: 33323,
  sweepers: { messages: { interval: 120, lifetime: 60 } },
  partials: ['CHANNEL', 'MESSAGE', 'USER'],
});

(async () => {
  console.info(`Бот почав запускатися!`);
  await client.login().catch();
  console.info(`${client.user?.username} запустився!`);
})().catch(error => {
  console.error(error);
  client.destroy();
  process.exit(1);
});

(async () => {
  await client.checkBumps();
  // eslint-disable-next-line no-return-await
  setInterval(async () => await client.checkBumps(), 6 * 1000);
})().catch(err => console.error(err));

client.on('messageCreate', (message: Message) => {
  bumpMessage(message);
});
