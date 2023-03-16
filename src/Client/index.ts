import 'advanced-logs';
import { Client, Collection, REST, Routes } from "discord.js";
import { Commands, Config, Events } from "../Interfaces";
import express, { Express, Request, Response } from 'express';
import { exit } from 'process';

import fs from "fs";
import path from "path";
import config from "../config.json";
import { connect, set } from 'mongoose';

export class Bot extends Client {
    public config: Config = config;
    public cooldownedUsers: Collection<string, number> = new Collection();
    public commands: Collection<string, Commands> = new Collection();

    public async init() {
        /**
         * * Here we enter our token and connect to the Discord API
         */
        this.login(this.config.discord.token).then(() => {
            console.success(`Discord API request successful`);
        }).catch(() => {
            console.error(`Discord API request failed`);
            exit(0);
        });

        const rest = new REST({ version: "10" }).setToken(this.config.discord.token);
        /**
         * * Create a server
         */
        const app: Express = express();

        app.get('/', (req: Request, res: Response) => {
            res.send({ success: true, message: `Hello there, I'm ${this.user.username}` });
          });
          
          app.listen(this.config.express.port, () => {
            console.success(`Server is running at http://localhost:${this.config.express.port}`);
          });
        /**
         * * We save the commands in our directory
         */
        fs.readdir(path.join(__dirname, "../Commands"), (err, files) => {
            if(err) throw err;

            files.forEach((file) => {
                fs.readdir(path.join(__dirname, `../Commands/${file}`), (_err, _files) => {
                    if(_err) throw _err;

                    _files.forEach(async (_file) => {
                        const { Command }: { Command: Commands } = await import(`../Commands/${file}/${_file}`);

                        this.commands.set(Command.name, Command)
                        console.info(`The command is registered; ./${file}/${_file}`)
                    });
                });
            });
        });
        /**
         * * We record events on discord
         */
        fs.readdir(path.join(__dirname, "../Events"), (err, files) => {
            if(err) throw err;

            files.forEach(async (file) => {
               const { Event }: { Event: Events } = await import(`../Events/${file}`);

               if(Event.once) {
                this.once(Event.name, (...args) => {
                    Event.execute(this, ...args)
                });
               } else {
                this.on(Event.name, (...args) => {
                    Event.execute(this, ...args)
                });
               }

               console.info(`The event is registered; ./${file}`)
            });
        });
        /**
         * * We record our commands (and contexts) on discord
         */
        this.once("ready", async () => {
            if(this.config.applications_commands.global) {
                rest.put(Routes.applicationCommands(this.config.discord.id), {
                    body: this.commands.toJSON(),
                }).catch((err) => console.error(`I got an error posting commands; ${err}`))
            } else {
                rest.put(Routes.applicationGuildCommands(this.config.discord.id, this.config.applications_commands.guild_id), {
                    body: this.commands.toJSON(),    
                }).catch((err) => console.error(`I got an error posting commands; ${err}`))
            }

            /**
             * * We perform the MongoDB connection
             */

            if(this.config.database.enabled) {
                 set("strictQuery", false)

                 connect(this.config.database.url).then(() => {
                     console.success(`MongoDB connection completed`)
                 }).catch((err) => {
                     console.error(`I got an error while performing a MongoDB connection; ${err}`)
                 })
             }
            });
        /**
         * * We run our commands
         */
        this.on("interactionCreate", async (interaction) => {
            if(interaction.isCommand()) {
                const cmd = this.commands.get(interaction.commandName);

                if(cmd) {
                 const userKey = `${interaction.user.id}${interaction.guild.id}`;
                 const cooldownTime = this.cooldownedUsers.get(userKey);
                 const currentDate = parseInt(`${Date.now() / 1000}`);
                 if(cooldownTime) {
                     const isExpired = cooldownTime <= currentDate;
                     const remainingSeconds = cooldownTime - currentDate;
                     if (!isExpired) {
                         interaction.reply({ content: `⏰ **|** You can use this command after \` ${remainingSeconds} \` seconds.`, ephemeral: true });
                         return;
                     }
                 } 

                cmd.execute(this, interaction);
                this.cooldownedUsers.set(userKey, 5 + currentDate);   
              }      
            }
        });
    }
}