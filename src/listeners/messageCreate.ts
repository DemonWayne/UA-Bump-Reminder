import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { bumpMessage } from '#lib/utils/message';

@ApplyOptions<Listener.Options>({ name: 'messageCreate' })
export class ClientListener extends Listener {
  public override run(message: Message) {
    bumpMessage(message);
  }
}
