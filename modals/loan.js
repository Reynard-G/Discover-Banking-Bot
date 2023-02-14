const { EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const moment = require("moment");
const user = require("../utils/user.js");
const checkApplyDetails = require("../utils/checkApplyDetails.js");
const errorMessages = require("../utils/errorMessages.js");

module.exports = {
    id: "loan_modal",
    permissions: [],
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply();

        const { userID, amount, loanProductID } = require("../slashCommands/subCommands/apply/loan.js");
        const id = await user.id(client, userID);
        const interestRate = await interaction.fields.getTextInputValue("interestRateInput");
        const firstPaymentDate = await interaction.fields.getTextInputValue("firstPaymentDateInput");
        const term = await interaction.fields.getTextInputValue("termInput");
        const termPeriod = await interaction.fields.getTextInputValue("termPeriodInput");
        const note = await interaction.fields.getTextInputValue("noteInput");

        // Check if user is not registered
        if (!(await user.exists(client, interaction, userID, false, true))) return;

        // Check if amount, interestRate, term, and termPeriod are numbers
        if (isNaN(amount) || isNaN(interestRate) || isNaN(term) || isNaN(termPeriod)) {
            return await interaction.editReply({ embeds: [await errorMessages.notANumber(interaction)] });
        }

        // Check if loan details comply with loan_product table
        if (!(await checkApplyDetails.loan(client, loanProductID, amount, interestRate))) {
            return await interaction.editReply({ embeds: [await errorMessages.invalidLoanDetails(interaction)] });
        }

        // Check if firstPaymentDate is a valid date and not in the past
        if (!moment(firstPaymentDate, "YYYY-MM-DD").isValid() || moment(firstPaymentDate, "YYYY-MM-DD").isBefore(moment(), "day")) {
            return await interaction.editReply({ embeds: [await errorMessages.invalidDate(interaction)] });
        }

        // Query information to db
        const loanID = (await client.query(`INSERT INTO loans (user_id, loan_product_id, first_payment_date, applied_amount, interest_rate, term, term_period, total_payable, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID()`, [id, loanProductID, moment(firstPaymentDate, "YYYY-MM-DD").format("YYYY-MM-DD"), amount, interestRate, term, termPeriod, Decimal(amount).mul(Decimal(interestRate).div(100).add(1)).toNumber(), note, 1]))[1][0]["LAST_INSERT_ID()"];

        // Query to loan_repayments table
        for (let i = 0; i < term; i++) {
            await client.query("INSERT INTO loan_repayments (loan_id, payment_date, amount, status) VALUES (?, ?, ?, ?)", [loanID, moment(firstPaymentDate, "YYYY-MM-DD").add(i * termPeriod, "days").format("YYYY-MM-DD"), Decimal(amount).div(term).toNumber(), 0]);
        }

        // Send success message
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Loan Application")
                    .setDescription(`The loan application for <@${userID}> (${userID}) has been submitted.`)
                    .addFields(
                        { name: "Loan ID", value: `#${loanID}`},
                        { name: "Amount", value: `$${amount}` },
                        { name: "Interest Rate", value: `${interestRate}%` },
                        { name: "First Payment Date", value: moment(firstPaymentDate, "YYYY-MM-DD").format("MMMM Do, YYYY") },
                        { name: "Term", value: `${term} payment(s)` },
                        { name: "Term Period", value: `${termPeriod} day(s)` },
                        { name: "Note", value: note.length ? note : "None" },
                        { name: "Submitted By", value: `<@${interaction.user.id}> (${interaction.user.id})` }
                    )
                    .setColor("Green")
                    .setTimestamp()
                    .setFooter({ text: `Discover Banking`, iconURL: interaction.guild.iconURL() })
            ]
        });
    }
};