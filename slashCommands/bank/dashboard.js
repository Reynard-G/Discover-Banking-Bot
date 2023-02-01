const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const checkUser = require("../../utils/checkUser.js");
const accountDetails = require("../../utils/accountDetails.js");

module.exports = {
    name: "dashboard",
    description: "View your bank account dashboard.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    cooldown: 3000,
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user is not registered
        if (!(await checkUser.exists(client, interaction, interaction.user.id, false, true))) return;

        // Get user details
        const username = await accountDetails.username(client, interaction.user.id);
        const balance = await accountDetails.balance(client, interaction.user.id);

        // Create embed
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Discover Banking Dashboard" })
                    .addFields(
                        { name: "Account Holder", value: username },
                        { name: "Account Number", value: interaction.user.id },
                        { name: "Balance", value: `$${balance.toLocaleString()}` },
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