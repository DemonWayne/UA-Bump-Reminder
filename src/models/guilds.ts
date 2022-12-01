import { Schema, model } from 'mongoose';

interface iGuild {
  guildId: string;
  bumpChannels: string[];
  bumpRoles: string[];
  bumpUsers: string[];
}

const guildSchema = new Schema<iGuild>(
  {
    guildId: { type: String, required: true, unique: true },
    bumpChannels: { type: [String], default: [] },
    bumpRoles: { type: [String], default: [] },
    bumpUsers: { type: [String], default: [] },
  },
  { versionKey: false },
);

export = model<iGuild>('guild', guildSchema);
