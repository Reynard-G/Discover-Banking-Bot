const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "loan",
    run: async (client, interaction) => {
        const userID = await interaction.options.getUser("user").id;
        const amount = await interaction.options.getNumber("amount");
        const loanProductID = await interaction.options.getString("type");

        // Create a modal
        const modal = new ModalBuilder()
            .setTitle("Loan Application")
            .setCustomId("loan_modal");

        const interestRateInput = new TextInputBuilder()
            .setCustomId("interestRateInput")
            .setPlaceholder("Enter the interest rate here")
            .setStyle(TextInputStyle.Short)
            .setLabel("Interest Rate")
            .setRequired(true);

        const firstPaymentDateInput = new TextInputBuilder()
            .setCustomId("firstPaymentDateInput")
            .setPlaceholder("Enter the first payment date here. EX: YYYY-MM-DD")
            .setStyle(TextInputStyle.Short)
            .setLabel("First Payment Date")
            .setRequired(true);

        const termInput = new TextInputBuilder()
            .setCustomId("termInput")
            .setPlaceholder("Enter # of payments for the loan. EX: 6 (6 payments).")
            .setStyle(TextInputStyle.Short)
            .setLabel("Term")
            .setRequired(true);

        const termPeriodInput = new TextInputBuilder()
            .setCustomId("termPeriodInput")
            .setPlaceholder("Enter the # of DAYS between payments. EX: 30 (30 days)")
            .setStyle(TextInputStyle.Short)
            .setLabel("Term Period")
            .setRequired(true);

        const note = new TextInputBuilder()
            .setCustomId("noteInput")
            .setPlaceholder("Enter a note here")
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Note")
            .setRequired(false);

        const interestRateRow = new ActionRowBuilder().addComponents(interestRateInput);
        const firstPaymentDateRow = new ActionRowBuilder().addComponents(firstPaymentDateInput);
        const termRow = new ActionRowBuilder().addComponents(termInput);
        const termPeriodRow = new ActionRowBuilder().addComponents(termPeriodInput);
        const noteRow = new ActionRowBuilder().addComponents(note);

        modal.addComponents(interestRateRow, firstPaymentDateRow, termRow, termPeriodRow, noteRow);
        await interaction.showModal(modal);

        return module.exports = { userID, amount, loanProductID };
    }
};