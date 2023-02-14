const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "apply",
    description: "Apply for a service.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: "Administrator",
    dm_permission: false,
    cooldown: 3000,
    options: [
        {
            name: "creditcard",
            description: "Apply for a credit card.",
            type: ApplicationCommandOptionType.Subcommand,
            cooldown: 3000,
        },
        {
            name: "loan",
            description: "Apply for a loan.",
            type: ApplicationCommandOptionType.Subcommand,
            cooldown: 3000,
            options: [
                {
                    name: "user",
                    description: "The user to apply for a loan for.",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "amount",
                    description: "The amount of the loan.",
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                    min_value: 1,
                },
                {
                    name: "type",
                    description: "The type of loan to apply for.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "Mortgage Loan",
                            value: "1",
                        },
                        {
                            name: "Business Loan",
                            value: "2",
                        },
                        {
                            name: "Personal Loan",
                            value: "3",
                        },
                    ],
                },
            ],
        },
    ],
};