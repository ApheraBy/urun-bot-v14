import { model, Schema } from "mongoose";

export const Hello = model("Hello", new Schema({
        guildId: { type: String, required: true },
        username: { type: String, required: true }
    })
);