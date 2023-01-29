const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { userExists } = require("../utils/checkUser");

module.exports = {
    id: "agreeTOS",
    permissions: [],
    run: async (client, interaction) => {
        if (await userExists(client, interaction, interaction.user.id, true, false)) return;

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
        return await interaction.editReply({
            components: [row]
        });
    }
};
