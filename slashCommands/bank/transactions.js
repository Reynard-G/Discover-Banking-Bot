const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandType } = require("discord.js");
const user = require("../../utils/user.js");
const pagedEmbed = require("../../utils/pagedEmbed.js");
const errorMessages = require("../../utils/errorMessages.js");

module.exports = {
    name: "transactions",
    description: "View your transaction history",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    cooldown: 3000,
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user is already registered
        if (!(await user.exists(client, interaction.user.id))) return interaction.editReply({ embeds: [await errorMessages.doesNotHaveAccount(interaction)] });

        const types = {
            "CR": "📈",
            "DR": "📉"
        };

        const statuses = {
            "0": "Cancelled",
            "1": "Completed",
            "2": "Pending"
        };

        // Get user's transactions
        const userID = await user.id(client, interaction.user.id);
        const transactions = await client.query(`SELECT id, amount, fee, cr_dr, status, note, UNIX_TIMESTAMP(created_at), UNIX_TIMESTAMP(updated_at) FROM transactions WHERE user_id = ? ORDER BY id DESC`, [userID]);

        // Check if user has no transactions
        if (transactions.length === 0) {
            return interaction.editReply({ embeds: [await errorMessages.noTransactionsFound(interaction)] });
        }

        // Create embed
        let embed = new EmbedBuilder()
            .setTitle("Transaction History")
            .setDescription("For privacy reasons, you can only switch between pages of your transaction history for **5 minutes.**")
            .setColor("#2B2D31")
            .setTimestamp();

        // Add fields
        let pages = [];
        for (let i = 0; i < transactions.length; i++) {
            if (i % 5 === 0 && i !== 0) {
                pages.push(embed);
                embed = new EmbedBuilder()
                    .setTitle("Transaction History")
                    .setDescription("For privacy reasons, you can only switch between pages of your transaction history for **5 minutes.**")
                    .setColor("#2B2D31")
                    .setTimestamp();
            }

            if (transactions[i]) {
                embed.addFields({
                    name: `Transaction ID: ${transactions[i]["id"]}`,
                    value: `${types[transactions[i]["cr_dr"]]} Type: ${transactions[i]["cr_dr"]}` +
                        `\nAmount: ${transactions[i]["amount"]}` +
                        `\nFee: ${transactions[i]["fee"]}` +
                        `\nNote: ${transactions[i]["note"] ?? "N/A"}` +
                        `\nStatus: ${statuses[transactions[i]["status"]]}` +
                        `\nCreated At: <t:${transactions[i]["UNIX_TIMESTAMP(created_at)"]}:F>` +
                        `\nUpdated At: <t:${transactions[i]["UNIX_TIMESTAMP(updated_at)"]}:F>`
                });
            }
        }
        pages.push(embed);

        // Create buttons
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("previous")
                    .setLabel("Previous")
                    .setStyle("Primary")
                    .setEmoji("⬅️")
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel("Next")
                    .setStyle("Primary")
                    .setEmoji("➡️")
                    .setDisabled(transactions.length <= 5)
            );

        // Send embed
        return pagedEmbed.listener(interaction, pages, buttonRow);
    }
};