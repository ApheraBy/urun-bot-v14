export interface Config {
    discord: {
        token: string,
        id: string
    },
    applications_commands: {
        global: boolean,
        guild_id: string
    },
    database: {
        enabled: boolean,
        url: string
    },
    express: {
        port: number
    },
    owners: string[],
    add: string,
    remove: string
}