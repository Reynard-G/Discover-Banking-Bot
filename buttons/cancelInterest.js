const { EmbedBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    id: "cancelInterest",
    permissions: [],
    run: async (client, interaction) => {
        // Disable the buttons
        const row = ActionRowBuilder.from(interaction.message.components[0]);
        row.components.forEach(component => {
            component.setDisabled(true);
        });
        await interaction.update({ components: [row] });

        return interaction.followUp({
            ephemeral: true,
            embeds: [
                new EmbedBuilder()
                    .setTitle("Interest Canceled")
                    .setDescription("Successfully canceled applying interest to all accounts.")
                    .setColor("Red")
                    .setTimestamp()
                    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
            ]
        });
    }
};
