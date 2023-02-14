const Decimal = require("decimal.js");

exports.loan = async function (client, loanProductId, amount, interestRate) {
    // Check if loan details comply with loan_products table
    const loanProduct = await client.query(`SELECT * FROM loan_products WHERE id = "${loanProductId}"`);
    if (
        !loanProduct.length ||
        Decimal(amount).gt(loanProduct[0]["maximum_amount"]) ||
        Decimal(amount).lt(loanProduct[0]["minimum_amount"]) ||
        Decimal(interestRate).gt(loanProduct[0]["interest_rate_maximum"]) ||
        Decimal(interestRate).lt(loanProduct[0]["interest_rate_minimum"])
    ) { return false; }
    return true;
};