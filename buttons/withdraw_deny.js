const { ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  id: "withdraw_deny",
  permissions: [],
  run: async (client, interaction) => {
    try {
      // Get the transaction ID from the footer
      const transactionID = interaction.message.embeds[0].footer.text.split("#").pop();

      // Update the transaction
      await client.query("UPDATE transactions SET status = '0' WHERE id = ?", [transactionID]);

      // Get user's ID from the message
      const userID = interaction.message.embeds[0].description.split("(").pop().split(")")[0];

      // Send a message to the user
      const user = await client.users.fetch(userID);
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Withdrawal Denied")
            .setDescription(`Your withdrawal with transaction ID **#${transactionID}** has been denied.`)
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });

      // Disable the buttons
      const row = ActionRowBuilder.from(interaction.message.components[0]);
      row.components.forEach(component => {
        component.setDisabled(true);
      });

      // Update the message by grabbing the embed from the message
      const embed = EmbedBuilder.from(interaction.message.embeds[0]);
      const description = interaction.message.embeds[0].description;
      embed.setColor("Red");
      embed.setDescription(description.replace("Pending", "Denied"));

      await interaction.update({ embeds: [embed], components: [row] });
    } catch (error) {
      console.log(error);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Withdrawal Denial Failed")
            .setDescription("An error occurred while trying to deny the withdrawal. Please try again.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};