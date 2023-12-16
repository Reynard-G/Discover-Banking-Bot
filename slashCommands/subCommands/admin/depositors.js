const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const accountDetails = require("../../../utils/accountDetails.js");
const pagedEmbed = require("../../../utils/pagedEmbed.js");

module.exports = {
  name: "depositors",
  run: async (client, interaction) => {
    try {
      // Defer reply to prevent interaction timeout
      await interaction.deferReply({ ephemeral: true });

      // Get all the accounts
      const accounts = await client.query(`SELECT * FROM accounts`);

      // Get all balances of all accounts & format them with account id, discord_id, username, and balance
      const balances = await Promise.all(accounts.map(async (account) => {
        return {
          id: account.id,
          discord_id: account.discord_id,
          username: account.username,
          balance: await accountDetails.balance(client, account.id),
        };
      }));

      // Create a new embed for each page
      const pages = [];
      for (let i = 0; i < balances.length; i += 10) {
        const page = new EmbedBuilder()
          .setTitle("Discover Banking Depositors")
          .setColor("#FF6000")
          .setTimestamp();

        for (let j = i; j < i + 10; j++) {
          if (balances[j]) {
            page.addFields({
              name: `__${balances[j].username}__`,
              value: `**Discord ID:** <@${balances[j].discord_id}> ` +
                `\n**Account ID:** ${balances[j].id}` +
                `\n**Balance:** $${balances[j].balance.toLocaleString("en-US", { stye: "currency", currency: "USD" })}`
            });
          }
        }
        pages.push(page);
      }

      // Create buttons to navigate through pages
      const buttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Previous")
            .setStyle("Primary")
            .setEmoji("⬅️")
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle("Primary")
            .setEmoji("➡️")
            .setDisabled(pages.length === 1),
        );

      // Send the embed
      return pagedEmbed.listener(interaction, pages, buttons);
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Discover Banking Depositors")
            .setDescription("An error occurred while trying to get the list of depositors. Please try again later.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};
