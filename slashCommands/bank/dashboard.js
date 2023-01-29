const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandType } = require("discord.js");
const { userExists } = require("../../utils/checkUser.js");
const { getBalance, getAccountUsername } = require("../../utils/accountDetails.js");

module.exports = {
    name: "dashboard",
    description: "View your bank account dashboard.",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user is not registered
        if (!(await userExists(client, interaction, interaction.user.id, false, true))) return;

        // Get user details
        const username = await getAccountUsername(client, interaction.user.id);
        const balance = await getBalance(client, interaction.user.id);

        // Create embed
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Discover Banking Dashboard" })
                    .addFields(
                        { name: "Account Holder", value: username },
                        { name: "Account Number", value: interaction.user.id },
                        { name: "Balance", value: `$${balance}` },
                        { name: "Loans", value: "blah" },
                    )
                    .setThumbnail("https://raw.githubusercontent.com/Reynard-G/Discover-Banking-Bot/master/assets/dashboard_Thumbnail.gif")
                    .setColor("#2F3136")
                    .setTimestamp()
                    .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
            ]
        });
    }
};