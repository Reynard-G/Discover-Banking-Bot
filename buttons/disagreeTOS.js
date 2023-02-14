const { ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    id: "disagreeTOS",
    permissions: [],
    run: async (client, interaction) => {
        // Disable the buttons
        const row = ActionRowBuilder.from(interaction.message.components[0]);
        row.components.forEach(component => {
            component.setDisabled(true);
        });
        await interaction.update({ components: [row] });

        return await interaction.followUp({
            ephemeral: true,
            embeds: [
                new EmbedBuilder()
                    .setTitle("Discover Banking - Terms of Service")
                    .setDescription("You have declined the terms and conditions. If you have any questions regarding the terms and conditions, please contact a member of staff by opening a ticket.")
                    .setColor("Red")
                    .setTimestamp()
                    .setFooter({ text: "Discover Banking", iconUrl: interaction.guild.iconURL() })
            ],
        });
    }
};