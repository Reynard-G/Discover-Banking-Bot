const { ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    id: "withdraw_approve",
    permissions: [],
    run: async (client, interaction) => {
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
                    .setTitle("Withdrawal Approved")
                    .setDescription(`Your withdrawal with transaction ID **#${transactionID}** has been approved.`)
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

        await interaction.update({ embeds: [embed], components: [row] });
    }
};