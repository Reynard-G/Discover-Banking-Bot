const { EmbedBuilder } = require("discord.js");
const user = require("../utils/user.js");
const errorMessages = require("../utils/errorMessages.js");

module.exports = {
    id: "agreeTOS_modal",
    permissions: [],
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user already has an account
        if (await user.exists(client, interaction, interaction.user.id, true, true)) return;

        const username = interaction.fields.getTextInputValue("ignInput");

        // Check if username complies with minecraft username rules
        if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
            return await interaction.editReply({
                embeds: [await errorMessages.invalidUsername(interaction)]
            });
        }

        // Create user
        await client.query("INSERT INTO accounts (discord_id, username) VALUES (?, ?)", [interaction.user.id, username]);

        // Send success message
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Successfully Registered Account")
                    .setDescription(
                        "Welcome to Discover Banking! You have successfully registered your account." +
                        "\n\n***Note:** You can only access your account with the Discord account you registered with.*"
                    )
                    .setColor("Green")
                    .setTimestamp()
                    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
            ]
        });
    }
};