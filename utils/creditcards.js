const Decimal = require("decimal.js");

exports.balance = async function (client, userID) {
  const creditcardID = (await client.query(`SELECT id FROM creditcards WHERE user_id = "${userID}"`))[0]["id"];
  const result = await client.query(`
    SELECT 
      SUM(CASE WHEN cr_dr = "CR" THEN amount ELSE -amount END) AS usedBalance
    FROM 
      transactions
    WHERE 
      creditcard_id = ? AND status = 1
  `, [creditcardID]);
  const usedBalance = Number(result[0].usedBalance);
  return usedBalance;
};

exports.amountSpent = async function (client, userID) {
  const creditcardBalance = await this.balance(client, userID);
  const creditcardLimit = await this.limit(client, userID);

  return new Decimal(creditcardLimit).minus(creditcardBalance).toNumber();
}

exports.interestRate = async function (client, userID) {
  const creditcardID = (await client.query(`SELECT creditcard_product_id FROM creditcards WHERE user_id = "${userID}"`))[0].creditcard_product_id;
  const interestRate = (await client.query(`SELECT interest_rate FROM creditcard_products WHERE id = "${creditcardID}"`))[0].interest_rate;
  return Number(interestRate) / 100;
}

exports.id = async function (client, userID) {
  const creditcards = await client.query(`SELECT id FROM creditcards WHERE user_id = "${userID}"`);
  if (creditcards.length === 0) {
    return null;
  }
  const creditcardID = creditcards[0]["id"];
  return creditcardID.toString();
};

exports.name = async function (client, userID) {
  const creditcardID = (await client.query(`SELECT creditcard_product_id FROM creditcards WHERE user_id = ?`, [userID]))[0].creditcard_product_id;
  const name = (await client.query(`SELECT name FROM creditcard_products WHERE id = ?`, [creditcardID]))[0].name;
  return name;
};

exports.exists = async function (client, userID) {
  return (await client.query(`SELECT * FROM creditcards WHERE user_id = "${userID}"`)).length > 0;
};

exports.limit = async function (client, userID) {
  const creditcardProductID = (await client.query(`SELECT creditcard_product_id FROM creditcards WHERE user_id = ?`, [userID]))[0].creditcard_product_id;
  const limit = (await client.query(`SELECT amount_limit FROM creditcard_products WHERE id = ?`, [creditcardProductID]))[0].amount_limit;
  return Number(limit);
};