const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "loan",
    description: "Manage user loans.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: "Administrator",
    dm_permission: false,
    cooldown: 3000,
    options: [
        {
            name: "pay",
            description: "Pay a loan payment.",
            type: ApplicationCommandOptionType.Subcommand,
            cooldown: 3000,
            options: [
                {
                    name: "loan_id",
                    description: "The loan ID to pay.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 1,
                },
                {
                    name: "use_balance",
                    description: "Use the user's bank balance to pay the loan.",
                    type: ApplicationCommandOptionType.Boolean,
                    required: true,
                },
                {
                    name: "note",
                    description: "A note for the payment.",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                }
            ],
        },
    ],
};