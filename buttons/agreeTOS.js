const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const user = require("../utils/user.js");
const errorMessages = require("../utils/errorMessages.js");

module.exports = {
  id: "agreeTOS",
  permissions: [],
  run: async (client, interaction) => {
    try {
      if (await user.exists(client, interaction.user.id)) return interaction.reply({ embeds: [await errorMessages.alreadyHasAccount(interaction)] });

      const registerModal = new ModalBuilder()
        .setTitle("Discover Banking Registration")
        .setCustomId("agreeTOS_modal");

      const ignInput = new TextInputBuilder()
        .setCustomId("ignInput")
        .setPlaceholder("Enter your Minecraft IGN here")
        .setStyle(TextInputStyle.Short)
        .setLabel("Minecraft IGN")
        .setMinLength(3)
        .setMaxLength(16)
        .setRequired(true);

      const ignRow = new ActionRowBuilder()
        .addComponents(ignInput);

      registerModal.addComponents(ignRow);
      await interaction.showModal(registerModal);

      // Disable the buttons
      const row = ActionRowBuilder.from(interaction.message.components[0]);
      row.components.forEach(component => {
        component.setDisabled(true);
      });
      return interaction.editReply({ components: [row] });
    } catch (error) {
      console.log(error);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Account Registration Failed")
            .setDescription("An error occurred while trying to approve the terms and conditions. Please try again.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};
