const { EmbedBuilder } = require("discord.js");

exports.userExists = async function (client, interaction, checkForRegistered, deferred = true, desireRegistered = true) {
    try {
        const user = await client.query("SELECT * FROM accounts WHERE id = ?", [interaction.user.id]);
        const condition = checkForRegistered ? user.length > 0 : user.length === 0;
        if (condition) {
            if (deferred && desireRegistered) {
                await interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Registration Failed")
                            .setDescription("It appears you already have a bank account with us. If you believe this is a mistake, please contact a staff member by opening a ticker.")
                            .setColor("Red")
                            .setTimestamp()
                            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                    ]
                });
            } else if (desireRegistered) {
                await interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Registration Failed")
                            .setDescription("It appears you already have a bank account with us. If you believe this is a mistake, please contact a staff member by opening a ticker.")
                            .setColor("Red")
                            .setTimestamp()
                            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                    ]
                });
            } else if (deferred && !desireRegistered) {
                await interaction.editReply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Registration Failed")
                            .setDescription("It appears you do not have a bank account with us. Please register with \`/register\` in order to continue.")
                            .setColor("Red")
                            .setTimestamp()
                            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                    ]
                });
            } else if (!desireRegistered) {
                await interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Registration Failed")
                            .setDescription("It appears you do not have a bank account with us. Please register with \`/register\` in order to continue.")
                            .setColor("Red")
                            .setTimestamp()
                            .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() })
                    ]
                });
            }
            return checkForRegistered ? true : false;
        }
        return checkForRegistered ? false : true;
    } catch (err) {
        console.log(err);
        return null;
    }
};