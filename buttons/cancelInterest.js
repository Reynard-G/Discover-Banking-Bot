const { EmbedBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    id: "cancelInterest",
    permissions: [],
    run: async (client, interaction) => {
        try {
            // Disable the buttons
            const row = ActionRowBuilder.from(interaction.message.components[0]);
            row.components.forEach(component => {
                component.setDisabled(true);
            });
            await interaction.update({ components: [row] });

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Interest Canceled")
                        .setDescription("Successfully canceled applying interest to all accounts.")
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                ]
            });
        } catch (error) {
            console.log(error);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Interest Cancellation Failed")
                        .setDescription("An error occurred while trying to cancel applying interest to all accounts. Please try again.")
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                ]
            });
        }
    }
};
