exports.getBalance = async function (client, discordUserID) {
    const balance = (await client.query(`SELECT SUM(amount) FROM transactions WHERE user_id = "${discordUserID}" AND cr_dr = "cr"`))[0]["SUM(amount)"] - (await client.query(`SELECT SUM(amount) FROM transactions WHERE user_id = "${discordUserID}" AND cr_dr = "dr"`))[0]["SUM(amount)"];
    return balance;
}

exports.getAccountUsername = async function (client, discordUserID) {
    const username = (await client.query(`SELECT username FROM accounts WHERE id = "${discordUserID}"`))[0]["username"];
    return username;
}