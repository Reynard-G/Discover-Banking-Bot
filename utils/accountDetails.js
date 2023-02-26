const user = require("../utils/user.js");

exports.balance = async function (client, userID) {
    const balance = (await client.query(`SELECT SUM(amount) FROM transactions WHERE user_id = "${userID}" AND cr_dr = "CR" AND status = 1 AND creditcard_id IS NULL`))[0]["SUM(amount)"] - (await client.query(`SELECT SUM(amount) FROM transactions WHERE user_id = "${userID}" AND cr_dr = "DR" AND status = 1 AND creditcard_id IS NULL`))[0]["SUM(amount)"];
    return balance;
};

exports.username = async function (client, discordUserID) {
    const username = (await client.query(`SELECT username FROM accounts WHERE discord_id = "${discordUserID}"`))[0]["username"];
    return username;
};

exports.discordID = async function (client, accountID) {
    const discord_id = (await client.query(`SELECT discord_id FROM accounts WHERE id = "${accountID}"`))[0]["discord_id"];
    return discord_id;
};

exports.loanDetails = async function (client, discordUserID) {
    const loans = await client.query(`SELECT *, UNIX_TIMESTAMP(created_at) AS created_at_unix, UNIX_TIMESTAMP(updated_at) AS updated_at_unix FROM loans WHERE user_id = "${await user.id(client, discordUserID)}"`);
    return loans;
};