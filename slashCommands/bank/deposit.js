const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const Decimal = require("decimal.js");
const user = require("../../utils/user.js");
const accountDetails = require("../../utils/accountDetails.js");
const errorMessages = require("../../utils/errorMessages.js");
const attachment = require("../../utils/attachment.js");

module.exports = {
    name: "deposit",
    description: "Deposit money into your bank account.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    cooldown: 3000,
    options: [
        {
            name: "amount",
            description: "The amount of money you want to deposit.",
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            required: true
        },
        {
            name: "screenshot",
            description: "The screenshot of your deposit.",
            type: ApplicationCommandOptionType.Attachment,
            required: true
        }
    ],
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        const amount = await interaction.options.getInteger("amount");
        const screenshot = await interaction.options.getAttachment("screenshot");

        // Check if user is not registered
        if (!(await user.exists(client, interaction, interaction.user.id, false, true))) return;

        // Check if attachment is image
        if (!(await attachment.isImage(screenshot))) {
            return interaction.editReply({
                embeds: [await errorMessages.notAnImage(interaction)]
            });
        }

        // Limit image size to 8MB
        if (screenshot.size > 8388608) {
            return interaction.editReply({
                embeds: [await errorMessages.imageTooLarge(interaction)]
            });
        }

        const fee = new Decimal(1).minus(process.env.DEPOSIT_FEE);
        const amountDeposited = new Decimal(amount).times(fee).toNumber();
        const feeAmount = new Decimal(amount).minus(amountDeposited).toNumber();
        const username = await accountDetails.username(client, interaction.user.id);
        const channel = await client.channels.fetch(process.env.REQUESTS_CHANNEL_ID);
        const attachmentFormat = screenshot.contentType.split("/").pop();
        const currentUnixMilliseconds = new Date().getTime();
        const userID = await user.id(client, interaction.user.id);

        // Store pending deposit to MySQL database & download attachment
        const depositID = (await client.query(`INSERT INTO transactions (user_id, amount, fee, cr_dr, status, note, attachment, created_user_id, updated_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID()`, [userID, amountDeposited, feeAmount, "CR", 2, `Deposit of $${amount}`, `deposit_${currentUnixMilliseconds}.${attachmentFormat}`, userID, userID]))[1][0]["LAST_INSERT_ID()"];
        await attachment.download(screenshot.url, `./attachments/deposit_${currentUnixMilliseconds}.${attachmentFormat}`)
            .catch(async (error) => {
                console.log(error),
                await interaction.editReply({
                    embeds: [await errorMessages.errorOccurred(interaction, error)]
                });
            });

        // Send deposit request embed to current channel and request channel
        const depositRequestEmbed = new EmbedBuilder()
            .setTitle("Deposit Request")
            .setDescription(
                `**User:** ${username} (${interaction.user.id})` +
                `\n**Amount:** $${amountDeposited.toLocaleString()}` +
                `\n**Fee:** $${feeAmount.toLocaleString()}` +
                `\n**Type:** Deposit` +
                `\n**Status:** Pending` +
                `\n**Total:** $${amount.toLocaleString()}`
            )
            .setImage(`attachment://deposit_${currentUnixMilliseconds}.${attachmentFormat}`)
            .setColor("2F3136")
            .setTimestamp()
            .setFooter({ text: `Discover Banking • Transaction ID #${depositID}`, iconURL: interaction.guild.iconURL() });

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("deposit_approve")
                    .setLabel("Approve")
                    .setStyle("Success")
                    .setEmoji("1059331958204801065"),
                new ButtonBuilder()
                    .setCustomId("deposit_deny")
                    .setLabel("Deny")
                    .setStyle("Danger")
                    .setEmoji("1059331996305866823")
            );

        const successEmbed = new EmbedBuilder()
            .setTitle("Deposit Request")
            .setDescription(`Your deposit request has been successfully sent to staff for review.`)
            .setColor("2F3136")
            .setTimestamp()
            .setFooter({ text: `Discover Banking • Transaction ID #${depositID}`, iconURL: interaction.guild.iconURL() });

        const receivingUser = await client.users.fetch(interaction.user.id);
        const depositImage = new AttachmentBuilder(`./attachments/deposit_${currentUnixMilliseconds}.${attachmentFormat}`);

        await receivingUser.send({ embeds: [depositRequestEmbed], files: [depositImage] });
        await channel.send({ embeds: [depositRequestEmbed], components: [buttonRow], files: [depositImage] });
        await interaction.editReply({ embeds: [successEmbed] });
    }
};