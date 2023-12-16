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
    },
    {
      name: "depositors",
      description: "List of all depositors.",
      type: ApplicationCommandOptionType.Subcommand,
      cooldown: 3000,
    },
    {
      name: "creditcard",
      description: "View a user's credit card.",
      type: ApplicationCommandOptionType.Subcommand,
      cooldown: 3000,
      options: [
        {
          name: "user",
          description: "The user to view.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "interest",
      description: "Apply interest to all depositors.",
      type: ApplicationCommandOptionType.Subcommand,
      cooldown: 3000,
      options: [
        {
          name: "percentage",
          description: "Percentage of interest to apply.",
          type: ApplicationCommandOptionType.Number,
          min_value: 0,
          max_value: 1,
          required: true,
        },
      ],
    },
    {
      name: "modify",
      description: "Modify a user's balance.",
      type: ApplicationCommandOptionType.Subcommand,
      cooldown: 3000,
      options: [
        {
          name: "user",
          description: "User to modify.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "amount",
          description: "Amount to modify.",
          type: ApplicationCommandOptionType.Number,
          required: true,
        },
      ],
    },
    {
      name: "rename",
      description: "Rename a user.",
      type: ApplicationCommandOptionType.Subcommand,
      cooldown: 3000,
      options: [
        {
          name: "user",
          description: "The user to rename.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "new_username",
          description: "The new username for the user.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
};