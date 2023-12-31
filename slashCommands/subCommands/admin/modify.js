const { EmbedBuilder } = require("discord.js");
const user = require("../../../utils/user.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
  name: "modify",
  run: async (client, interaction) => {
    const userDiscordID = interaction.options.getUser("user").id;
    const amount = interaction.options.getNumber("amount");

    try {
      // Defer reply to prevent interaction timeout
      await interaction.deferReply({ ephemeral: true });

      // Check if user is not registered
      if (!(await user.exists(client, interaction.user.id))) return interaction.editReply({ embeds: [await errorMessages.doesNotHaveAccount(interaction)] });

      // Check if amount is 0
      if (amount === 0) return interaction.editReply({ embeds: [await errorMessages.invalidAmount(interaction)] });

      const userID = await user.id(client, userDiscordID);
      const transactionType = amount > 0 ? "CR" : "DR";
      const transactionAmount = Math.abs(amount);
      const note = `Admin modified balance by ${amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}`;

      await client.query(`INSERT INTO transactions (user_id, amount, cr_dr, status, note, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userID, transactionAmount, transactionType, 1, note, userID, userID]);

      // Send confirmation message
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Admin Dashboard")
            .setDescription("Overview of Discover Banking.")
            .addFields(
              { name: "User", value: `<@${userDiscordID}>` },
              { name: "Amount", value: amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              { name: "Transaction Type", value: transactionType },
              { name: "Note", value: note }
            )
            .setTimestamp()
            .setColor("#2B2D31")
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ],
      });

      // Send log message to admin-audit channel
      const logChannel = await client.channels.fetch(process.env.ADMIN_AUDIT_CHANNEL);
      return logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Admin Modified Balance")
            .addFields(
              { name: "User", value: `<@${userDiscordID}>` },
              { name: "Amount", value: amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              { name: "Transaction Type", value: transactionType },
              { name: "Note", value: note }
            )
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
            .setDescription("An error occurred while trying to modify the user's balance. Please try again later.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};
