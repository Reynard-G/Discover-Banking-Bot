const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const user = require("../../../utils/user.js");
const pagedEmbed = require("../../../utils/pagedEmbed.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
    name: "details",
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Get loanID from options
        const loanID = await interaction.options.getInteger("loan_id");

        // Get loan from database
        const loanDetails = (await client.query("SELECT *, UNIX_TIMESTAMP(created_at) AS created_at_unix, UNIX_TIMESTAMP(updated_at) AS updated_at_unix FROM loans WHERE id = ?", [loanID]))[0];

        // Check if loan exists
        if (!loanDetails) {
            return interaction.editReply({ embeds: [await errorMessages.loanNotFound(interaction)] });
        }

        // Check if user owns the loan or is an admin
        if (await user.discordID(client, loanDetails.user_id) !== interaction.user.id && !interaction.member.permissions.has("Administrator")) {
            return interaction.editReply({ embeds: [await errorMessages.insufficientPermission(interaction)] });
        }

        // Get loan product details & loan repayment details
        const loanProductDetails = (await client.query("SELECT * FROM loan_products WHERE id = ?", [loanDetails.loan_product_id]))[0];
        const loanRepaymentDetails = (await client.query("SELECT *, UNIX_TIMESTAMP(payment_date) AS payment_date_unix, UNIX_TIMESTAMP(created_at) AS created_at_unix, UNIX_TIMESTAMP(updated_at) AS updated_at_unix FROM loan_repayments WHERE loan_id = ?", [loanID]));

        // Loan details embed
        let loanDetailsPages = [];
        loanDetailsPages.push(new EmbedBuilder()
            .setTitle(`Loan Details`)
            .setDescription(
                `**Loan ID:** ${loanDetails.id}` +
                `\n**Loan Product:** ${loanProductDetails.name}` +
                `\n**Amount:** ${loanDetails.applied_amount}` +
                `\n**Interest Rate:** ${loanDetails.interest_rate}` +
                `\n**Loan Term:** ${loanDetails.term}` +
                `\n**Loan Term Period:** ${loanDetails.term_period}` +
                `\n**Loan Status:** ${loanDetails.status}` +
                `\n**Created at:** <t:${loanDetails.created_at_unix}:F>` +
                `\n**Updated at:** <t:${loanDetails.updated_at_unix}:F>`
            )
            .setColor("2F3136")
            .setTimestamp()
        );

        // Loan repayment details embed
        const statuses = {
            0: ["pending", "1078460353752612925"],
            1: ["paid", "1059331958204801065"]
        };

        let loanRepaymentString = "";
        for (let i = 0; i < loanRepaymentDetails.length; i++) {
            const loanRepayment = loanRepaymentDetails[i];
            loanRepaymentString += `**Repayment ID:** ${loanRepayment.id}\n**Repayment Date:** <t:${loanRepayment.payment_date_unix}:D>\n**Amount:** ${loanRepayment.amount}\n**Status:** <a:${statuses[loanRepayment.status][0]}:${statuses[loanRepayment.status][1]}>\n**Created at:** <t:${loanRepayment.created_at_unix}:F>\n**Updated at:** <t:${loanRepayment.updated_at_unix}:F>\n\n`;

            if (i % 5 === 0 && i !== 0) {
                loanDetailsPages.push(new EmbedBuilder()
                    .setTitle(`Loan Repayment Details`)
                    .setDescription(`${loanRepaymentString}`)
                    .setColor("2F3136")
                    .setTimestamp()
                );
                loanRepaymentString = "";
            }
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
                    .setDisabled(loanDetailsPages.length === 1)
            );

        // Send loan details embed
        await pagedEmbed.listener(interaction, loanDetailsPages, buttons);
    }
};