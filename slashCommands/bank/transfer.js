const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const Decimal = require("decimal.js");
const { userExists } = require("../../utils/checkUser.js");
const { getBalance, getAccountUsername } = require("../../utils/accountDetails.js");

module.exports = {
    name: "transfer",
    description: "Transfer money to another user.",
    type: ApplicationCommandType.ChatInput,
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
            required: true
        }
    ],
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        const receivingUserID = await interaction.options.getUser("user").id
        const amount = await interaction.options.getInteger("amount");

        // Check if user is not registered
        if (!(await userExists(client, interaction, interaction.user.id, false, true))) return;

        // Check if user is trying to send himself money or the bot
        if (receivingUserID === interaction.user.id || receivingUserID === client.user.id) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Transfer Failed")
                        .setDescription("You can't send money to this user.")
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                ]
            });
        }

        // Check if user is trying to send money to a user that is not registered
        if (!(await userExists(client, interaction, receivingUserID, false, true))) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Transfer Failed")
                        .setDescription("This user is not registered with us. Please ask them to register with \`/register\` in order to continue.")
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                ]
            });
        }

        // Check if user has enough money
        const balance = await getBalance(client, interaction.user.id);
        if (balance < amount) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Transfer Failed")
                        .setDescription("You don't have enough money to send. You can check your balance with \`/dashboard\`.")
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                ]
            });
        }

        // Check if user is trying to send negative or zero money
        if (amount <= 0) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Transfer Failed")
                        .setDescription("You can't send negative money.")
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                ]
            });
        }

        // Transfer funds
        require('dotenv').config();
        const fee = new Decimal(1).minus(process.env.TRANSFER_FEE);
        const amountReceived = new Decimal(amount).times(fee).toNumber();
        const feeAmount = new Decimal(amount).minus(amountReceived).toNumber();
        await client.query(`INSERT INTO transactions (user_id, amount, fee, cr_dr, status, note, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [interaction.user.id, amount, feeAmount, "DR", 1, "Transfer to " + await getAccountUsername(client, receivingUserID), interaction.user.id, interaction.user.id]);
        await client.query(`INSERT INTO transactions (user_id, amount, fee, cr_dr, status, note, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [receivingUserID, amountReceived, feeAmount, "CR", 1, "Transfer from " + await getAccountUsername(client, interaction.user.id), interaction.user.id, interaction.user.id]);

        // Send receiving user a message
        const receivingUser = await client.users.fetch(receivingUserID);
        await receivingUser.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("You have received a transfer")
                    .setDescription(`You have received **$${amountReceived}** from **${await getAccountUsername(client, interaction.user.id)}**.`)
                    .setColor("Green")
                    .setTimestamp()
                    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
            ]
        }).then(() => {
            console.log(`Sent transfer message to ${receivingUser.tag} from ${interaction.user.tag}.`);
        });

        // Send confirmation message
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Transfer Successful")
                    .setDescription(`You have successfully transferred **$${amountReceived}** to **${await getAccountUsername(client, receivingUserID)}**.`)
                    .setColor("Green")
                    .setTimestamp()
                    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
            ]
        });
    }
};