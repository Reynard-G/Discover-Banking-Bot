const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandType } = require("discord.js");
const { userExists } = require("../../utils/checkUser.js");

module.exports = {
    name: "register",
    description: "Register a bank account.",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user is already registered
        if (await userExists(client, interaction, interaction.user.id, true, true)) return;

        // Ask user to agree to TOS
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Discover Account Registration")
                    .setDescription(
                        "By clicking the button below, you agree to the terms of service." +
                        "\n\n**Terms of Service**" +
                        "\n(link)"
                    )
                    .setColor("#2F3136")
                    .setTimestamp()
                    .setFooter({ text: "Discover", iconURL: interaction.guild.iconURL() })
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("agreeTOS")
                            .setLabel("I Agree")
                            .setStyle("Success")
                            .setEmoji("1059331958204801065"),
                        new ButtonBuilder()
                            .setCustomId("disagreeTOS")
                            .setLabel("I Disagree")
                            .setStyle("Danger")
                            .setEmoji("1059331996305866823")
                    )
            ]
        });
    }
};