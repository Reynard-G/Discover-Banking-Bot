const { EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const user = require("../../../utils/user.js");
const creditcards = require("../../../utils/creditcards.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
  name: "payback",
  run: async (client, interaction) => {
    try {
      // Defer reply to prevent interaction timeout
      await interaction.deferReply();

      const userDiscordID = interaction.options.getUser("user").id;
      const amountPayingBack = interaction.options.getInteger("amount");
      const note = interaction.options.getString("note");

      // Check if user has permission to use this command
      if (!interaction.member.permissions.has("Administrator")) {
        return interaction.editReply({ embeds: [await errorMessages.noPermission(interaction)] });
      }

      // Check if user is not registered
      if (!(await user.exists(client, userDiscordID))) return interaction.editReply({ embeds: [await errorMessages.doesNotHaveAccount(interaction)] });

      // Check if user doesn't have a credit card
      if (await creditcards.exists(client, userDiscordID)) {
        return interaction.editReply({ embeds: [await errorMessages.creditcardNotFound(interaction)] });
      }

      const userID = await user.id(client, userDiscordID);
      const creditcardID = await creditcards.id(client, userID);
      const interestRate = await creditcards.interestRate(client, userID);

      const feeAmount = new Decimal(amountPayingBack).mul(interestRate).toDecimalPlaces(2).toNumber();
      const amountPaidBack = new Decimal(amountPayingBack).minus(feeAmount).toDecimalPlaces(2).toNumber();

      // Check if amount paid back is more than the amount owed
      const amountSpent = await creditcards.amountSpent(client, userID);
      const amountSpentIncludingInterest = new Decimal(amountSpent).mul(interestRate).add(amountSpent).toDecimalPlaces(2).toNumber();
      if (amountPaidBack > amountSpent) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Credit Card Payback")
              .setDescription(`You cannot pay back more than the user is owed. The user owes **$${amountSpentIncludingInterest}** including interest.`)
              .setColor("Red")
              .setTimestamp()
              .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
          ]
        });
      }

      // Query payback user creditcard transactions
      await client.query(`INSERT INTO transactions (user_id, amount, fee, cr_dr, status, note, creditcard_id, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userID, amountPaidBack, feeAmount, "CR", 1, note, creditcardID, userID, userID]);

      // Send success embed
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Credit Card Payback")
            .setDescription(`Successfully payed back **$${amountPaidBack}** with a fee of **$${feeAmount}** to <@${userDiscordID}>'s credit card.`)
            .setColor("#2B2D31")
            .setTimestamp()
            .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
        ]
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Credit Card Payback")
            .setDescription("An error occurred while trying to pay back to a credit card. Please try again.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};