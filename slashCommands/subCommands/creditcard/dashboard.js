const { EmbedBuilder } = require("discord.js");
const user = require("../../../utils/user.js");
const creditcards = require("../../../utils/creditcards.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
    name: "dashboard",
    run: async (client, interaction) => {
        try {
            // Defer reply to prevent interaction timeout
            await interaction.deferReply({ ephemeral: true });

            // Check if user doesn't have a credit card
            const userID = await user.id(client, interaction.user.id);
            if (!(await creditcards.exists(client, userID))) {
                return interaction.editReply({ embeds: [await errorMessages.creditcardNotFound(interaction)] });
            }

            // Send embed
            const id = await creditcards.id(client, userID);
            const balance = (await creditcards.balance(client, userID)).toLocaleString("en-US", { style: "currency", currency: "USD" });
            const limit = (await creditcards.limit(client, userID)).toLocaleString("en-US", { style: "currency", currency: "USD" });

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Credit Card Details")
                        .addFields(
                            { name: "Card ID", value: `#${id}`, inline: true },
                            { name: "Balance", value: `${balance}`, inline: true },
                            { name: "Limit", value: `${limit}`, inline: true },
                        )
                        .setColor("#2B2D31")
                        .setTimestamp()
                        .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
                ]
            });
        } catch (error) {
            console.log(error);
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Credit Card Details")
                        .setDescription("An error occurred while trying to get your credit card details. Please try again.")
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
                ]
            });
        }
    }
};