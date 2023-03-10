exports.exists = async function (client, userDiscordID) {
    const user = await client.query("SELECT * FROM accounts WHERE discord_id = ?", [userDiscordID])[0];
    return user ? true : false;
};

exports.id = async function (client, userID) {
    const user = await client.query("SELECT id FROM accounts WHERE discord_id = ?", [userID]);
    return user.length > 0 ? user[0].id : null;
};

exports.username = async function (client, discordUserID) {
    const username = (await client.query(`SELECT username FROM accounts WHERE discord_id = "${discordUserID}"`))[0]["username"];
    return username;
};

exports.discordID = async function (client, accountID) {
    const discord_id = (await client.query(`SELECT discord_id FROM accounts WHERE id = "${accountID}"`))[0]["discord_id"];
    return discord_id;
};