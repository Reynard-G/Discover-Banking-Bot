const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ApplicationCommandType } = require("discord.js");
const user = require("../../utils/user.js");

module.exports = {
    name: "register",
    description: "Register a bank account.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    cooldown: 3000,
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user is already registered
        if (await user.exists(client, interaction, interaction.user.id, true, true)) return;

        // Ask user to agree to TOS
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Discover Account Registration")
                    .setDescription(
                        "By clicking the button below, you agree to the terms of service." +
                        "\n\n**Terms of Service**" +
                        "\nhttps://docs.google.com/document/d/1ZcWLQSfI9PrJsIAd2g2ZpE-H8L-l8Z4VZvwDwA6ZGFI/edit"
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