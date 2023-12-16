const { ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  id: "deposit_approve",
  permissions: [],
  run: async (client, interaction) => {
    try {
      // Get the transaction ID from the footer
      const transactionID = interaction.message.embeds[0].footer.text.split("#").pop();

      // Update the transaction
      await client.query("UPDATE transactions SET status = '1' WHERE id = ?", [transactionID]);

      // Get user's ID from the message
      const userID = interaction.message.embeds[0].description.split("(").pop().split(")")[0];

      // Send a message to the user
      const user = await client.users.fetch(userID);
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Deposit Approved")
            .setDescription(`Your deposit with transaction ID **#${transactionID}** has been approved.`)
            .setColor("Green")
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
      embed.setColor("Green");
      embed.setDescription(description.replace("Pending", "Approved"));

      await interaction.update({ embeds: [embed], components: [row], files: [] });
    } catch (error) {
      console.log(error);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Deposit Approval Failed")
            .setDescription("An error occurred while trying to approve the deposit. Please try again.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};