import type { AdvancedClient } from '#lib/AdvancedClient';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ name: 'ready', once: true })
export class ClientListener extends Listener {
  public override async run(client: AdvancedClient) {
    console.info(`${client.user?.username} запустився!`);

    await client.checkBumps();
    // eslint-disable-next-line no-return-await
    setInterval(async () => await client.checkBumps(), 6 * 1000);
  }
}
