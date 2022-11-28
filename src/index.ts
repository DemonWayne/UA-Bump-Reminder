import 'dotenv/config';
import '@sapphire/plugin-logger/register';
import { AdvancedClient } from '#lib/AdvancedClient';

const client = new AdvancedClient({
  intents: 33323,
  sweepers: { messages: { interval: 120, lifetime: 60 } },
  partials: ['CHANNEL', 'MESSAGE', 'USER'],
});

client.login().catch((err: Error) => console.error(err));
