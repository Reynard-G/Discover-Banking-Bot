const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const moment = require("moment");
const user = require("../../utils/user.js");
const accountDetails = require("../../utils/accountDetails.js");
const pagedEmbed = require("../../utils/pagedEmbed.js");

module.exports = {
    name: "dashboard",
    description: "View your bank account dashboard.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    cooldown: 3000,
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user is not registered
        if (!(await user.exists(client, interaction.user.id))) return interaction.editReply({ embeds: [await errorMessages.notRegistered(interaction)] });

        // Get user details
        const userID = await user.id(client, interaction.user.id)
        const username = await user.username(client, interaction.user.id);
        const balance = await accountDetails.balance(client, userID);
        
        // Create embeds
        let pages = [];
        pages.push(
            new EmbedBuilder()
                .setAuthor({ name: "Discover Banking Dashboard" })
                .setThumbnail("https://raw.githubusercontent.com/Reynard-G/Discover-Banking-Bot/master/assets/dashboard_Thumbnail.gif")
                .addFields(
                    { name: "Account Holder", value: username },
                    { name: "Account Number", value: interaction.user.id },
                    { name: "Balance", value: `$${balance.toLocaleString()}` },
                )
                .setColor("#2F3136")
                .setTimestamp()
        );

        // Loan details string
        let loanString = "";
        const loanDetails = await accountDetails.loanDetails(client, interaction.user.id);
        const status = {
            0: "Declined",
            1: "Approved",
            2: "Paid"
        };

        // Loop through loans
        loanDetails.forEach(loan => {
            loanString += `**Loan ID:** ${loan.id}` +
                `\n**Loan Amount:** $${loan.applied_amount.toLocaleString()}` +
                `\n**Loan Payable:** $${loan.total_payable.toLocaleString()}` +
                `\n**Loan Interest:** ${loan.interest_rate}%` +
                `\n**First Payment Date:** ${moment(loan.first_payment_date).format("YYYY-MM-DD")}` +
                `\n**Loan Term:** ${loan.term} payment(s)` +
                `\n**Loan Term Period:** ${loan.term_period} day(s)` +
                `\n**Loan Status:** ${status[loan.status]}` +
                `\n**Loan Created:** <t:${loan.created_at_unix}:F>` +
                `\n**Loan Updated:** <t:${loan.updated_at_unix}:F>\n\n`;
        });
        loanDetails.length === 0 ? loanString = null : loanString;

        pages.push(
            new EmbedBuilder()
                .setAuthor({ name: "Discover Banking Dashboard" })
                .setThumbnail("https://raw.githubusercontent.com/Reynard-G/Discover-Banking-Bot/master/assets/dashboard_Thumbnail.gif")
                .addFields(
                    { name: "Loans", value: loanString ?? "None" },
                )
                .setColor("#2F3136")
                .setTimestamp()
        );

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
                    .setDisabled(loanDetails.length <= 0)
            );

        return pagedEmbed.listener(interaction, pages, buttonRow);
    }
};