const { EmbedBuilder } = require("discord.js");

exports.userExists = async function (client, interaction, userID = interaction.user.id, checkForRegistered, deferred = true) {
    try {
        const user = await client.query("SELECT * FROM accounts WHERE id = ?", [userID]);
        const condition = checkForRegistered ? user.length > 0 : user.length === 0;
        if (condition) {
            const embed = new EmbedBuilder()
                .setTimestamp()
                .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });

            if (checkForRegistered) {
                embed.setTitle("Registration Failed")
                    .setDescription("It appears you already have a bank account with us. If you believe this is a mistake, please contact a staff member by opening a ticker.")
                    .setColor("Red");
            } else {
                embed.setTitle("Registration Failed")
                    .setDescription("It appears you do not have a bank account with us. Please register with \`/register\` in order to continue.")
                    .setColor("Red");
            }

            if (deferred) {
                await interaction.editReply({ ephemeral: true, embeds: [embed] });
            } else {
                await interaction.reply({ ephemeral: true, embeds: [embed] });
            }

            return checkForRegistered ? true : false;
        }
        return checkForRegistered ? false : true;
    } catch (err) {
        console.log(err);
        return null;
    }
};