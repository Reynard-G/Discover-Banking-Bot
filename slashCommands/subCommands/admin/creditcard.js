const { EmbedBuilder } = require("discord.js");
const user = require("../../../utils/user.js");
const creditcards = require("../../../utils/creditcards.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
  name: "creditcard",
  run: async (client, interaction) => {
    const userDiscordID = interaction.options.getUser("user").id;

    try {
      // Defer reply to prevent interaction timeout
      await interaction.deferReply({ ephemeral: true });

      // Check if user is not registered
      if (!(await user.exists(client, interaction.user.id))) return interaction.editReply({ embeds: [await errorMessages.doesNotHaveAccount(interaction)] });

      // Check if user does not have a credit card
      const userID = await user.id(client, userDiscordID);
      if (!(await creditcards.exists(client, userID))) return interaction.editReply({ embeds: [await errorMessages.creditcardNotFound(interaction)] });

      // Get user's credit card
      const creditcardLimit = await creditcards.limit(client, userID);
      const creditcardBalance = await creditcards.balance(client, userID);

      // Send reply
      const creditcardName = await creditcards.name(client, userID);
      const formattedCreditcardLimit = creditcardLimit.toLocaleString("en-US", { style: "currency", currency: "USD" });
      const formattedCreditcardBalance = creditcardBalance.toLocaleString("en-US", { style: "currency", currency: "USD" });
      const formattedCreditcardAmountSpent = (creditcardLimit - creditcardBalance).toLocaleString("en-US", { style: "currency", currency: "USD" });
      const formattedCreditcardInterestRate = (await creditcards.interestRate(client, userID)).toLocaleString("en-US", { style: "percent" });

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Admin")
            .setDescription(`__**${creditcardName}**__\n**Limit:** ${formattedCreditcardLimit}\n**Balance:** ${formattedCreditcardBalance}\n**Amount Spent:** ${formattedCreditcardAmountSpent}\n**Interest Rate:** ${formattedCreditcardInterestRate}`)
            .setColor("#2B2D31")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Admin")
            .setDescription("An error occurred while trying to view the user's credit card. Please try again later.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};
