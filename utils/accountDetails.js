exports.balance = async function (client, discordUserID) {
    const balance = (await client.query(`SELECT SUM(amount) FROM transactions WHERE user_id = "${discordUserID}" AND cr_dr = "CR" AND status = 1`))[0]["SUM(amount)"] - (await client.query(`SELECT SUM(amount) FROM transactions WHERE user_id = "${discordUserID}" AND cr_dr = "DR" AND status = 1`))[0]["SUM(amount)"];
    return balance;
}

exports.username = async function (client, discordUserID) {
    const username = (await client.query(`SELECT username FROM accounts WHERE user_id = "${discordUserID}"`))[0]["username"];
    return username;
}