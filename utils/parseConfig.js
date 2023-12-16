const config = require('../config.json');

exports.getFees = async function (feeType, amount) {
  // Check if fee type if valid, if not send error message
  if (!["DEPOSIT_FEE", "WITHDRAW_FEE", "TRANSFER_FEE"].includes(feeType)) {
    return new Error(`Invalid fee type: '${feeType}'`);
  }

  // Parse fee from config.json file
  const feeArray = config[feeType];
  for (let i = 0; i < feeArray.length; i++) {
    const start = feeArray[i].range[0] === "Infinity" ? Infinity : feeArray[i].range[0];
    const end = feeArray[i].range[1] === "Infinity" ? Infinity : feeArray[i].range[1];

    if (amount >= start && amount <= end) {
      return feeArray[i].fee;
    }
  }
};

exports.get = function (key) {
  return config[key];
};