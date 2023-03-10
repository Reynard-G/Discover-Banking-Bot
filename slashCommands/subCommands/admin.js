const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "admin",
    description: "Manage administrator commands such as the db.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: "Administrator",
    dm_permission: false,
    cooldown: 3000,
    options: [
        {
            name: "dashboard",
            description: "Overview of Discover Banking.",
            type: ApplicationCommandOptionType.Subcommand,
            cooldown: 3000,
        }
    ],
};