import type { Bot } from '#types/dataTypes';

export const bots: Array<Bot> = [
  // DSMonitoring#0015
  {
    clientId: '575776004233232386',
    name: 'DSMonitoring',
    commandName: 'like',
    // 4h
    bumpCoolDown: 60 * 60 * 1000 * 4,
    emoji: '<:DSMonitoring:1044773762177957928>',
    successText: 'Ви успішно лайкнули сервер',
  },
  // DISBOARD#2760
  {
    clientId: '302050872383242240',
    name: 'DISBOARD',
    commandName: 'bump',
    // 2h
    bumpCoolDown: 60 * 60 * 1000 * 2,
    emoji: '<:DISBOARD:1044773639385526272>',
    successColor: 2406327,
  },
  // Server Monitoring#8312
  {
    clientId: '315926021457051650',
    name: 'ServerMonitoring',
    commandName: 'bump',
    // 4h
    bumpCoolDown: 60 * 60 * 1000 * 4,
    emoji: '<:ServerMonitoring:1044773789407383582>',
    successColor: 4437378,
  },
  // Bumper Нагадувач
  {
    clientId: '1045683985394704385',
    name: 'Bumper Нагадувач',
    commandName: 'bump',
    // 30s
    bumpCoolDown: 30 * 1000,
    emoji: '<:bumper:1045759103156363334>',
    successColor: 3330168,
  },
];
