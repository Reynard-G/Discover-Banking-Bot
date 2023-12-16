const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const user = require("../../../utils/user.js");
const accountDetails = require("../../../utils/accountDetails.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
  name: "pay",
  run: async (client, interaction) => {
    try {
      // Defer reply to prevent interaction timeout
      await interaction.deferReply();

      // Get variables from options
      const loanID = await interaction.options.getInteger("loan_id");
      const useBalance = await interaction.options.getBoolean("use_balance");
      const note = await interaction.options.getString("note");

      // Query to db
      const loan = (await client.query("SELECT * FROM loans WHERE id = ?", [loanID]))[0];
      const loanRepayments = (await client.query("SELECT * FROM loan_repayments WHERE loan_id = ? AND status = 0", [loanID]));

      // Check if loan exists
      if (!loan) {
        return interaction.editReply({ embeds: [await errorMessages.loanNotFound(interaction)] });
      }

      // Check if loan needs to be paid
      if (!loanRepayments[0]) {
        await client.query("UPDATE loans SET status = 2 WHERE id = ?", [loanID]);
        return interaction.editReply({ embeds: [await errorMessages.loanPaid(interaction)] });
      }

      // Query to db
      let transactionID = null;
      if (useBalance) {
        if (accountDetails.balance(client, loan.user_id) < loanRepayments[0].amount) {
          interaction.editReply({ embeds: [await errorMessages.notEnoughMoney(interaction)] });
        } else {
          const res = await client.query("INSERT INTO transactions (user_id, amount, cr_dr, status, note, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [loan.user_id, loanRepayments[0].amount, "DR", 1, note, loan.user_id, loan.user_id]);
          transactionID = res.insertId;
        }
      }
      await client.query("UPDATE loan_repayments SET status = 1 WHERE id = ?", [loanRepayments[0].id]);
      await client.query("INSERT INTO loan_payments (loan_id, user_id, transaction_id, repayment_id, note) VALUES (?, ?, ?, ?, ?)", [loanID, loan.user_id, transactionID, loanRepayments[0].id, note]);

      // Send success message
      const discordID = await user.discordID(client, loan.user_id);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Loan Payment")
            .setDescription(`The payment for <@${discordID}> (${discordID}) has been submitted.`)
            .addFields(
              { name: "Loan ID", value: `#${loanID}` },
              { name: "Amount", value: `$${loanRepayments[0].amount}` },
              { name: "Scheduled Payment Date", value: moment(loanRepayments[0].payment_date, "YYYY-MM-DD").format("MMMM Do, YYYY") },
            )
            .setColor("Green")
            .setTimestamp()
            .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
        ]
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Loan Payment")
            .setDescription("An error occurred while trying to submit the payment. Please try again.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};