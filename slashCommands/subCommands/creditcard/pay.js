const { EmbedBuilder } = require("discord.js");
const creditcards = require("../../../utils/creditcards.js");
const user = require("../../../utils/user.js");
const errorMessages = require("../../../utils/errorMessages.js");

module.exports = {
    name: "pay",
    run: async (client, interaction) => {
        try {
            // Defer reply to prevent interaction timeout
            await interaction.deferReply();

            // Get variables from options
            const receivingUserID = await interaction.options.getUser("user").id;
            const receivingAccountID = await user.id(client, receivingUserID);
            const amount = await interaction.options.getInteger("amount");
            const note = await interaction.options.getString("note");

            // Check if sending account exists
            if ((await client.query(`SELECT * FROM accounts WHERE id = "${receivingAccountID}"`)).length === 0) {
                return interaction.editReply({ embeds: [await errorMessages.invalidAccountID(interaction)] });
            }

            // Check if creditcard has enough balance
            const userID = await user.id(client, interaction.user.id);
            if ((await creditcards.balance(client, userID)) < amount) {
                return interaction.editReply({ embeds: [await errorMessages.insufficientCreditcardBalance(interaction)] });
            }

            // Check if user is sending to themselves
            if (receivingAccountID == userID) {
                return interaction.editReply({
                    embeds: [await errorMessages.forbiddenUserMentioned(interaction)]
                });
            }

            // Query transaction
            await client.query(`INSERT INTO transactions (user_id, amount, cr_dr, status, note, creditcard_id, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [userID, amount, "DR", 1, note, await creditcards.id(client, userID), userID, userID]);
            await client.query(`INSERT INTO transactions (user_id, amount, cr_dr, status, note, creditcard_id, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [receivingAccountID, amount, "CR", 1, note, null, userID, userID]);

            // Send the receiving account transaction embed
            const receivingDiscordID = (await client.query(`SELECT discord_id FROM accounts WHERE id = ${receivingAccountID}`))[0]["discord_id"].toString();
            const receivingUser = await client.users.fetch(receivingDiscordID);
            await receivingUser.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Credit Card Payment Received")
                        .setDescription(`You have received a payment of **$${amount}** from <@${interaction.user.id}> ||(${interaction.user.id})||!`)
                        .addFields(
                            { name: "Note", value: note ?? "No note provided" }
                        )
                        .setColor("Green")
                        .setTimestamp()
                        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                ]
            });

            // Send the sending account transaction embed
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Credit Card Payment Sent")
                        .setDescription(`You have sent a payment of **$${amount}** to <@${receivingDiscordID}> ||(${receivingDiscordID})||!`)
                        .addFields(
                            { name: "Note", value: note ?? "No note provided" }
                        )
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
                        .setTitle("Credit Card Payment")
                        .setDescription("An error occurred while trying to send a payment. Please try again.")
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                ]
            });
        }
    }
};