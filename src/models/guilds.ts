import { Schema, model } from 'mongoose';

interface iGuild {
  guildId: string;
  bumpChannel: string;
  bumpRoles: string[];
}

const guildSchema = new Schema<iGuild>(
  {
    guildId: { type: String, required: true, unique: true },
    bumpChannel: { type: String, default: 'Не вказаний' },
    bumpRoles: { type: [String], default: [] },
  },
  { versionKey: false },
);

export = model<iGuild>('guild', guildSchema);
