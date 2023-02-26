const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const user = require("../../../utils/user.js");
const creditcards = require("../../../utils/creditcards.js");
const errorMessages = require("../../../utils/errorMessages.js");
const pagedEmbed = require("../../../utils/pagedEmbed.js");

module.exports = {
    name: "transactions",
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user doesn't have a credit card
        const userID = await user.id(client, interaction.user.id);
        if (!(await creditcards.exists(client, userID))) {
            return interaction.editReply({ embeds: [await errorMessages.creditcardNotFound(interaction)] });
        }

        // Get transactions data
        const id = await creditcards.id(client, userID);
        const transactions = await client.query(`SELECT *, UNIX_TIMESTAMP(created_at) AS created_at_unix, UNIX_TIMESTAMP(updated_at) AS updated_at_unix FROM transactions WHERE creditcard_id = ${id} ORDER BY id DESC`);

        // Check if user has no transactions
        if (transactions.length === 0) {
            return await interaction.editReply({ embeds: [await errorMessages.noTransactionsFound(interaction)] });
        }

        // Create array of embeds
        const pages = [];
        const cr_dr = {
            "CR": "📈",
            "DR": "📉"
        };

        for (let i = 0; i < transactions.length; i += 5) {
            const embed = new EmbedBuilder()
                .setTitle("Credit Card Transactions")
                .setColor("2F3136")
                .setTimestamp();

            for (let j = i; j < i + 5; j++) {
                if (transactions[j]) {
                    embed.addFields(
                        {
                            name: `Transaction #${transactions[j].id}`,
                            value: `**Amount:** ${transactions[j].amount}\n**Fee:** ${transactions[j].fee}\n**Type:** ${cr_dr[transactions[j].cr_dr]}\n**Description:** ${transactions[j].note ?? "No note provided"}\n**Created At:** <t:${transactions[j].created_at_unix}:F>\n**Updated At:** <t:${transactions[j].updated_at_unix}:F>`
                        }
                    );
                }
            }

            pages.push(embed);
        }

        // Create buttons
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("previous")
                    .setLabel("Previous")
                    .setEmoji("⬅️")
                    .setStyle("Primary")
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel("Next")
                    .setEmoji("➡️")
                    .setStyle("Primary")
                    .setDisabled(pages.length === 1)
            );

        // Send embed
        await pagedEmbed.listener(interaction, pages, buttons);
    }
};