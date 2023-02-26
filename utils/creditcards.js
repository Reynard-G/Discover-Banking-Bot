const Decimal = require("decimal.js");

exports.balance = async function (client, userID) {
    const creditcardProductID = (await client.query(`SELECT creditcard_product_id FROM creditcards WHERE user_id = "${userID}"`))[0]["creditcard_product_id"];
    const limit = (await client.query(`SELECT amount_limit FROM creditcard_products WHERE id = "${creditcardProductID}"`))[0]["amount_limit"];
    const creditcardID = (await client.query(`SELECT id FROM creditcards WHERE user_id = "${userID}"`))[0]["id"];
    const usedBalance = (await client.query(`SELECT SUM(amount) FROM transactions WHERE creditcard_id = "${creditcardID}" AND cr_dr = "DR" AND status = 1`))[0]["SUM(amount)"] - (await client.query(`SELECT SUM(amount) FROM transactions WHERE creditcard_id = "${creditcardID}" AND cr_dr = "CR" AND status = 1`))[0]["SUM(amount)"];
    return Decimal(limit).minus(usedBalance).toNumber();
}

exports.id = async function (client, userID) {
    const creditcardID = (await client.query(`SELECT id FROM creditcards WHERE user_id = "${userID}"`))[0]["id"];
    return creditcardID.toString();
}

exports.exists = async function (client, userID) {
    return (await client.query(`SELECT * FROM creditcards WHERE user_id = "${userID}"`)).length > 0;
}

exports.limit = async function (client, userID) {
    const creditcardProductID = (await client.query(`SELECT creditcard_product_id FROM creditcards WHERE user_id = "${userID}"`))[0]["creditcard_product_id"];
    const limit = (await client.query(`SELECT amount_limit FROM creditcard_products WHERE id = "${creditcardProductID}"`))[0]["amount_limit"];
    return Number(limit);
}