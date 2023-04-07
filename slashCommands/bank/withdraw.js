const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const Decimal = require("decimal.js");
const user = require("../../utils/user.js");
const accountDetails = require("../../utils/accountDetails.js");
const parseConfig = require("../../utils/parseConfig.js");
const errorMessages = require("../../utils/errorMessages.js");

module.exports = {
    name: "withdraw",
    description: "Withdraw money from your bank account.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    cooldown: 3000,
    options: [
        {
            name: "amount",
            description: "The amount of money you want to withdraw.",
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            // Defer reply to prevent interaction timeout
            await interaction.deferReply({ ephemeral: true });

            const amount = await interaction.options.getInteger("amount");

            // Check if user is not registered
            if (!(await user.exists(client, interaction.user.id))) return interaction.editReply({ embeds: [await errorMessages.doesNotHaveAccount(interaction)] });

            // Check if user has enough money in their bank account
            const userID = await user.id(client, interaction.user.id);
            if (amount > await accountDetails.balance(client, userID)) {
                return interaction.editReply({
                    embeds: [await errorMessages.notEnoughMoney(interaction)]
                });
            }

            const fee = await parseConfig.getFees("WITHDRAW_FEE", amount);
            const feeAmount = new Decimal(amount).times(fee).toNumber();
            const amountWithdrawed = new Decimal(amount).minus(feeAmount).toNumber();
            const username = await user.username(client, interaction.user.id);
            const channelID = await parseConfig.get("REQUESTS_CHANNEL_ID");
            const channel = await client.channels.fetch(channelID);

            // Store pending withdraw to MySQL database & download attachment
            const res = await client.query(`INSERT INTO transactions (user_id, amount, fee, cr_dr, status, note, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [userID, amountWithdrawed, feeAmount, "DR", 2, `Withdrawal of $${amount}`, userID, userID]);
            const withdrawID = res.insertId;

            // Send withdrawal request embed to current channel and request channel
            const withdrawRequestEmbed = new EmbedBuilder()
                .setTitle("Withdrawal Request")
                .setDescription(
                    `**User:** ${username} (${interaction.user.id})` +
                    `\n**Amount:** $${amountWithdrawed.toLocaleString()}` +
                    `\n**Fee:** $${feeAmount.toLocaleString()}` +
                    `\n**Type:** Withdrawal` +
                    `\n**Status:** Pending` +
                    `\n**Total:** $${amount.toLocaleString()}`
                )
                .setColor("#2B2D31")
                .setTimestamp()
                .setFooter({ text: `Discover Banking • Transaction ID #${withdrawID}`, iconURL: interaction.guild.iconURL() });

            const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("withdraw_approve")
                        .setLabel("Approve")
                        .setStyle("Success")
                        .setEmoji("1059331958204801065"),
                    new ButtonBuilder()
                        .setCustomId("withdraw_deny")
                        .setLabel("Deny")
                        .setStyle("Danger")
                        .setEmoji("1059331996305866823")
                );

            const successEmbed = new EmbedBuilder()
                .setTitle("Withdrawal Request")
                .setDescription(`Your withdrawal request has been successfully sent to staff for review.`)
                .setColor("#2B2D31")
                .setTimestamp()
                .setFooter({ text: `Discover Banking • Transaction ID #${withdrawID}`, iconURL: interaction.guild.iconURL() });


            const receivingUser = await client.users.fetch(interaction.user.id);

            await receivingUser.send({ embeds: [withdrawRequestEmbed] });
            await channel.send({ embeds: [withdrawRequestEmbed], components: [buttonRow] });
            return interaction.editReply({ embeds: [successEmbed] });
        } catch (error) {
            console.log(error);
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Withdrawal Request")
                        .setDescription(`An error occurred while processing your request. Please try again later.`)
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: `Discover Banking`, iconURL: interaction.guild.iconURL() })
                ]
            });
        }
    }
};