const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "creditcard",
  description: "Manage your credit card.",
  type: ApplicationCommandType.ChatInput,
  dm_permission: false,
  cooldown: 3000,
  options: [
    {
      name: "dashboard",
      description: "View your credit card dashboard.",
      type: ApplicationCommandOptionType.Subcommand,
      cooldown: 3000,
    },
    {
      name: "transactions",
      description: "View your credit card transactions.",
      type: ApplicationCommandOptionType.Subcommand,
      cooldown: 3000,
    },
    {
      name: "pay",
      description: "Pay people with your credit card.",
      type: ApplicationCommandOptionType.Subcommand,
      cooldown: 3000,
      options: [
        {
          name: "user",
          description: "The user to pay.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "amount",
          description: "The amount to pay.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
        },
        {
          name: "note",
          description: "A note for the creditcard payment.",
          type: ApplicationCommandOptionType.String,
          required: false,
        }
      ],
    },
    {
      name: "payback",
      description: "Pay back your credit card debt.",
      type: ApplicationCommandOptionType.Subcommand,
      cooldown: 3000,
      options: [
        {
          name: "user",
          description: "The user to pay back for.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "amount",
          description: "The amount to pay back.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
        },
        {
          name: "note",
          description: "A note for the creditcard payback payment.",
          type: ApplicationCommandOptionType.String,
          required: false,
        }
      ],
    },
  ],
};