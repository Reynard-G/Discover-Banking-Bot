const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const Decimal = require("decimal.js");
const user = require("../../utils/user.js");
const accountDetails = require("../../utils/accountDetails.js");
const errorMessages = require("../../utils/errorMessages.js");

module.exports = {
    name: "transfer",
    description: "Transfer money to another user.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    cooldown: 3000,
    options: [
        {
            name: "user",
            description: "The user you want to send money to.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "amount",
            description: "The amount of money you want to send.",
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            required: true
        }
    ],
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        const receivingUserDiscordID = await interaction.options.getUser("user").id;
        const receivingUserID = await user.id(client, receivingUserDiscordID);
        const amount = await interaction.options.getInteger("amount");

        // Check if user is not registered
        if (!(await user.exists(client, interaction.user.id))) return interaction.editReply({ embeds: [await errorMessages.doesNotHaveAccount(interaction)] });

        // Check if user is trying to send himself money or the bot
        if (receivingUserDiscordID === interaction.user.id || receivingUserDiscordID === client.user.id) return interaction.editReply({ embeds: [await errorMessages.forbiddenUserMentioned(interaction)] });

        // Check if user is trying to send money to a user that is not registered
        if (!(await user.exists(client, receivingUserDiscordID))) return interaction.editReply({ embeds: [await errorMessages.receivingUserDoesNotHaveAccount(interaction)] });

        // Check if user has enough money
        const userID = await user.id(client, interaction.user.id);
        const balance = await accountDetails.balance(client, userID);
        if (balance < amount) return interaction.editReply({ embeds: [await errorMessages.notEnoughMoney(interaction)] });

        // Transfer funds
        require('dotenv').config();
        const fee = new Decimal(1).minus(process.env.TRANSFER_FEE);
        const amountReceived = new Decimal(amount).times(fee).toNumber();
        const feeAmount = new Decimal(amount).minus(amountReceived).toNumber();
        await client.query(`INSERT INTO transactions (user_id, amount, fee, cr_dr, status, note, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [userID, amount, feeAmount, "DR", 1, "Transfer to " + await user.username(client, receivingUserDiscordID), userID, userID]);
        await client.query(`INSERT INTO transactions (user_id, amount, fee, cr_dr, status, note, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [receivingUserID, amountReceived, 0, "CR", 1, "Transfer from " + await user.username(client, interaction.user.id), userID, userID]);

        // Send receiving user a message
        const receivingUser = await client.users.fetch(receivingUserDiscordID);
        await receivingUser.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You have received a transfer")
                    .setDescription(`You have received **$${amountReceived}** from **${await user.username(client, interaction.user.id)}**.`)
                    .setColor("Green")
                    .setTimestamp()
                    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
            ]
        }).then(() => {
            console.log(`Sent transfer message to ${receivingUser.tag} from ${interaction.user.tag}.`);
        });

        // Send confirmation message
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Transfer Successful")
                    .setDescription(`You have successfully transferred **$${amountReceived}** to **${await user.username(client, receivingUserDiscordID)}**.`)
                    .setColor("Green")
                    .setTimestamp()
                    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
            ]
        });
    }
};