const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const accountDetails = require("../utils/accountDetails.js");

module.exports = {
  id: "confirmInterest",
  permissions: [],
  run: async (client, interaction) => {
    try {
      // Disable the buttons
      const row = ActionRowBuilder.from(interaction.message.components[0]);
      row.components.forEach(component => {
        component.setDisabled(true);
      });
      await interaction.update({ components: [row] });

      // Get the percentage of interest to apply
      const { percentage } = require("../slashCommands/subCommands/admin/interest.js");

      // Get all accounts
      const accounts = await client.query(`SELECT * FROM accounts`);

      // Create a variable to store the total interest
      var totalInterest = 0;

      // Apply interest to all accounts
      await Promise.all(accounts.map(async (account) => {
        const balance = await accountDetails.balance(client, account.id);
        const interest = new Decimal(balance).mul(percentage).toNumber();
        totalInterest += interest;
        await client.query(`INSERT INTO transactions (user_id, amount, cr_dr, status, note, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`, [account.id, interest, "CR", 1, "Interest", 1, 1]);
      }));

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Interest Confirmed")
            .setDescription(
              `Applied **${percentage * 100}%** interest to all accounts` +
              `\n**Total Accounts:** ${accounts.length}` +
              `\n**Total Interest:** ${totalInterest.toLocaleString("en-US", { style: "currency", currency: "USD" })}`
            )
            .setColor("Green")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    } catch (error) {
      console.log(error);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Interest Confirmation Failed")
            .setDescription("An error occurred while trying to apply interest to all accounts. Please try again.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};
