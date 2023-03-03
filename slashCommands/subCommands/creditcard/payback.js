const { EmbedBuilder } = require("discord.js");
const Decimal = require("decimal.js");
const user = require("../../../utils/user.js");
const creditcards = require("../../../utils/creditcards.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
    name: "payback",
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        const userDiscordID = interaction.options.getUser("user").id;
        const amount = interaction.options.getInteger("amount");
        const note = interaction.options.getString("note");

        // Check if user has permission to use this command
        if (!interaction.member.permissions.has("Administrator")) {
            return interaction.editReply({ embeds: [await errorMessages.noPermission(interaction)] });
        }

        // Check if user is not registered
        if (!(await user.exists(client, interaction, userDiscordID, false, true))) return;

        // Check if user doesn't have a credit card
        if (await creditcards.exists(client, userDiscordID)) {
            return interaction.editReply({ embeds: [await errorMessages.creditcardNotFound(interaction)] });
        }

        const userID = await user.id(client, userDiscordID);
        const creditcardID = await creditcards.id(client, userID);
        const fee = new Decimal(1).minus(process.env.CREDITCARD_PAYBACK_FEE);
        const amountPayedBack = new Decimal(amount).times(fee).toNumber();
        const feeAmount = new Decimal(amount).minus(amountPayedBack).toNumber();

        // Query payback user creditcard transactions
        await client.query(`INSERT INTO transactions (user_id, amount, fee, cr_dr, status, note, creditcard_id, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, amountPayedBack, feeAmount, "CR", 1, note, creditcardID, userID, userID]);

        // Send success embed
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Credit Card Payback")
                    .setDescription(`Successfully payed back **$${amountPayedBack}** to <@${userDiscordID}>'s credit card.`)
                    .setColor("2F3136")
                    .setTimestamp()
                    .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
            ]
        });
    }
};