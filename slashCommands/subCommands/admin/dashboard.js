const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "dashboard",
  run: async (client, interaction) => {
    try {
      // Defer reply to prevent interaction timeout
      await interaction.deferReply({ ephemeral: true });

      // Create a dictionary of all the credit card products and their limits
      const creditCardProducts = await client.query(`SELECT id, amount_limit FROM creditcard_products`);
      const creditCardProductsDict = {};
      for (const product of creditCardProducts) {
        creditCardProductsDict[product.id] = Number(product.amount_limit);
      }

      // Get total money borrowed from credit cards
      const creditcards = await client.query(`SELECT creditcard_product_id FROM creditcards`);
      let totalCreditCardAmountBorrowed = 0;
      for (const creditcard of creditcards) {
        totalCreditCardAmountBorrowed += creditCardProductsDict[creditcard.creditcard_product_id];
      }

      // Get total money in accounts
      const totalAccountAmountDeposited = (await client.query(`SELECT SUM(amount) FROM transactions WHERE cr_dr = "CR" AND status = 1 AND creditcard_id IS NULL`))[0]["SUM(amount)"] - (await client.query(`SELECT SUM(amount + fee) FROM transactions WHERE cr_dr = "DR" AND status = 1 AND creditcard_id IS NULL`))[0]["SUM(amount + fee)"];

      // Get total money borrowed from loans
      const totalLoanAmountBorrowed = (await client.query(`SELECT SUM(total_payable) FROM loans`))[0]["SUM(total_payable)"] ?? 0;

      // The revenue generated from fees
      const feeRevenue = Number((await client.query(`SELECT SUM(fee) FROM transactions WHERE status = 1`))[0]["SUM(fee)"]) ?? 0;

      // Number of customers
      const numberOfCustomers = (await client.query(`SELECT COUNT(*) FROM accounts`))[0]["COUNT(*)"];

      // Number of transactions
      const numberOfTransactions = (await client.query(`SELECT COUNT(*) FROM transactions`))[0]["COUNT(*)"];

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Admin Dashboard")
            .setDescription("Overview of Discover Banking.")
            .addFields(
              {
                name: "Information",
                value: `# Of Customers: ${numberOfCustomers}\n# Of Transactions: ${numberOfTransactions}\nTotal Money In Accounts: ${totalAccountAmountDeposited.toLocaleString("en-US", { style: "currency", currency: "USD" })}`
              },
              {
                name: "Borrowed Money",
                value: `Loan Money Borrowed: ${totalLoanAmountBorrowed.toLocaleString("en-US", { style: "currency", currency: "USD" })}\nCredit Card Money Borrowed: ${totalCreditCardAmountBorrowed.toLocaleString("en-US", { style: "currency", currency: "USD" })}`
              },
              {
                name: "Revenue",
                value: `Fees Revenue: ${feeRevenue.toLocaleString("en-US", { style: "currency", currency: "USD" })}`
              }
            )
            .setTimestamp()
            .setColor("#2B2D31")
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ],
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Admin Dashboard")
            .setDescription("An error occurred while trying to get data for the dashboard. Please try again later.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};
