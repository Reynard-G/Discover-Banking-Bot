
const errorMessages = require("./errorMessages.js");

exports.exists = async function (client, interaction, userID = interaction.user.id, checkForRegistered, deferred = true) {
    try {
        const user = await client.query("SELECT * FROM accounts WHERE user_id = ?", [userID]);
        const condition = checkForRegistered ? user.length > 0 : user.length === 0;
        if (condition) {
            if (deferred) {
                await interaction.editReply({
                    embeds: [
                        checkForRegistered ? await errorMessages.alreadyHasAccount(interaction) : await errorMessages.doesNotHaveAccount(interaction)
                    ]
                });
            } else {
                await interaction.reply({
                    embeds: [
                        checkForRegistered ? await errorMessages.alreadyHasAccount(interaction) : await errorMessages.doesNotHaveAccount(interaction)
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