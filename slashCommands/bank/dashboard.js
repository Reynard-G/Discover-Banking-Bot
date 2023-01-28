const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandType } = require("discord.js");
const { userExists } = require("../../utils/checkUser.js");
const { getBalance, getAccountUsername } = require("../../utils/accountDetails.js");

module.exports = {
    name: "dashboard",
    description: "View your bank account dashboard.",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user is not registered
        if (!(await userExists(client, interaction, false, true, false))) return;

        // Get user details
        const username = await getAccountUsername(client, interaction.user.id);
        const balance = await getBalance(client, interaction.user.id);

        // Create embed
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Discover Banking Dashboard", iconURL: interaction.guild.iconURL() })
                    .addFields(
                        { name: "Account Holder", value: username, inline: true },
                        { name: "Account Number", value: interaction.user.id, inline: true },
                        { name: "\u200B", value: "\u200B", inline: true },
                        { name: "Balance", value: `$${balance}`, inline: true },
                        { name: "Loans", value: "blah", inline: true },
                    )
                    .setThumbnail("https://raw.githubusercontent.com/Reynard-G/Discover-Banking-Bot/master/assets/dashboardThumbnail.gif")
                    .setColor("#2F3136")
                    .setTimestamp()
                    .setFooter({ text: "Discover Bank", iconURL: interaction.guild.iconURL() })
            ]
        });
    }
};