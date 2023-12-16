const { EmbedBuilder } = require("discord.js");
const user = require("../../../utils/user.js");
const creditcards = require("../../../utils/creditcards.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
  name: "creditcard",
  autocomplete: async (client, interaction) => {
    const focusedValue = interaction.options.getFocused();
    const products = await client.query("SELECT id, name FROM creditcard_products");
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(focusedValue.toLowerCase()));

    await interaction.respond(
      filteredProducts.map((product) => ({ name: product.name, value: product.id.toString() }))
    );
  },
  run: async (client, interaction) => {
    try {
      // Defer reply to prevent interaction timeout
      await interaction.deferReply();

      // Get the user ID and credit card ID
      const userDiscordID = await interaction.options.getUser("user").id;
      const creditcardID = await interaction.options.getString("creditcard");
      const userID = await user.id(client, userDiscordID);

      // Check if the user does not exist
      if (!(await user.exists(client, userDiscordID))) return interaction.editReply({ embeds: [await errorMessages.doesNotHaveAccount(interaction)] });

      // Check if the user has a creditcard
      const creditcard = await client.query("SELECT * FROM creditcards WHERE user_id = ?", [userID]);
      if (creditcard.length > 0) {
        return interaction.editReply({ embeds: [await errorMessages.alreadyHasCreditcard(interaction)] });
      }

      // Query creditcard to user
      const creditcard_id = (await client.query("INSERT INTO creditcards (user_id, creditcard_product_id, status) VALUES (?, ?, ?)",
        [userID, creditcardID, 1])).insertId;

      // Give user money from creditcard
      const creditcardLimit = await creditcards.limit(client, userID);
      await client.query("INSERT INTO transactions (user_id, amount, cr_dr, status, note, creditcard_id, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [userID, creditcardLimit, "CR", 1, "Creditcard Balance", creditcard_id, userID, userID]);

      // Send success message
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Creditcard Applied`)
            .setDescription(`<@${userDiscordID}> has successfully applied for a creditcard.`)
            .setColor("Green")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Creditcard Application Error")
            .setDescription("An error occurred while applying for a creditcard. Please try again later.")
            .setColor("Red")
            .setTimestamp()
            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
        ]
      });
    }
  }
};