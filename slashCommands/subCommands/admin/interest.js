const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const accountDetails = require("../../../utils/accountDetails.js");

module.exports = {
  name: "interest",
  run: async (client, interaction) => {
    try {
      // Defer reply to prevent interaction timeout
      await interaction.deferReply();

      // Get the percentage of interest to apply
      const percentage = interaction.options.getNumber("percentage");

      // Get all accounts
      const accounts = await client.query(`SELECT * FROM accounts`);

      // Get estimated total interest
      const estimatedInterest = await Promise.all(accounts.map(async (account) => {
        const balance = await accountDetails.balance(client, account.id);
        return new Decimal(balance).mul(percentage).toNumber();
      })).then(interests => interests.reduce((a, b) => a + b, 0));

      // Create an embed to confirm interest
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Interest")
            .setDescription(
              `Are you sure you want to apply **${percentage * 100}%** interest to all accounts?` +
              `\n**Total Accounts:** ${accounts.length}` +
              `\n**Estimated Interest:** ${estimatedInterest.toLocaleString("en-US", { style: "currency", currency: "USD" })}`
            )
            .setColor("#2B2D31")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ],
        components: [
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId("confirmInterest")
                .setLabel("Confirm")
                .setStyle("Success")
                .setEmoji("1059331958204801065"),
              new ButtonBuilder()
                .setCustomId("cancelInterest")
                .setLabel("Cancel")
                .setStyle("Danger")
                .setEmoji("1059331996305866823")
            )
        ]
      });

      return module.exports = { percentage };
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Interest")
            .setDescription("An error occurred while applying interest to all accounts. Please try again later.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};
