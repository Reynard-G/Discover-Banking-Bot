const { EmbedBuilder } = require("discord.js");
const { userExists } = require("../utils/checkUser");

module.exports = {
    id: "agreeTOS_modal",
    permissions: [],
    run: async (client, interaction) => {
        // Defer reply to prevent interaction timeout
        await interaction.deferReply({ ephemeral: true });

        // Check if user already has an account
        if (await userExists(client, interaction, true, true, true)) return;

        const username = interaction.fields.getTextInputValue("ignInput");

        // Check if username complies with minecraft username rules
        if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid Username")
                        .setDescription("Your username must be between 3 and 16 characters long and can only contain letters, numbers and underscores.")
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                ]
            });
        }

        // Create user
        await client.query("INSERT INTO accounts (id, username) VALUES (?, ?)", [interaction.user.id, username]);

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