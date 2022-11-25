import { Schema, model } from 'mongoose';

interface iBump {
  guildId: string;
  clientId: string;
  commandName: string;
  usedTime: Date;
  nextUse: Date;
  usedBy?: string;
}

const bumpSchema = new Schema<iBump>(
  {
    guildId: { type: String, required: true },
    clientId: { type: String, required: true },
    commandName: { type: String, required: true },
    usedTime: { type: Date, required: true },
    nextUse: { type: Date, required: true },
    usedBy: { type: String },
  },
  { versionKey: false },
);

export = model<iBump>('bump', bumpSchema);
