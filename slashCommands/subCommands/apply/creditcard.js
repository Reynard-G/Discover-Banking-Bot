const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const user = require("../../../utils/user.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
    name: "creditcard",
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply();

        // Get the user ID and credit card ID
        const userDiscordID = await interaction.options.getUser("user").id;
        const creditcardID = await interaction.options.getString("creditcard");
        const userID = await user.id(client, userDiscordID);

        // Check if the user does not exist
        if (!(await user.exists(client, interaction, userDiscordID, false))) return;

        // Check if the user has the same credit card already
        const creditcard = await client.query("SELECT * FROM creditcards WHERE user_id = ? AND creditcard_product_id = ?", [userID, creditcardID]);
        if (creditcard.length > 0) {
            return await interaction.editReply({ embeds: [await errorMessages.alreadyHasCreditcard(interaction)] });
        }

        // Query creditcard to user
        await client.query("INSERT INTO creditcards (user_id, creditcard_product_id, status) VALUES (?, ?, ?)", [userID, creditcardID, 1]);

        // Send success message
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Creditcard Applied`)
                    .setDescription(`<@${userDiscordID}> has successfully applied for a creditcard.`)
                    .setColor("Green")
                    .setTimestamp()
                    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
            ]
        });
    }
};