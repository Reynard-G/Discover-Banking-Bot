const { EmbedBuilder } = require("discord.js");
const user = require("../../../utils/user.js");

module.exports = {
  name: "rename",
  run: async (client, interaction) => {
    const userDiscordID = interaction.options.getUser("user").id;
    const newUsername = interaction.options.getString("new_username");

    try {
      // Defer reply to prevent interaction timeout
      await interaction.deferReply({ ephemeral: true });

      // Check if user is not registered
      if (!(await user.exists(client, interaction.user.id))) return interaction.editReply({ embeds: [await errorMessages.doesNotHaveAccount(interaction)] });

      // Check if new username is valid (between 3 and 16 characters long and can only contain letters, numbers and underscores)
      if (!newUsername.match(/^[a-zA-Z0-9_]{3,16}$/)) return interaction.editReply({ embeds: [await errorMessages.invalidUsername(interaction)] });

      await user.rename(client, userDiscordID, newUsername);

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Admin Dashboard")
            .setDescription("Overview of Discover Banking.")
            .addFields(
              { name: "User", value: `<@${userDiscordID}>`, inline: true },
              { name: "New Username", value: newUsername, inline: true }
            )
            .setTimestamp()
            .setColor("#2B2D31")
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ],
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Admin")
            .setDescription("An error occurred while trying to rename the user. Please try again later.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};
